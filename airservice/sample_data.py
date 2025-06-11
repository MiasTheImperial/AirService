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
            # add a subcategory for hierarchy demo
            cats["Alcohol"] = Category(
                name="Alcohol",
                parent=cats["Drinks"],
                image="categories/alcohol.jpg",
            )
            db.session.add_all(cats.values())
            db.session.flush()

            items = [
                Item(
                    name="Паста Карбонара",
                    description="Классическая итальянская паста с соусом из сливок, яиц, бекона и сыра пармезан.",
                    price=680.0,
                    category=cats["Food"],
                    image="products/carbonara.jpg",
                ),
                Item(
                    name="Вегетарианский салат",
                    description="Свежий салат из сезонных овощей с оливковым маслом и бальзамическим уксусом.",
                    price=450.0,
                    category=cats["Food"],
                    image="products/vegeterian_salad.jpg",
                ),
                Item(
                    name="Минеральная вода",
                    description="Негазированная минеральная вода.",
                    price=150.0,
                    category=cats["Drinks"],
                    image="products/mineral_water_no_gas.jpg",
                ),
                Item(
                    name="Кофе Американо",
                    description="Классический кофе американо из свежемолотых зерен арабики.",
                    price=280.0,
                    category=cats["Drinks"],
                    image="products/americano_coffee.jpg",
                ),
                Item(
                    name="Вино красное сухое",
                    description="Итальянское красное сухое вино Кьянти Классико.",
                    price=750.0,
                    category=cats["Alcohol"],
                    image="products/red_wine.jpg",
                ),
                Item(
                    name="WiFi",
                    description="Доступ к Wi-Fi во время полета.",
                    price=10.0,
                    is_service=True,
                    category=cats["Services"],
                    image="products/internet_wi-fi.jpg",
                ),
            ]
            db.session.add_all(items)
            db.session.commit()

        if Order.query.first() is None:
            goods_list = [
                Item.query.filter_by(name="Паста Карбонара").first().id,
                Item.query.filter_by(name="Минеральная вода").first().id,
                Item.query.filter_by(name="Вегетарианский салат").first().id,
            ]
            service_list = [
                Item.query.filter_by(name="WiFi").first().id,
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
