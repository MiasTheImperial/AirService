import os
import sys
import base64
from datetime import datetime
import json
import logging
import pytest
import subprocess
from pathlib import Path


@pytest.fixture(scope="session", autouse=True)
def compile_translations():
    """Compile .po files to .mo so Flask-Babel can use them."""
    translations_dir = Path(__file__).resolve().parent.parent / "airservice" / "translations"
    subprocess.run(["pybabel", "compile", "-d", str(translations_dir)], check=True)

# allow imports from repo root
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from airservice.app import create_app
from airservice.config import TestConfig
from airservice.models import db, Category, Item, Order, OrderItem


def auth_header():
    creds = base64.b64encode(b'admin:admin').decode()
    return {'Authorization': f'Basic {creds}'}


@pytest.fixture
def app():
    os.environ['DATABASE_URL'] = 'sqlite:///:memory:'
    os.environ['ADMIN_USERNAME'] = 'admin'
    from werkzeug.security import generate_password_hash
    os.environ['ADMIN_PASSWORD_HASH'] = generate_password_hash('admin')
    app = create_app(TestConfig)
    with app.app_context():
        db.create_all()
    yield app
    os.environ.pop('DATABASE_URL', None)
    os.environ.pop('ADMIN_USERNAME', None)
    os.environ.pop('ADMIN_PASSWORD_HASH', None)


@pytest.fixture
def client(app):
    return app.test_client()


@pytest.fixture
def sample_data(app):
    """Populate DB with categories and items."""
    with app.app_context():
        cats = {
            'Food': Category(name='Food', image='categories/food.jpg'),
            'Drinks': Category(name='Drinks', image='categories/drinks.jpg'),
            'Accessories': Category(name='Accessories', image='categories/accessories.jpg'),
            'Services': Category(name='Services', image='categories/services.jpg'),
            'Snacks': Category(name='Snacks', image='categories/snacks.jpg'),
            'Desserts': Category(name='Desserts', image='categories/desserts.jpg'),
            'Cosmetics': Category(name='Cosmetics', image='categories/cosmetics.jpg'),
            'Toys': Category(name='Toys', image='categories/toys.jpg'),
            'Books': Category(name='Books', image='categories/books.jpg'),
            'Parfumes': Category(name='Parfumes', image='categories/parfumes.jpg'),
        }
        # subcategory for hierarchy tests
        cats['Alcohol'] = Category(name='Alcohol', parent=cats['Drinks'], image='categories/alcohol.jpg')
        db.session.add_all(cats.values())
        db.session.flush()
        items_data = [
            ('Куриное филе с овощами', 750.0, 'Food', 'products/chicken_filet.jpg'),
            ('Паста Карбонара', 680.0, 'Food', 'products/carbonara.jpg'),
            ('Стейк из говядины', 1200.0, 'Food', 'products/marbled_beef.jpg'),
            ('Рыба с овощами на пару', 850.0, 'Food', 'products/steamed_fish.jpg'),
            ('Вегетарианский салат', 450.0, 'Food', 'products/vegeterian_salad.jpg'),
            ('Борщ', 480.0, 'Food', 'products/borsch.jpg'),
            ('Свежевыжатый апельсиновый сок', 350.0, 'Drinks', 'products/orange_juice.jpg'),
            ('Минеральная вода', 150.0, 'Drinks', 'products/mineral_water_no_gas.jpg'),
            ('Кофе Американо', 280.0, 'Drinks', 'products/americano_coffee.jpg'),
            ('Чай зеленый', 220.0, 'Drinks', 'products/green_tea.jpg'),
            ('Смузи ягодный', 380.0, 'Drinks', 'products/smoozi.jpg'),
            ('Вино красное сухое', 750.0, 'Alcohol', 'products/red_wine.jpg'),
            ('Пиво светлое', 450.0, 'Alcohol', 'products/beer_white.jpg'),
            ('Виски', 950.0, 'Alcohol', 'products/whiskey.jpg'),
            ('Орешки ассорти', 320.0, 'Snacks', 'products/nuts_assorty.jpg'),
            ('Чипсы картофельные', 280.0, 'Snacks', 'products/potato_chips.jpg'),
            ('Сырная тарелка', 680.0, 'Snacks', 'products/cheese_plate.jpg'),
            ('Тирамису', 420.0, 'Desserts', 'products/tiramisu.jpg'),
            ('Чизкейк', 390.0, 'Desserts', 'products/raspberry_cheesecake.jpg'),
            ('Шоколадный фондан', 450.0, 'Desserts', 'products/chocolate_fondan.jpg'),
            ('Дорожная подушка', 980.0, 'Accessories', 'products/travel_pillow.jpg'),
            ('Маска для сна', 450.0, 'Accessories', 'products/sleep_mask.jpg'),
            ('Беруши', 280.0, 'Accessories', 'products/ear_plugs.jpg'),
            ('Наушники', 3500.0, 'Accessories', 'products/wireless_headphones.jpg'),
            ('Увлажняющий крем', 850.0, 'Cosmetics', 'products/soothening_cream.jpg'),
            ('Набор миниатюр', 1200.0, 'Cosmetics', 'products/miniatur_set.jpg'),
            ('Мягкая игрушка', 680.0, 'Toys', 'products/soft_toy.jpg'),
            ('Набор для раскрашивания', 450.0, 'Toys', 'products/safe_paint_set.jpg'),
            ('Роман "Мастер и Маргарита"', 550.0, 'Books', 'products/master_and_margarita.jpg'),
            ('Журнал о путешествиях', 320.0, 'Books', 'products/travel_journal.jpg'),
            ('WiFi', 10.0, 'Services', 'products/internet_wi-fi.jpg', True),
        ]
        items = [
            Item(name=name, price=price, category=cats[cat], image=image, is_service=(rest[0] if rest else False))
            for name, price, cat, image, *rest in items_data
        ]
        db.session.add_all(items)
        db.session.commit()
        # return primitive IDs to avoid detached instances
        return {
            'categories': {k: c.id for k, c in cats.items()},
            'items': {i.name: i.id for i in items},
        }


@pytest.fixture
def populate_orders(app, sample_data):
    """Create 5 varied orders per month for 3 years."""
    with app.app_context():
        goods_list = [
            sample_data['items']['Паста Карбонара'],
            sample_data['items']['Минеральная вода'],
            sample_data['items']['Вегетарианский салат'],
        ]
        service_list = [
            sample_data['items']['WiFi'],
        ]
        for year in [2021, 2022, 2023]:
            for month in range(1, 13):
                for num in range(5):
                    order = Order(
                        seat=f'{month}{num}A',
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
        # return one of each to use in other tests
        return {'goods_id': goods_list[0], 'service_id': service_list[0]}


@pytest.fixture
def sample_logs():
    entries = [
        {
            'timestamp': '2024-01-01T12:00:00',
            'user': 'admin',
            'endpoint': '/admin/items',
            'message': 'item_created'
        },
        {
            'timestamp': '2024-01-02T13:00:00',
            'user': 'guest',
            'endpoint': '/orders',
            'message': 'order_created'
        },
        {
            'timestamp': '2024-01-03T14:00:00',
            'user': 'admin',
            'endpoint': '/admin/items',
            'message': 'item_deleted'
        },
    ]
    with open('airservice.log', 'w') as f:
        for e in entries:
            f.write(json.dumps(e) + '\n')
    yield entries
    logging.shutdown()
    os.remove('airservice.log')
