from flask import Blueprint, jsonify, request, abort
import logging
from flask_babel import gettext
from marshmallow import ValidationError

from ..schemas import OrderSchema
from ..services import order_service

orders_bp = Blueprint('orders', __name__)


@orders_bp.route('/orders', methods=['POST'])
def create_order():
    try:
        payload = OrderSchema().load(request.get_json() or {})
    except ValidationError as err:
        return jsonify({'error': gettext('Invalid payload'), 'details': err.messages}), 400
    seat = payload['seat']
    items = payload['items']
    idem_key = request.headers.get('Idempotency-Key')
    order, created = order_service.create_order(seat, items, idempotency_key=idem_key)
    status_code = 201 if created else 200
    return jsonify({'order_id': order.id}), status_code


@orders_bp.route('/orders/<int:order_id>')
def get_order(order_id):
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
