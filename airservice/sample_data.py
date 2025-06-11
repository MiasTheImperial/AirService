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
                "Snacks": Category(name="Snacks", image="categories/snacks.jpg"),
                "Desserts": Category(name="Desserts", image="categories/desserts.jpg"),
                "Cosmetics": Category(name="Cosmetics", image="categories/cosmetics.jpg"),
                "Toys": Category(name="Toys", image="categories/toys.jpg"),
                "Books": Category(name="Books", image="categories/books.jpg"),
                "Parfumes": Category(name="Parfumes", image="categories/parfumes.jpg"),
            }
            # add a subcategory for hierarchy demo
            cats["Alcohol"] = Category(
                name="Alcohol",
                parent=cats["Drinks"],
                image="categories/alcohol.jpg",
            )
            db.session.add_all(cats.values())
            db.session.flush()

            items_data = [
                ("Куриное филе с овощами", "Нежное куриное филе, приготовленное на гриле, подается с сезонными овощами и соусом.", 750.0, "Food", "products/chicken_filet.jpg"),
                ("Паста Карбонара", "Классическая итальянская паста с соусом из сливок, яиц, бекона и сыра пармезан.", 680.0, "Food", "products/carbonara.jpg"),
                ("Стейк из говядины", "Сочный стейк из мраморной говядины средней прожарки с картофельным пюре и соусом.", 1200.0, "Food", "products/marbled_beef.jpg"),
                ("Рыба с овощами на пару", "Нежное филе лосося, приготовленное на пару, с овощным гарниром и лимонным соусом.", 850.0, "Food", "products/steamed_fish.jpg"),
                ("Вегетарианский салат", "Свежий салат из сезонных овощей с оливковым маслом и бальзамическим уксусом.", 450.0, "Food", "products/vegeterian_salad.jpg"),
                ("Борщ", "Традиционный украинский борщ со сметаной и чесночными пампушками.", 480.0, "Food", "products/borsch.jpg"),
                ("Свежевыжатый апельсиновый сок", "Натуральный свежевыжатый сок из спелых апельсинов.", 350.0, "Drinks", "products/orange_juice.jpg"),
                ("Минеральная вода", "Негазированная минеральная вода.", 150.0, "Drinks", "products/mineral_water_no_gas.jpg"),
                ("Кофе Американо", "Классический кофе американо из свежемолотых зерен арабики.", 280.0, "Drinks", "products/americano_coffee.jpg"),
                ("Чай зеленый", "Китайский зеленый чай с жасмином.", 220.0, "Drinks", "products/green_tea.jpg"),
                ("Смузи ягодный", "Освежающий смузи из свежих ягод с йогуртом и медом.", 380.0, "Drinks", "products/smoozi.jpg"),
                ("Вино красное сухое", "Итальянское красное сухое вино Кьянти Классико.", 750.0, "Alcohol", "products/red_wine.jpg"),
                ("Пиво светлое", "Чешское светлое пиво Пилзнер.", 450.0, "Alcohol", "products/beer_white.jpg"),
                ("Виски", "Шотландский односолодовый виски 12 лет выдержки.", 950.0, "Alcohol", "products/whiskey.jpg"),
                ("Орешки ассорти", "Смесь жареных орехов с солью.", 320.0, "Snacks", "products/nuts_assorty.jpg"),
                ("Чипсы картофельные", "Хрустящие картофельные чипсы с солью и специями.", 280.0, "Snacks", "products/potato_chips.jpg"),
                ("Сырная тарелка", "Ассорти из 4 видов сыра с виноградом и крекерами.", 680.0, "Snacks", "products/cheese_plate.jpg"),
                ("Тирамису", "Классический итальянский десерт на основе маскарпоне и кофе.", 420.0, "Desserts", "products/tiramisu.jpg"),
                ("Чизкейк", "Нежный чизкейк с ягодным соусом.", 390.0, "Desserts", "products/raspberry_cheesecake.jpg"),
                ("Шоколадный фондан", "Шоколадный кекс с жидкой начинкой и ванильным мороженым.", 450.0, "Desserts", "products/chocolate_fondan.jpg"),
                ("Дорожная подушка", "Удобная подушка для шеи для комфортного сна во время полета.", 980.0, "Accessories", "products/travel_pillow.jpg"),
                ("Маска для сна", "Мягкая маска для сна с регулируемым ремешком.", 450.0, "Accessories", "products/sleep_mask.jpg"),
                ("Беруши", "Силиконовые беруши для защиты от шума.", 280.0, "Accessories", "products/ear_plugs.jpg"),
                ("Наушники", "Беспроводные наушники с шумоподавлением.", 3500.0, "Accessories", "products/wireless_headphones.jpg"),
                ("Увлажняющий крем", "Увлажняющий крем для лица с гиалуроновой кислотой.", 850.0, "Cosmetics", "products/soothening_cream.jpg"),
                ("Набор миниатюр", "Дорожный набор миниатюр средств по уходу за кожей.", 1200.0, "Cosmetics", "products/miniatur_set.jpg"),
                ("Мягкая игрушка", "Мягкая игрушка в виде самолета для детей.", 680.0, "Toys", "products/soft_toy.jpg"),
                ("Набор для раскрашивания", "Детский набор для раскрашивания с карандашами и раскрасками.", 450.0, "Toys", "products/safe_paint_set.jpg"),
                ("Роман \"Мастер и Маргарита\"", "Знаменитый роман Михаила Булгакова в мягкой обложке.", 550.0, "Books", "products/master_and_margarita.jpg"),
                ("Журнал о путешествиях", "Свежий выпуск журнала о путешествиях и приключениях.", 320.0, "Books", "products/travel_journal.jpg"),
                ("WiFi", "Доступ к Wi-Fi во время полета.", 10.0, "Services", "products/internet_wi-fi.jpg", True),
            ]
            items = [
                Item(
                    name=name,
                    description=desc,
                    price=price,
                    category=cats[cat],
                    image=image,
                    is_service=(rest[0] if rest else False),
                )
                for name, desc, price, cat, image, *rest in items_data
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
