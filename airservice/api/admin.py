from datetime import datetime
import json
import logging
import os
 
from flask import Blueprint, jsonify, request, abort, current_app, url_for
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
    """List orders with optional filters.

    ---
    parameters:
      - in: query
        name: status
        schema:
          type: string
        description: Filter by order status
      - in: query
        name: seat
        schema:
          type: string
        description: Filter by seat number
      - in: query
        name: from
        schema:
          type: string
          format: date-time
        description: Start of creation period
      - in: query
        name: to
        schema:
          type: string
          format: date-time
        description: End of creation period
    responses:
      200:
        description: List of orders
        content:
          application/json:
            schema:
              type: array
              items:
                type: object
    """
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
    """Update order status.

    ---
    parameters:
      - in: path
        name: order_id
        schema:
          type: integer
        required: true
        description: Order ID
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            properties:
              status:
                type: string
    responses:
      200:
        description: Updated order status
    """
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
    """List items or create a new one.

    ---
    parameters: []
    requestBody:
      content:
        application/json:
          schema:
            type: object
            properties:
              name:
                type: string
              image:
                type: string
              description:
                type: string
              price:
                type: number
              available:
                type: boolean
              service:
                type: boolean
              category_id:
                type: integer
    responses:
      200:
        description: Items returned
      201:
        description: Item created
    """
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
                      'image': url_for('serve_image', filename=i.image) if i.image else None,
                      'price': i.price, 'available': i.available,
                      'service': i.is_service,
                      'category_id': i.category_id,
                      'image': i.image } for i in items])


@admin_bp.route('/items/<int:item_id>', methods=['PUT', 'DELETE'])
def admin_item_detail(item_id):
    """Update or delete a specific item.

    ---
    parameters:
      - in: path
        name: item_id
        schema:
          type: integer
        required: true
        description: Item identifier
    requestBody:
      content:
        application/json:
          schema:
            type: object
            properties:
              name:
                type: string
              image:
                type: string
              description:
                type: string
              price:
                type: number
              available:
                type: boolean
              service:
                type: boolean
              category_id:
                type: integer
    responses:
      200:
        description: Item updated
      204:
        description: Item deleted
    """
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
    """List or create categories.

    ---
    requestBody:
      content:
        application/json:
          schema:
            type: object
            properties:
              name:
                type: string
              parent_id:
                type: integer
              image:
                type: string
    responses:
      200:
        description: Category list
      201:
        description: Category created
    """
    auth_required()
    if request.method == 'POST':
        try:
            data = CategorySchema().load(request.get_json() or {})
        except ValidationError as err:
            return jsonify(err.messages), 400
        cat = Category(name=data['name'],
                       parent_id=data.get('parent_id'),
                       image=data.get('image'))
        db.session.add(cat)
        db.session.commit()
        logging.info('category_created %s', cat.name)
        return jsonify({'id': cat.id}), 201
    cats = Category.query.all()

    return jsonify([{ 'id': c.id, 'name': c.name, 'image': url_for('serve_image', filename=c.image) if c.image else None, 'parent_id': c.parent_id } for c in cats])



@admin_bp.route('/categories/<int:cat_id>', methods=['PUT', 'DELETE'])
def admin_category_detail(cat_id):
    """Update or delete a category.

    ---
    parameters:
      - in: path
        name: cat_id
        schema:
          type: integer
        required: true
        description: Category ID
    requestBody:
      content:
        application/json:
          schema:
            type: object
            properties:
              name:
                type: string
              parent_id:
                type: integer
              image:
                type: string
    responses:
      200:
        description: Category updated
      204:
        description: Category deleted
    """
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
        if 'image' in data:
            cat.image = data['image']
        db.session.commit()
        logging.info('category_updated %s', cat.id)
        return jsonify({'id': cat.id})
    db.session.delete(cat)
    db.session.commit()
    logging.info('category_deleted %s', cat.id)
    return '', 204


@admin_bp.route('/reports/sales')
def sales_report():
    """Get monthly sales totals.

    ---
    parameters:
      - in: query
        name: year
        schema:
          type: integer
        description: Filter report by year
      - in: query
        name: format
        schema:
          type: string
        description: Return CSV when equal to 'csv'
    responses:
      200:
        description: Sales data
    """
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
    """Search server logs.

    ---
    parameters:
      - in: query
        name: q
        schema:
          type: string
        description: Text to search
      - in: query
        name: user
        schema:
          type: string
        description: Filter by username
      - in: query
        name: endpoint
        schema:
          type: string
        description: Filter by endpoint path
      - in: query
        name: from
        schema:
          type: string
          format: date-time
        description: Start of time range
      - in: query
        name: to
        schema:
          type: string
          format: date-time
        description: End of time range
    responses:
      200:
        description: Matching log entries
    """
    auth_required()
    query = request.args.get('q')
    user_f = request.args.get('user')
    endpoint_f = request.args.get('endpoint')
    dt_from = None
    if request.args.get('from'):
        try:
            dt_from = datetime.fromisoformat(request.args['from'])
        except ValueError:
            pass
    dt_to = None
    if request.args.get('to'):
        try:
            dt_to = datetime.fromisoformat(request.args['to'])
        except ValueError:
            pass

    entries = []
    if os.path.exists('airservice.log'):
        with open('airservice.log') as f:
            for ln in f:
                try:
                    entry = json.loads(ln)
                except json.JSONDecodeError:
                    continue
                if query and query not in entry.get('message', ''):
                    continue
                if user_f and entry.get('user') != user_f:
                    continue
                if endpoint_f and entry.get('endpoint') != endpoint_f:
                    continue
                ts_str = entry.get('timestamp')
                if ts_str:
                    try:
                        ts = datetime.fromisoformat(ts_str)
                    except ValueError:
                        ts = None
                else:
                    ts = None
                if dt_from and ts and ts < dt_from:
                    continue
                if dt_to and ts and ts > dt_to:
                    continue
                entries.append(entry)
    return jsonify(entries)
