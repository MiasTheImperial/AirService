from flask import Blueprint, jsonify, request, abort
import logging
from flask_babel import gettext
from marshmallow import ValidationError

from ..models import db, Item, Order, OrderItem
from ..schemas import OrderSchema
from ..events import push_event

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
    if idem_key:
        existing = Order.query.filter_by(idempotency_key=idem_key).first()
        if existing:
            return jsonify({'order_id': existing.id}), 200
    order = Order(seat=seat, idempotency_key=idem_key)
    db.session.add(order)
    db.session.commit()
    for it in items:
        item = db.session.get(Item, it.get('item_id'))
        if item:
            oi = OrderItem(order_id=order.id, item_id=item.id, quantity=it.get('quantity', 1))
            db.session.add(oi)
    db.session.commit()
    logging.info('order_created %s seat=%s', order.id, order.seat)
    push_event({'type': 'order_created', 'order_id': order.id})
    return jsonify({'order_id': order.id}), 201


@orders_bp.route('/orders/<int:order_id>')
def get_order(order_id):
    order = db.session.get(Order, order_id)
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
