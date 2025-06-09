from datetime import datetime
from werkzeug.security import generate_password_hash

from .models import db, Category, Item, Order, OrderItem, User


def load_demo_data(app) -> dict[str, dict[str, int]]:
    """Populate the database with demo categories, items and a few orders."""
    with app.app_context():
        categories = {
            'Food': Category(name='Food'),
            'Drinks': Category(name='Drinks'),
            'Accessories': Category(name='Accessories'),
            'Services': Category(name='Services'),
        }
        categories['Alcohol'] = Category(name='Alcohol', parent=categories['Drinks'])

        if not Category.query.first():
            db.session.add_all(categories.values())
            db.session.flush()

            items = [
                Item(name='Sandwich', price=5.0, category=categories['Food']),
                Item(name='Salad', price=7.0, category=categories['Food']),
                Item(name='Water', price=1.5, category=categories['Drinks']),
                Item(name='Wine', price=8.0, category=categories['Alcohol']),
                Item(name='Coffee', price=3.0, category=categories['Drinks']),
                Item(name='Blanket', price=15.0, category=categories['Accessories']),
                Item(name='Headphones', price=25.0, category=categories['Accessories']),
                Item(name='WiFi', price=10.0, is_service=True, category=categories['Services']),
                Item(name='Priority Boarding', price=12.0, is_service=True, category=categories['Services']),
            ]
            db.session.add_all(items)
            db.session.commit()
        else:
            items = Item.query.all()

        item_map = {i.name: i.id for i in items}

        user = User.query.filter_by(email='user@example.com').first()
        if not user:
            user = User(
                email='user@example.com',
                password_hash=generate_password_hash('password'),
                seat='5A'
            )
            db.session.add(user)
            db.session.commit()

        if not Order.query.filter_by(seat=user.seat).first():
            goods_list = [item_map['Sandwich'], item_map['Water'], item_map['Blanket']]
            service_list = [item_map['WiFi'], item_map['Priority Boarding']]
            for num in range(3):
                order = Order(
                    seat=user.seat,
                    status='done',
                    created_at=datetime(2024, 1, 15 + num),
                    payment_method='card'
                )
                db.session.add(order)
                db.session.flush()
                g_id = goods_list[num % len(goods_list)]
                s_id = service_list[num % len(service_list)]
                db.session.add(OrderItem(order_id=order.id, item_id=g_id, quantity=1))
                db.session.add(OrderItem(order_id=order.id, item_id=s_id, quantity=1))
            db.session.commit()

        return {
            'categories': {c.name: c.id for c in categories.values()},
            'items': item_map,
        }


if __name__ == '__main__':
    from .app import create_app
    app = create_app()
    load_demo_data(app)
