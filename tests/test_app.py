import os
import sys
import base64
from datetime import datetime

import pytest

# allow imports from repo root
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from airservice.app import create_app
from airservice.models import db, Category, Item, Order, OrderItem


def auth_header():
    creds = base64.b64encode(b'admin:admin').decode()
    return {'Authorization': f'Basic {creds}'}


@pytest.fixture
def app():
    os.environ['DATABASE_URL'] = 'sqlite:///:memory:'
    app = create_app({'TESTING': True})
    with app.app_context():
        db.create_all()
    yield app
    os.environ.pop('DATABASE_URL', None)


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
        db.session.add_all(cats.values())
        db.session.flush()
        items = [
            Item(name='Sandwich', price=5.0, category=cats['Food']),
            Item(name='Salad', price=7.0, category=cats['Food']),
            Item(name='Water', price=1.5, category=cats['Drinks']),
            Item(name='Wine', price=8.0, category=cats['Drinks']),
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
                        created_at=datetime(year, month, 15)
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


def test_catalog_filters(client, sample_data):
    # all items
    rv = client.get('/catalog')
    assert rv.status_code == 200
    assert len(rv.get_json()) == 9

    # by category
    food_cat = sample_data['categories']['Food']
    rv = client.get(f'/catalog?category={food_cat}')
    assert {i['name'] for i in rv.get_json()} == {'Sandwich', 'Salad'}

    # service items only
    rv = client.get('/catalog?service=1')
    names = {i['name'] for i in rv.get_json()}
    assert names == {'WiFi', 'Priority Boarding'}

    # search by name
    rv = client.get('/catalog?q=head')
    assert rv.get_json()[0]['name'] == 'Headphones'



def test_order_flow_and_idempotency(client, sample_data):
    item_id = sample_data['items']['Sandwich']
    payload = {
        'seat': '10B',
        'items': [{'item_id': item_id, 'quantity': 2}]
    }
    rv = client.post('/orders', json=payload, headers={'Idempotency-Key': '123'})
    assert rv.status_code == 201
    order_id = rv.get_json()['order_id']

    # idempotent repeat
    rv2 = client.post('/orders', json=payload, headers={'Idempotency-Key': '123'})
    assert rv2.status_code == 200
    assert rv2.get_json()['order_id'] == order_id

    rv = client.get(f'/orders/{order_id}')
    assert rv.status_code == 200
    assert rv.get_json()['seat'] == '10B'

    rv = client.patch(f'/admin/orders/{order_id}', json={'status': 'done'}, headers=auth_header())
    assert rv.status_code == 200
    assert rv.get_json()['status'] == 'done'



def test_admin_item_crud(client, app, sample_data):
    cat = sample_data['categories']['Food']
    rv = client.post('/admin/items', json={'name': 'Soup', 'price': 4.0, 'category_id': cat}, headers=auth_header())
    assert rv.status_code == 201
    item_id = rv.get_json()['id']

    rv = client.put(f'/admin/items/{item_id}', json={'price': 4.5}, headers=auth_header())
    assert rv.status_code == 200

    rv = client.get('/catalog?q=Soup')
    assert rv.get_json()[0]['price'] == 4.5

    rv = client.delete(f'/admin/items/{item_id}', headers=auth_header())
    assert rv.status_code == 204

    rv = client.get('/catalog?q=Soup')
    assert rv.get_json() == []



def test_admin_category_crud(client, app):
    rv = client.post('/admin/categories', json={'name': 'Extras'}, headers=auth_header())
    assert rv.status_code == 201
    cat_id = rv.get_json()['id']

    rv = client.put(f'/admin/categories/{cat_id}', json={'name': 'Extra'}, headers=auth_header())
    assert rv.status_code == 200

    rv = client.get('/admin/categories', headers=auth_header())
    names = {c['name'] for c in rv.get_json()}
    assert 'Extra' in names

    rv = client.delete(f'/admin/categories/{cat_id}', headers=auth_header())
    assert rv.status_code == 204



def test_order_listing_and_filters(client, populate_orders):
    # all orders
    rv = client.get('/admin/orders', headers=auth_header())
    assert rv.status_code == 200
    assert len(rv.get_json()) == 180

    # filter by year range
    rv = client.get('/admin/orders?from=2022-01-01&to=2022-12-31', headers=auth_header())
    assert len(rv.get_json()) == 60



def test_sales_report_multiple_years(client, populate_orders):
    rv = client.get('/admin/reports/sales?year=2022', headers=auth_header())
    data = rv.get_json()
    assert len(data) == 12
    assert data['2022-01']['goods'] == 28.0
    assert data['2022-01']['services'] == 54.0

    rv = client.get('/admin/reports/sales?year=2023', headers=auth_header())
    data = rv.get_json()
    assert data['2023-12']['goods'] == 28.0
    assert data['2023-12']['services'] == 54.0


def test_admin_requires_auth(client):
    rv = client.get('/admin/items')
    assert rv.status_code == 401
    rv = client.get('/admin/categories')
    assert rv.status_code == 401
    rv = client.get('/admin/orders')
    assert rv.status_code == 401

def test_create_order_invalid_payload(client):
    rv = client.post('/orders', json={'items': []})
    assert rv.status_code == 400
    rv = client.post('/orders', json={'seat': '1A', 'items': {}})
    assert rv.status_code == 400

def test_update_order_status_validation(client, sample_data):
    item_id = sample_data['items']['Sandwich']
    rv = client.post('/orders', json={'seat': '15C', 'items': [{'item_id': item_id}]} )
    assert rv.status_code == 201
    order_id = rv.get_json()['order_id']
    rv = client.patch(f'/admin/orders/{order_id}', json={'status': 'forming'}, headers=auth_header())
    assert rv.status_code == 200
    assert rv.get_json()['status'] == 'forming'
    rv = client.patch(f'/admin/orders/{order_id}', json={'status': 'bad'}, headers=auth_header())
    assert rv.status_code == 200
    assert rv.get_json()['status'] == 'forming'

def test_catalog_availability_filter(client, sample_data):
    wine_id = sample_data['items']['Wine']
    client.put(f'/admin/items/{wine_id}', json={'available': False}, headers=auth_header())
    rv = client.get('/catalog?available=1')
    names = {i['name'] for i in rv.get_json()}
    assert 'Wine' not in names
    rv = client.get('/catalog?available=0')
    names = {i['name'] for i in rv.get_json()}
    assert 'Wine' in names
