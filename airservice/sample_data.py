from datetime import datetime

from .models import db, Category, Item, Order, OrderItem


def load_demo_data(app):
    """Insert demo categories, items and orders if tables are empty."""
    with app.app_context():
        if Category.query.first() is None and Item.query.first() is None:
            cats = {
                'Food': Category(name='Food'),
                'Drinks': Category(name='Drinks'),
                'Accessories': Category(name='Accessories'),
                'Services': Category(name='Services'),
            }
            cats['Alcohol'] = Category(name='Alcohol', parent=cats['Drinks'])
            db.session.add_all(cats.values())
            db.session.flush()

            items = [
                Item(name='Sandwich', price=5.0, category=cats['Food']),
                Item(name='Salad', price=7.0, category=cats['Food']),
                Item(name='Water', price=1.5, category=cats['Drinks']),
                Item(name='Wine', price=8.0, category=cats['Alcohol']),
                Item(name='Coffee', price=3.0, category=cats['Drinks']),
                Item(name='Blanket', price=15.0, category=cats['Accessories']),
                Item(name='Headphones', price=25.0, category=cats['Accessories']),
                Item(name='WiFi', price=10.0, is_service=True, category=cats['Services']),
                Item(name='Priority Boarding', price=12.0, is_service=True, category=cats['Services']),
            ]
            db.session.add_all(items)
            db.session.commit()

        if Order.query.first() is None:
            goods_list = [
                Item.query.filter_by(name='Sandwich').first().id,
                Item.query.filter_by(name='Water').first().id,
                Item.query.filter_by(name='Blanket').first().id,
            ]
            service_list = [
                Item.query.filter_by(name='WiFi').first().id,
                Item.query.filter_by(name='Priority Boarding').first().id,
            ]
            for year in [2021, 2022, 2023]:
                for month in range(1, 13):
                    for num in range(5):
                        order = Order(
                            seat=f"{month}{num}A",
                            status='done',
                            created_at=datetime(year, month, 15),
                            payment_method='card'
                        )
                        db.session.add(order)
                        db.session.flush()
                        g_id = goods_list[num % len(goods_list)]
                        s_id = service_list[num % len(service_list)]
                        db.session.add(OrderItem(order_id=order.id, item_id=g_id, quantity=1))
                        db.session.add(OrderItem(order_id=order.id, item_id=s_id, quantity=1))
            db.session.commit()
