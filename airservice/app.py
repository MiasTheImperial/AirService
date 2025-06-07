from flask import Flask, jsonify, request, abort
from werkzeug.security import check_password_hash, generate_password_hash
from .models import db, Item, Order, OrderItem, Category


def create_app(config_object=None):
    app = Flask(__name__)
    app.config.update({
        'SQLALCHEMY_DATABASE_URI': 'sqlite:///airservice.db',
        'SQLALCHEMY_TRACK_MODIFICATIONS': False,
        'ADMIN_USERNAME': 'admin',
        'ADMIN_PASSWORD_HASH': generate_password_hash('admin'),
    })
    if config_object:
        app.config.from_object(config_object)

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
        items = Item.query.all()
        data = [
            {'id': i.id, 'name': i.name, 'price': i.price, 'category': i.category.name if i.category else None}
            for i in items
        ]
        return jsonify(data)

    @app.route('/orders', methods=['POST'])
    def create_order():
        data = request.get_json() or {}
        seat = data.get('seat')
        items = data.get('items', [])
        if not seat or not isinstance(items, list):
            return jsonify({'error': 'Invalid payload'}), 400
        order = Order(seat=seat)
        db.session.add(order)
        db.session.commit()
        for it in items:
            item = Item.query.get(it.get('item_id'))
            if item:
                oi = OrderItem(order_id=order.id, item_id=item.id, quantity=it.get('quantity', 1))
                db.session.add(oi)
        db.session.commit()
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
        orders = Order.query.all()
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
        if status:
            order.status = status
            db.session.commit()
        return jsonify({'status': order.status})

    return app


if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
