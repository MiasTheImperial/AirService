from datetime import datetime, timedelta

from .models import db, Category, Item, Order, OrderItem


def load_demo_data(app):
    """Insert demo categories, items and orders if tables are empty."""
    with app.app_context():
        if Category.query.first() is None and Item.query.first() is None:
            cat_data = [
                ("food", "Еда", "categories/food.jpg"),
                ("drinks", "Напитки", "categories/drinks.jpg"),
                ("alcohol", "Алкоголь", "categories/alcohol.jpg"),
                ("snacks", "Закуски", "categories/snacks.jpg"),
                ("desserts", "Десерты", "categories/desserts.jpg"),
                ("accessories", "Аксессуары", "categories/accessories.jpg"),
                ("services", "Услуги", "categories/services.jpg"),
                ("cosmetics", "Косметика", "categories/cosmetics.jpg"),
                ("toys", "Игрушки", "categories/toys.jpg"),
                ("books", "Книги", "categories/books.jpg"),
            ]
            cats = {cid: Category(name=name, image=image) for cid, name, image in cat_data}
            db.session.add_all(cats.values())
            db.session.flush()

            items_data = [
                ("Куриное филе с овощами", "Нежное куриное филе, приготовленное на гриле, подается с сезонными овощами и соусом.", 750.0, "food", "products/chicken_filet.jpg"),
                ("Паста Карбонара", "Классическая итальянская паста с соусом из сливок, яиц, бекона и сыра пармезан.", 680.0, "food", "products/carbonara.jpg"),
                ("Стейк из говядины", "Сочный стейк из мраморной говядины средней прожарки с картофельным пюре и соусом.", 1200.0, "food", "products/marbled_beef.jpg"),
                ("Рыба с овощами на пару", "Нежное филе лосося, приготовленное на пару, с овощным гарниром и лимонным соусом.", 850.0, "food", "products/steamed_fish.jpg"),
                ("Вегетарианский салат", "Свежий салат из сезонных овощей с оливковым маслом и бальзамическим уксусом.", 450.0, "food", "products/vegeterian_salad.jpg"),
                ("Борщ", "Традиционный украинский борщ со сметаной и чесночными пампушками.", 480.0, "food", "products/borsch.jpg"),
                ("Свежевыжатый апельсиновый сок", "Натуральный свежевыжатый сок из спелых апельсинов.", 350.0, "drinks", "products/orange_juice.jpg"),
                ("Минеральная вода", "Негазированная минеральная вода.", 150.0, "drinks", "products/mineral_water_no_gas.jpg"),
                ("Кофе Американо", "Классический кофе американо из свежемолотых зерен арабики.", 280.0, "drinks", "products/americano_coffee.jpg"),
                ("Чай зеленый", "Китайский зеленый чай с жасмином.", 220.0, "drinks", "products/green_tea.jpg"),
                ("Смузи ягодный", "Освежающий смузи из свежих ягод с йогуртом и медом.", 380.0, "drinks", "products/smoozi.jpg"),
                ("Вино красное сухое", "Итальянское красное сухое вино Кьянти Классико.", 750.0, "alcohol", "products/red_wine.jpg"),
                ("Пиво светлое", "Чешское светлое пиво Пилзнер.", 450.0, "alcohol", "products/beer_white.jpg"),
                ("Виски", "Шотландский односолодовый виски 12 лет выдержки.", 950.0, "alcohol", "products/whiskey.jpg"),
                ("Орешки ассорти", "Смесь жареных орехов с солью.", 320.0, "snacks", "products/nuts_assorty.jpg"),
                ("Чипсы картофельные", "Хрустящие картофельные чипсы с солью и специями.", 280.0, "snacks", "products/potato_chips.jpg"),
                ("Сырная тарелка", "Ассорти из 4 видов сыра с виноградом и крекерами.", 680.0, "snacks", "products/cheese_plate.jpg"),
                ("Тирамису", "Классический итальянский десерт на основе маскарпоне и кофе.", 420.0, "desserts", "products/tiramisu.jpg"),
                ("Чизкейк", "Нежный чизкейк с ягодным соусом.", 390.0, "desserts", "products/raspberry_cheesecake.jpg"),
                ("Шоколадный фондан", "Шоколадный кекс с жидкой начинкой и ванильным мороженым.", 450.0, "desserts", "products/chocolate_fondan.jpg"),
                ("Дорожная подушка", "Удобная подушка для шеи для комфортного сна во время полета.", 980.0, "accessories", "products/travel_pillow.jpg"),
                ("Маска для сна", "Мягкая маска для сна с регулируемым ремешком.", 450.0, "accessories", "products/sleep_mask.jpg"),
                ("Беруши", "Силиконовые беруши для защиты от шума.", 280.0, "accessories", "products/ear_plugs.jpg"),
                ("Увлажняющий крем", "Увлажняющий крем для лица с гиалуроновой кислотой.", 850.0, "cosmetics", "products/soothening_cream.jpg"),
                ("Набор миниатюр", "Дорожный набор миниатюр средств по уходу за кожей.", 1200.0, "cosmetics", "products/miniatur_set.jpg"),
                ("Мягкая игрушка", "Мягкая игрушка в виде самолета для детей.", 680.0, "toys", "products/soft_toy.jpg"),
                ("Набор для раскрашивания", "Детский набор для раскрашивания с карандашами и раскрасками.", 450.0, "toys", "products/safe_paint_set.jpg"),
                ("Роман \"Мастер и Маргарита\"", "Знаменитый роман Михаила Булгакова в мягкой обложке.", 550.0, "books", "products/master_and_margarita.jpg"),
                ("Журнал о путешествиях", "Свежий выпуск журнала о путешествиях и приключениях.", 320.0, "books", "products/travel_journal.jpg"),
                ("WiFi", "Доступ к интернету через Wi-Fi во время полёта.", 10.0, "services", "products/internet_wi-fi.jpg", True),
            ]
            items = [
                Item(
                    name=name,
                    description=desc,
                    price=price,
                    category=cats[cid],
                    image=image,
                    is_service=(rest[0] if rest else False),
                )
                for name, desc, price, cid, image, *rest in items_data
            ]
            db.session.add_all(items)
            db.session.commit()

        if Order.query.first() is None:
            name_to_id = {i.name: i.id for i in Item.query.all()}
            now = datetime.now()
            def dt(m):
                return now - timedelta(minutes=m)
            status_map = {
                "COMPLETED": "done",
                "DELIVERING": "forming",
                "PREPARING": "forming",
                "PENDING": "new",
                "CANCELLED": "cancelled",
            }
            orders_data = [
                ("order-20231015-001", "COMPLETED", 120, [("Паста Карбонара", 1), ("Свежевыжатый апельсиновый сок", 1), ("Тирамису", 1)]),
                ("order-20231015-002", "DELIVERING", 45, [("Кофе Американо", 2), ("Орешки ассорти", 1)]),
                ("order-20231015-003", "PREPARING", 15, [("Куриное филе с овощами", 1), ("Минеральная вода", 1)]),
                ("order-20231015-004", "PENDING", 5, [("Вино красное сухое", 1), ("Сырная тарелка", 1)]),
                ("order-20231014-001", "CANCELLED", 1440, [("Вегетарианский салат", 1)]),
                ("order-20231013-001", "COMPLETED", 2880, [("Стейк из говядины", 1), ("Виски", 1), ("Шоколадный фондан", 1), ("Смузи ягодный", 2)]),
            ]
            for oid, status, offset, items in orders_data:
                order = Order(
                    seat="12A",
                    status=status_map[status],
                    created_at=dt(offset),
                    payment_method="card",
                    idempotency_key=oid,
                )
                db.session.add(order)
                db.session.flush()
                for name, qty in items:
                    db.session.add(OrderItem(order_id=order.id, item_id=name_to_id[name], quantity=qty))
            db.session.commit()
