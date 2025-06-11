from datetime import datetime

from .models import db, Category, Item, Order, OrderItem


def load_demo_data(app):
    """Insert demo categories, items and orders if tables are empty."""
    with app.app_context():
        if Category.query.first() is None and Item.query.first() is None:
            cats = {
                "Food": Category(name="Food", image="categories/food.jpg"),
                "Drinks": Category(name="Drinks", image="categories/drinks.jpg"),
                "Accessories": Category(name="Accessories", image="categories/accessories.jpg"),
                "Services": Category(name="Services", image="categories/services.jpg"),
            }
            db.session.add_all(cats.values())
            db.session.flush()

            items = [
                Item(name="Sandwich", price=5.0, category=cats["Food"], image="products/sandwich.jpg"),
                Item(name="Salad", price=7.0, category=cats["Food"], image="products/salad.jpg"),
                Item(name="Water", price=1.5, category=cats["Drinks"], image="products/water.jpg"),
                Item(name="Wine", price=8.0, category=cats["Alcohol"], image="products/wine.jpg"),
                Item(name="Coffee", price=3.0, category=cats["Drinks"], image="products/coffee.jpg"),
                Item(name="Blanket", price=15.0, category=cats["Accessories"], image="products/blanket.jpg"),
                Item(name="Headphones", price=25.0, category=cats["Accessories"], image="products/headphones.jpg"),
                Item(
                    name="WiFi", price=10.0, is_service=True, category=cats["Services"], image="products/wifi.jpg"
                ),
                Item(
                    name="Priority Boarding",
                    image="priority_boarding.png",
                    price=12.0,
                    is_service=True,
                    category=cats["Services"],
                    image="products/priority.jpg",
                ),
            ]
            db.session.add_all(items)
            db.session.commit()

        if Order.query.first() is None:
            goods_list = [
                Item.query.filter_by(name="Sandwich").first().id,
                Item.query.filter_by(name="Water").first().id,
                Item.query.filter_by(name="Blanket").first().id,
            ]
            service_list = [
                Item.query.filter_by(name="WiFi").first().id,
                Item.query.filter_by(name="Priority Boarding").first().id,
            ]

            demo_dates = [
                datetime(2023, 7, 1),
                datetime(2023, 7, 5),
                datetime(2023, 7, 10),
                datetime(2023, 8, 1),
                datetime(2023, 8, 5),
            ]

            for idx, dt in enumerate(demo_dates):
                seat = "5A" if idx < 3 else f"1{idx}A"
                order = Order(
                    seat=seat, status="done", created_at=dt, payment_method="card"
                )
                db.session.add(order)
                db.session.flush()
                g_id = goods_list[idx % len(goods_list)]
                s_id = service_list[idx % len(service_list)]
                db.session.add(OrderItem(order_id=order.id, item_id=g_id, quantity=1))
                db.session.add(OrderItem(order_id=order.id, item_id=s_id, quantity=1))
            db.session.commit()
