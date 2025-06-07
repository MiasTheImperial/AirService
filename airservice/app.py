from flask import Flask, jsonify, request, abort
from datetime import datetime
from werkzeug.security import check_password_hash, generate_password_hash
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_babel import Babel, gettext
from flasgger import Swagger
import logging
from .models import db, Item, Order, OrderItem, Category, ORDER_STATUSES


def create_app(config_object=None):
    app = Flask(__name__)
    app.config.update({
        'SQLALCHEMY_DATABASE_URI': 'sqlite:///airservice.db',
        'SQLALCHEMY_TRACK_MODIFICATIONS': False,
        'ADMIN_USERNAME': 'admin',
        'ADMIN_PASSWORD_HASH': generate_password_hash('admin'),
        'BABEL_DEFAULT_LOCALE': 'ru',
    })
    if config_object:
        app.config.from_object(config_object)

    # configure logging
    logging.basicConfig(filename='airservice.log', level=logging.INFO)

    # rate limiting
    Limiter(get_remote_address, app=app, default_limits=['100 per hour'])

    # i18n and swagger
    Babel(app)
    Swagger(app)

    db.init_app(app)

    with app.app_context():
        db.create_all()

    def auth_required():
        auth = request.authorization
        if not auth or not (auth.username == app.config['ADMIN_USERNAME'] and
                            check_password_hash(app.config['ADMIN_PASSWORD_HASH'], auth.password)):
            abort(401)

    @app.route('/catalog')
    def catalog():
        qs = Item.query
        category = request.args.get('category')
        if category:
            qs = qs.join(Category).filter(Category.id == category)
        price_min = request.args.get('price_min', type=float)
        price_max = request.args.get('price_max', type=float)
        if price_min is not None:
            qs = qs.filter(Item.price >= price_min)
        if price_max is not None:
            qs = qs.filter(Item.price <= price_max)
        if request.args.get('available') == '1':
            qs = qs.filter(Item.available.is_(True))
        query = request.args.get('q')
        if query:
            like = f"%{query}%"
            qs = qs.filter(Item.name.ilike(like) | Item.description.ilike(like))
        items = qs.all()
        data = [
            {
                'id': i.id,
                'name': i.name,
                'description': i.description,
                'price': i.price,
                'available': i.available,
                'category': i.category.name if i.category else None,
            }
            for i in items
        ]
        return jsonify(data)

    @app.route('/orders', methods=['POST'])
    def create_order():
        data = request.get_json() or {}
        seat = data.get('seat')
        items = data.get('items', [])
        if not seat or not isinstance(items, list):
            return jsonify({'error': gettext('Invalid payload')}), 400
        idem_key = request.headers.get('Idempotency-Key')
        if idem_key:
            existing = Order.query.filter_by(idempotency_key=idem_key).first()
            if existing:
                return jsonify({'order_id': existing.id}), 200
        order = Order(seat=seat, idempotency_key=idem_key)
        db.session.add(order)
        db.session.commit()
        for it in items:
            item = Item.query.get(it.get('item_id'))
            if item:
                oi = OrderItem(order_id=order.id, item_id=item.id, quantity=it.get('quantity', 1))
                db.session.add(oi)
        db.session.commit()
        logging.info('order_created %s seat=%s', order.id, order.seat)
        return jsonify({'order_id': order.id}), 201

    @app.route('/orders/<int:order_id>')
    def get_order(order_id):
        order = Order.query.get_or_404(order_id)
        return jsonify({
            'id': order.id,
            'seat': order.seat,
            'status': order.status,
            'items': [
                {'name': oi.item.name, 'quantity': oi.quantity}
                for oi in order.items
            ]
        })

    @app.route('/admin/orders')
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

    @app.route('/admin/orders/<int:order_id>', methods=['PATCH'])
    def update_order(order_id):
        auth_required()
        order = Order.query.get_or_404(order_id)
        data = request.get_json() or {}
        status = data.get('status')
        if status and status in ORDER_STATUSES:
            order.status = status
            db.session.commit()
            logging.info('order_status_change %s status=%s', order.id, status)
        return jsonify({'status': order.status})

    @app.route('/admin/items', methods=['GET', 'POST'])
    def admin_items():
        auth_required()
        if request.method == 'POST':
            data = request.get_json() or {}
            item = Item(name=data.get('name'), description=data.get('description'),
                        price=data.get('price', 0.0), available=data.get('available', True),
                        category_id=data.get('category_id'))
            db.session.add(item)
            db.session.commit()
            logging.info('item_created %s', item.name)
            return jsonify({'id': item.id}), 201
        items = Item.query.all()
        return jsonify([{ 'id': i.id, 'name': i.name, 'description': i.description,
                          'price': i.price, 'available': i.available,
                          'category_id': i.category_id } for i in items])

    @app.route('/admin/items/<int:item_id>', methods=['PUT', 'DELETE'])
    def admin_item_detail(item_id):
        auth_required()
        item = Item.query.get_or_404(item_id)
        if request.method == 'PUT':
            data = request.get_json() or {}
            item.name = data.get('name', item.name)
            item.description = data.get('description', item.description)
            if 'price' in data:
                item.price = data['price']
            if 'available' in data:
                item.available = data['available']
            if 'category_id' in data:
                item.category_id = data['category_id']
            db.session.commit()
            logging.info('item_updated %s', item.id)
            return jsonify({'id': item.id})
        db.session.delete(item)
        db.session.commit()
        logging.info('item_deleted %s', item.id)
        return '', 204

    @app.route('/admin/categories', methods=['GET', 'POST'])
    def admin_categories():
        auth_required()
        if request.method == 'POST':
            data = request.get_json() or {}
            cat = Category(name=data.get('name'), parent_id=data.get('parent_id'))
            db.session.add(cat)
            db.session.commit()
            logging.info('category_created %s', cat.name)
            return jsonify({'id': cat.id}), 201
        cats = Category.query.all()
        return jsonify([{ 'id': c.id, 'name': c.name, 'parent_id': c.parent_id } for c in cats])

    @app.route('/admin/categories/<int:cat_id>', methods=['PUT', 'DELETE'])
    def admin_category_detail(cat_id):
        auth_required()
        cat = Category.query.get_or_404(cat_id)
        if request.method == 'PUT':
            data = request.get_json() or {}
            cat.name = data.get('name', cat.name)
            if 'parent_id' in data:
                cat.parent_id = data['parent_id']
            db.session.commit()
            logging.info('category_updated %s', cat.id)
            return jsonify({'id': cat.id})
        db.session.delete(cat)
        db.session.commit()
        logging.info('category_deleted %s', cat.id)
        return '', 204

    return app


if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
