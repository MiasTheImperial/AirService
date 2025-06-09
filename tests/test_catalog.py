from conftest import auth_header



def test_catalog_filters(client, sample_data):
    # all items
    rv = client.get('/catalog')
    assert rv.status_code == 200
    data = rv.get_json()
    assert len(data) == 9
    # ensure category name and id are present
    assert {'category', 'category_id'} <= set(data[0].keys())

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


def test_catalog_availability_filter(client, sample_data):
    wine_id = sample_data['items']['Wine']
    client.put(f'/admin/items/{wine_id}', json={'available': False}, headers=auth_header())
    rv = client.get('/catalog?available=1')
    names = {i['name'] for i in rv.get_json()}
    assert 'Wine' not in names
    rv = client.get('/catalog?available=0')
    names = {i['name'] for i in rv.get_json()}
    assert 'Wine' in names


def test_catalog_price_and_service_filters(client, sample_data):
    rv = client.get('/catalog?price_min=5&price_max=10')
    assert rv.status_code == 200
    data = rv.get_json()
    names = {i['name'] for i in data}
    assert names == {'Sandwich', 'Salad', 'Wine', 'WiFi'}
    prices = {i['name']: i['price'] for i in data}
    assert prices == {
        'Sandwich': 5.0,
        'Salad': 7.0,
        'Wine': 8.0,
        'WiFi': 10.0,
    }

    rv = client.get('/catalog?service=0')
    assert rv.status_code == 200
    data = rv.get_json()
    prices = {i['name']: i['price'] for i in data}
    assert prices == {
        'Sandwich': 5.0,
        'Salad': 7.0,
        'Water': 1.5,
        'Wine': 8.0,
        'Coffee': 3.0,
        'Blanket': 15.0,
        'Headphones': 25.0,
    }


def test_catalog_categories_hierarchy(client, sample_data):
    rv = client.get('/catalog/categories')
    assert rv.status_code == 200
    data = rv.get_json()
    # root categories
    root_names = {c['name'] for c in data}
    assert 'Drinks' in root_names
    assert 'Alcohol' not in root_names
    drinks = next(c for c in data if c['name'] == 'Drinks')
    child_names = {c['name'] for c in drinks['children']}
    assert 'Alcohol' in child_names
