from conftest import auth_header


def test_admin_item_crud(client, app, sample_data):
    cat = sample_data['categories']['Food']
    rv = client.post('/admin/items', json={'name': 'Soup', 'price': 4.0, 'category_id': cat}, headers=auth_header())
    assert rv.status_code == 201
    item_id = rv.get_json()['id']

    rv = client.get('/admin/items', headers=auth_header())
    items = rv.get_json()
    assert any(i['id'] == item_id or i['name'] == 'Soup' for i in items)

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
    rv = client.get('/admin/orders', headers=auth_header())
    assert rv.status_code == 200
    assert len(rv.get_json()) == 180

    rv = client.get('/admin/orders?from=2022-01-01&to=2022-12-31', headers=auth_header())
    assert len(rv.get_json()) == 60


def test_admin_order_filters_invalid_dates(client, populate_orders):
    rv = client.get('/admin/orders?seat=11A', headers=auth_header())
    assert rv.status_code == 200
    data = rv.get_json()
    assert data
    assert {o['seat'] for o in data} == {'11A'}

    rv = client.get('/admin/orders?from=bad&to=bad', headers=auth_header())
    assert rv.status_code == 200
    assert len(rv.get_json()) == 180


def test_sales_report_multiple_years(client, populate_orders):
    rv = client.get('/admin/reports/sales?year=2022', headers=auth_header())
    data = rv.get_json()
    assert len(data) == 12
    assert data['2022-01']['goods'] == 2110.0
    assert data['2022-01']['services'] == 50.0

    rv = client.get('/admin/reports/sales?year=2023', headers=auth_header())
    data = rv.get_json()
    assert data['2023-12']['goods'] == 2110.0
    assert data['2023-12']['services'] == 50.0


def test_sales_report_all_years(client, populate_orders):
    rv = client.get('/admin/reports/sales', headers=auth_header())
    data = rv.get_json()
    assert len(data) == 36
    assert data['2021-01']['goods'] == 2110.0
    assert data['2023-12']['services'] == 50.0


def test_admin_requires_auth(client):
    rv = client.get('/admin/items')
    assert rv.status_code == 401
    rv = client.get('/admin/categories')
    assert rv.status_code == 401
    rv = client.get('/admin/orders')
    assert rv.status_code == 401
