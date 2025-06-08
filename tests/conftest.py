import os
import sys
import base64
from datetime import datetime
import json
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
            'Food': Category(name='Food'),
            'Drinks': Category(name='Drinks'),
            'Accessories': Category(name='Accessories'),
            'Services': Category(name='Services'),
        }
        # subcategory for hierarchy tests
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
            sample_data['items']['Sandwich'],
            sample_data['items']['Water'],
            sample_data['items']['Blanket'],
        ]
        service_list = [
            sample_data['items']['WiFi'],
            sample_data['items']['Priority Boarding'],
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
    os.remove('airservice.log')
