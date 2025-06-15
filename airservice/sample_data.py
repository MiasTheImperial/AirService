from datetime import datetime, timedelta

from .models import db, Category, Item, Order, OrderItem


def load_demo_data(app):
    """Insert demo categories, items and orders if tables are empty."""
    with app.app_context():
        # категории с англ. именами
        if Category.query.first() is None and Item.query.first() is None:
            cat_data = [
                ("food",        "Еда",              "Food",             "categories/food.jpg"),
                ("drinks",      "Напитки",          "Drinks",           "categories/drinks.jpg"),
                ("alcohol",     "Алкоголь",         "Alcohol",          "categories/alcohol.jpg"),
                ("snacks",      "Закуски",          "Snacks",           "categories/snacks.jpg"),
                ("desserts",    "Десерты",          "Desserts",         "categories/desserts.jpg"),
                ("accessories", "Аксессуары",       "Accessories",      "categories/accessories.jpg"),
                ("services",    "Услуги",           "Services",         "categories/services.jpg"),
                ("cosmetics",   "Косметика",        "Cosmetics",        "categories/cosmetics.jpg"),
                ("toys",        "Игрушки",          "Toys",             "categories/toys.jpg"),
                ("books",       "Книги",            "Books",            "categories/books.jpg"),
            ]
            cats = {
                cid: Category(name_ru=name_ru, name_en=name_en, image=image)
                for cid, name_ru, name_en, image in cat_data
            }
            db.session.add_all(cats.values())
            db.session.flush()

            # товары с англ. именами и описаниями
            items_data = [
                (
                  "Куриное филе с овощами",
                  "Grilled chicken fillet with vegetables",
                  "Нежное куриное филе, приготовленное на гриле, подается с сезонными овощами и соусом.",
                  "Tender grilled chicken fillet served with seasonal vegetables and sauce.",
                  750.0,
                  "food",
                  "products/chicken_filet.jpg"
                ),
                (
                  "Паста Карбонара",
                  "Carbonara pasta",
                  "Классическая итальянская паста с соусом из сливок, яиц, бекона и сыра пармезан.",
                  "Classic Italian pasta in a creamy sauce of eggs, bacon, and Parmesan cheese.",
                  680.0,
                  "food",
                  "products/carbonara.jpg"
                ),
                (
                  "Стейк из говядины",
                  "Marbled beef steak",
                  "Сочный стейк из мраморной говядины средней прожарки с картофельным пюре и соусом.",
                  "Juicy medium-rare marbled beef steak served with mashed potatoes and sauce.",
                  1200.0,
                  "food",
                  "products/marbled_beef.jpg"
                ),
                (
                  "Рыба с овощами на пару",
                  "Steamed fish with vegetables",
                  "Нежное филе лосося, приготовленное на пару, с овощным гарниром и лимонным соусом.",
                  "Tender steamed salmon fillet served with vegetable garnish and lemon sauce.",
                  850.0,
                  "food",
                  "products/steamed_fish.jpg"
                ),
                (
                  "Вегетарианский салат",
                  "Vegetarian salad",
                  "Свежий салат из сезонных овощей с оливковым маслом и бальзамическим уксусом.",
                  "Fresh seasonal vegetable salad with olive oil and balsamic vinegar.",
                  450.0,
                  "food",
                  "products/vegeterian_salad.jpg"
                ),
                (
                  "Борщ",
                  "Borscht",
                  "Традиционный украинский борщ со сметаной и чесночными пампушками.",
                  "Traditional Ukrainian borscht served with sour cream and garlic pampushkas.",
                  480.0,
                  "food",
                  "products/borsch.jpg"
                ),
                (
                  "Свежевыжатый апельсиновый сок",
                  "Freshly squeezed orange juice",
                  "Натуральный свежевыжатый сок из спелых апельсинов.",
                  "All-natural freshly squeezed orange juice from ripe oranges.",
                  350.0,
                  "drinks",
                  "products/orange_juice.jpg"
                ),
                (
                  "Минеральная вода",
                  "Mineral water",
                  "Негазированная минеральная вода.",
                  "Non-carbonated mineral water.",
                  150.0,
                  "drinks",
                  "products/mineral_water_no_gas.jpg"
                ),
                (
                  "Кофе Американо",
                  "Americano coffee",
                  "Классический кофе американо из свежемолотых зерен арабики.",
                  "Classic Americano coffee made from freshly ground Arabica beans.",
                  280.0,
                  "drinks",
                  "products/americano_coffee.jpg"
                ),
                (
                  "Чай зеленый",
                  "Green tea",
                  "Китайский зеленый чай с жасмином.",
                  "Chinese green tea with jasmine aroma.",
                  220.0,
                  "drinks",
                  "products/green_tea.jpg"
                ),
                (
                  "Смузи ягодный",
                  "Berry smoothie",
                  "Освежающий смузи из свежих ягод с йогуртом и медом.",
                  "Refreshing mixed berry smoothie with yogurt and honey.",
                  380.0,
                  "drinks",
                  "products/smoozi.jpg"
                ),
                (
                  "Вино красное сухое",
                  "Red dry wine",
                  "Итальянское красное сухое вино Кьянти Классико.",
                  "Italian Chianti Classico red dry wine.",
                  750.0,
                  "alcohol",
                  "products/red_wine.jpg"
                ),
                (
                  "Пиво светлое",
                  "Light beer",
                  "Чешское светлое пиво Пилзнер.",
                  "Czech Pilsner light beer.",
                  450.0,
                  "alcohol",
                  "products/beer_white.jpg"
                ),
                (
                  "Виски",
                  "Whiskey",
                  "Шотландский односолодовый виски 12 лет выдержки.",
                  "12-year-old single malt Scotch whisky.",
                  950.0,
                  "alcohol",
                  "products/whiskey.jpg"
                ),
                (
                  "Орешки ассорти",
                  "Assorted nuts",
                  "Смесь жареных орехов с солью.",
                  "Assorted roasted nuts lightly salted.",
                  320.0,
                  "snacks",
                  "products/nuts_assorty.jpg"
                ),
                (
                  "Чипсы картофельные",
                  "Potato chips",
                  "Хрустящие картофельные чипсы с солью и специями.",
                  "Crispy potato chips seasoned with salt and spices.",
                  280.0,
                  "snacks",
                  "products/potato_chips.jpg"
                ),
                (
                  "Сырная тарелка",
                  "Cheese platter",
                  "Ассорти из 4 видов сыра с виноградом и крекерами.",
                  "Assorted cheese platter with grapes and crackers.",
                  680.0,
                  "snacks",
                  "products/cheese_plate.jpg"
                ),
                (
                  "Тирамису",
                  "Tiramisu",
                  "Классический итальянский десерт на основе маскарпоне и кофе.",
                  "Classic Italian dessert made with mascarpone and coffee.",
                  420.0,
                  "desserts",
                  "products/tiramisu.jpg"
                ),
                (
                  "Чизкейк",
                  "Cheesecake",
                  "Нежный чизкейк с ягодным соусом.",
                  "Creamy cheesecake topped with berry sauce.",
                  390.0,
                  "desserts",
                  "products/raspberry_cheesecake.jpg"
                ),
                (
                  "Шоколадный фондан",
                  "Chocolate fondant",
                  "Шоколадный кекс с жидкой начинкой и ванильным мороженым.",
                  "Chocolate lava cake with molten center and vanilla ice cream.",
                  450.0,
                  "desserts",
                  "products/chocolate_fondan.jpg"
                ),
                (
                  "Дорожная подушка",
                  "Travel pillow",
                  "Удобная подушка для шеи для комфортного сна во время полета.",
                  "Comfortable travel neck pillow for restful sleep during flight.",
                  980.0,
                  "accessories",
                  "products/travel_pillow.jpg"
                ),
                (
                  "Маска для сна",
                  "Sleep mask",
                  "Мягкая маска для сна с регулируемым ремешком.",
                  "Soft adjustable sleep mask for peaceful rest.",
                  450.0,
                  "accessories",
                  "products/sleep_mask.jpg"
                ),
                (
                  "Беруши",
                  "Earplugs",
                  "Силиконовые беруши для защиты от шума.",
                  "Silicone earplugs for effective noise protection.",
                  280.0,
                  "accessories",
                  "products/ear_plugs.jpg"
                ),
                (
                  "Увлажняющий крем",
                  "Moisturizing cream",
                  "Увлажняющий крем для лица с гиалуроновой кислотой.",
                  "Facial moisturizing cream with hyaluronic acid.",
                  850.0,
                  "cosmetics",
                  "products/soothening_cream.jpg"
                ),
                (
                  "Набор миниатюр",
                  "Travel-size set",
                  "Дорожный набор миниатюр средств по уходу за кожей.",
                  "Travel-size skincare set with cleanser, toner, and moisturizer.",
                  1200.0,
                  "cosmetics",
                  "products/miniatur_set.jpg"
                ),
                (
                  "Мягкая игрушка",
                  "Soft toy",
                  "Мягкая игрушка в виде динозавра для детей.",
                  "Soft toy in the shape of a dinosaur for kids.",
                  680.0,
                  "toys",
                  "products/soft_toy.jpg"
                ),
                (
                  "Набор для раскрашивания",
                  "Painting kit",
                  "Детский набор для раскрашивания с карандашами и раскрасками.",
                  "Children's painting kit with crayons and coloring sheets.",
                  450.0,
                  "toys",
                  "products/safe_paint_set.jpg"
                ),
                (
                  "Роман \"Мастер и Маргарита\"",
                  "Master and Margarita novel",
                  "Знаменитый роман Михаила Булгакова в мягкой обложке.",
                  "The famous novel by Mikhail Bulgakov in a softcover edition.",
                  550.0,
                  "books",
                  "products/master_and_margarita.jpg"
                ),
                (
                  "Журнал о путешествиях",
                  "Travel magazine",
                  "Свежий выпуск журнала о путешествиях и приключениях.",
                  "Latest issue of a travel and adventure magazine.",
                  320.0,
                  "books",
                  "products/travel_journal.jpg"
                ),
                (
                  "WiFi",
                  "Wi-Fi access",
                  "Доступ к интернету через Wi-Fi во время полёта.",
                  "In-flight Wi-Fi access service.",
                  10.0,
                  "services",
                  "products/internet_wi-fi.jpg",
                  True
                ),
            ]
            items = [
                Item(
                    name_ru=name_ru,
                    name_en=name_en,
                    description_ru=desc_ru,
                    description_en=desc_en,
                    price=price,
                    category=cats[cid],
                    image=image,
                    is_service=(rest[0] if rest else False),
                )
                for name_ru, name_en, desc_ru, desc_en, price, cid, image, *rest
                in items_data
            ]
            db.session.add_all(items)
            db.session.commit()

        if Order.query.first() is None:
            name_to_id = {i.name_ru: i.id for i in Item.query.all()}
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
                for name_ru, qty in items:
                    db.session.add(OrderItem(order_id=order.id, item_id=name_to_id[name_ru], quantity=qty))
            db.session.commit()
