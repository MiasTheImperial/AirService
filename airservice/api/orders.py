from flask import Blueprint, jsonify, request, abort
import logging
from flask_babel import gettext
from marshmallow import ValidationError

from ..schemas import OrderSchema
from ..services import order_service

orders_bp = Blueprint('orders', __name__)


@orders_bp.route('/orders', methods=['POST'])
def create_order():
    """Create a new order.

    ---
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            properties:
              seat:
                type: string
              items:
                type: array
                items:
                  type: object
                  properties:
                    item_id:
                      type: integer
                    quantity:
                      type: integer
              payment_method:
                type: string
    responses:
      201:
        description: Order created
        content:
          application/json:
            schema:
              type: object
              properties:
                order_id:
                  type: integer
      200:
        description: Existing order returned when idempotency key matches
    """
    try:
        payload = OrderSchema().load(request.get_json() or {})
    except ValidationError as err:
        return jsonify({'error': gettext('Invalid payload'), 'details': err.messages}), 400
    seat = payload['seat']
    items = payload['items']
    payment_method = payload.get('payment_method')
    idem_key = request.headers.get('Idempotency-Key')
    try:
        order, created = order_service.create_order(
            seat,
            items,
            payment_method=payment_method,
            idempotency_key=idem_key,
        )
    except ValueError as err:
        return jsonify({'error': str(err)}), 400
    status_code = 201 if created else 200
    return jsonify({'order_id': order.id}), status_code


@orders_bp.route('/orders/<int:order_id>')
def get_order(order_id):
    """Retrieve an order by id.

    ---
    parameters:
      - in: path
        name: order_id
        schema:
          type: integer
        required: true
        description: ID of the order
    responses:
      200:
        description: Order details
        content:
          application/json:
            schema:
              type: object
              properties:
                id:
                  type: integer
                seat:
                  type: string
                status:
                  type: string
                items:
                  type: array
                  items:
                    type: object
                    properties:
                      name:
                        type: string
                      quantity:
                        type: integer
      404:
        description: Order not found
    """
    order = order_service.get_order(order_id)
    if not order:
        abort(404)
    return jsonify({
        'id': order.id,
        'seat': order.seat,
        'status': order.status,
        'items': [
            {'name': oi.item.name, 'quantity': oi.quantity}
            for oi in order.items
        ]
    })
