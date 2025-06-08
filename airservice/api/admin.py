from datetime import datetime
import logging
import os
 
from flask import Blueprint, jsonify, request, abort, current_app
from werkzeug.security import check_password_hash
from marshmallow import ValidationError

from ..models import db, Item, Order, OrderItem, Category, ORDER_STATUSES
from ..schemas import ItemSchema, CategorySchema
from ..events import push_event
from ..services import order_service, item_service

admin_bp = Blueprint('admin', __name__)


def auth_required():
    auth = request.authorization
    if not auth or not (
        auth.username == current_app.config['ADMIN_USERNAME'] and
        check_password_hash(current_app.config['ADMIN_PASSWORD_HASH'], auth.password)
    ):
        abort(401)


@admin_bp.route('/orders')
def list_orders():
    auth_required()
    qs = Order.query
    status_f = request.args.get('status')
    if status_f:
        qs = qs.filter(Order.status == status_f)
    seat_f = request.args.get('seat')
    if seat_f:
        qs = qs.filter(Order.seat == seat_f)
    if request.args.get('from'):
        try:
            dt_from = datetime.fromisoformat(request.args['from'])
            qs = qs.filter(Order.created_at >= dt_from)
        except ValueError:
            pass
    if request.args.get('to'):
        try:
            dt_to = datetime.fromisoformat(request.args['to'])
            qs = qs.filter(Order.created_at <= dt_to)
        except ValueError:
            pass
    orders = qs.all()
    return jsonify([
        {
            'id': o.id,
            'seat': o.seat,
            'status': o.status,
            'items': [{'name': i.item.name, 'quantity': i.quantity} for i in o.items]
        } for o in orders
    ])


@admin_bp.route('/orders/<int:order_id>', methods=['PATCH'])
def update_order(order_id):
    auth_required()
    order = order_service.get_order(order_id)
    if not order:
        abort(404)
    data = request.get_json() or {}
    status = data.get('status')
    if status and status in ORDER_STATUSES:
        order = order_service.update_order_status(order_id, status)
    return jsonify({'status': order.status})


@admin_bp.route('/items', methods=['GET', 'POST'])
def admin_items():
    auth_required()
    if request.method == 'POST':
        try:
            data = ItemSchema().load(request.get_json() or {})
        except ValidationError as err:
            return jsonify(err.messages), 400
        item = item_service.create_item(data)
        return jsonify({'id': item.id}), 201
    items = Item.query.all()
    return jsonify([{ 'id': i.id, 'name': i.name, 'description': i.description,
                      'price': i.price, 'available': i.available,
                      'service': i.is_service,
                      'category_id': i.category_id } for i in items])


@admin_bp.route('/items/<int:item_id>', methods=['PUT', 'DELETE'])
def admin_item_detail(item_id):
    auth_required()
    item = db.session.get(Item, item_id)
    if not item:
        abort(404)
    if request.method == 'PUT':
        try:
            data = ItemSchema(partial=True).load(request.get_json() or {})
        except ValidationError as err:
            return jsonify(err.messages), 400
        item = item_service.update_item(item, data)
        return jsonify({'id': item.id})
    item_service.delete_item(item)
    return '', 204


@admin_bp.route('/categories', methods=['GET', 'POST'])
def admin_categories():
    auth_required()
    if request.method == 'POST':
        try:
            data = CategorySchema().load(request.get_json() or {})
        except ValidationError as err:
            return jsonify(err.messages), 400
        cat = Category(name=data['name'], parent_id=data.get('parent_id'))
        db.session.add(cat)
        db.session.commit()
        logging.info('category_created %s', cat.name)
        return jsonify({'id': cat.id}), 201
    cats = Category.query.all()
    return jsonify([{ 'id': c.id, 'name': c.name, 'parent_id': c.parent_id } for c in cats])


@admin_bp.route('/categories/<int:cat_id>', methods=['PUT', 'DELETE'])
def admin_category_detail(cat_id):
    auth_required()
    cat = db.session.get(Category, cat_id)
    if not cat:
        abort(404)
    if request.method == 'PUT':
        try:
            data = CategorySchema(partial=True).load(request.get_json() or {})
        except ValidationError as err:
            return jsonify(err.messages), 400
        if 'name' in data:
            cat.name = data['name']
        if 'parent_id' in data:
            cat.parent_id = data['parent_id']
        db.session.commit()
        logging.info('category_updated %s', cat.id)
        return jsonify({'id': cat.id})
    db.session.delete(cat)
    db.session.commit()
    logging.info('category_deleted %s', cat.id)
    return '', 204


@admin_bp.route('/reports/sales')
def sales_report():
    auth_required()
    year = request.args.get('year', type=int)
    as_csv = request.args.get('format') == 'csv'
    qs = db.session.query(
        db.func.extract('year', Order.created_at).label('year'),
        db.func.extract('month', Order.created_at).label('month'),
        db.func.sum(OrderItem.quantity * Item.price).label('total'),
        Item.is_service
    ).join(OrderItem, Order.id == OrderItem.order_id)
    qs = qs.join(Item, Item.id == OrderItem.item_id)
    if year:
        qs = qs.filter(db.func.extract('year', Order.created_at) == year)
    qs = qs.group_by('year', 'month', Item.is_service).order_by('year', 'month')
    rows = qs.all()
    result = {}
    for r in rows:
        key = f"{int(r.year):04d}-{int(r.month):02d}"
        result.setdefault(key, {'goods': 0, 'services': 0})
        if r.is_service:
            result[key]['services'] += float(r.total or 0)
        else:
            result[key]['goods'] += float(r.total or 0)
    if as_csv:
        import csv
        from io import StringIO
        output = StringIO()
        writer = csv.writer(output)
        writer.writerow(['month', 'goods', 'services'])
        for k, v in result.items():
            writer.writerow([k, v['goods'], v['services']])
        output.seek(0)
        return current_app.response_class(output.read(), mimetype='text/csv')
    return jsonify(result)


@admin_bp.route('/logs')
def search_logs():
    auth_required()
    query = request.args.get('q', '')
    lines = []
    if os.path.exists('airservice.log'):
        with open('airservice.log') as f:
            for ln in f:
                if query in ln:
                    lines.append(ln.strip())
    return jsonify(lines)
