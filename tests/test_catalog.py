from conftest import auth_header



def test_catalog_filters(client, sample_data):
    # all items
    rv = client.get('/catalog')
    assert rv.status_code == 200
    data = rv.get_json()
    assert len(data) == 31
    # ensure category name, id and image are present
    assert {'category', 'category_id', 'image'} <= set(data[0].keys())

    # by category
    food_cat = sample_data['categories']['Food']
    rv = client.get(f'/catalog?category={food_cat}')
    assert {i['name'] for i in rv.get_json()} == {
        'Куриное филе с овощами',
        'Паста Карбонара',
        'Стейк из говядины',
        'Рыба с овощами на пару',
        'Вегетарианский салат',
        'Борщ',
    }

    # service items only
    rv = client.get('/catalog?service=1')
    names = {i['name'] for i in rv.get_json()}
    assert names == {'WiFi'}

    # search by name
    rv = client.get('/catalog?q=wifi')
    assert rv.get_json()[0]['name'] == 'WiFi'


def test_catalog_availability_filter(client, sample_data):
    wine_id = sample_data['items']['Вино красное сухое']
    client.put(f'/admin/items/{wine_id}', json={'available': False}, headers=auth_header())
    rv = client.get('/catalog?available=1')
    names = {i['name'] for i in rv.get_json()}
    assert 'Вино красное сухое' not in names
    rv = client.get('/catalog?available=0')
    names = {i['name'] for i in rv.get_json()}
    assert 'Вино красное сухое' in names


def test_catalog_price_and_service_filters(client, sample_data):
    rv = client.get('/catalog?price_min=100&price_max=800')
    assert rv.status_code == 200
    data = rv.get_json()
    names = {i['name'] for i in data}
    assert names == {
        'Беруши', 'Борщ', 'Вегетарианский салат', 'Вино красное сухое',
        'Журнал о путешествиях', 'Кофе Американо', 'Куриное филе с овощами',
        'Маска для сна', 'Минеральная вода', 'Мягкая игрушка',
        'Набор для раскрашивания', 'Орешки ассорти', 'Паста Карбонара',
        'Пиво светлое', 'Роман "Мастер и Маргарита"', 'Свежевыжатый апельсиновый сок',
        'Смузи ягодный', 'Сырная тарелка', 'Тирамису', 'Чай зеленый',
        'Чизкейк', 'Чипсы картофельные', 'Шоколадный фондан'
    }
    prices = {i['name']: i['price'] for i in data}
    assert prices == {
        'Беруши': 280.0,
        'Борщ': 480.0,
        'Вегетарианский салат': 450.0,
        'Вино красное сухое': 750.0,
        'Журнал о путешествиях': 320.0,
        'Кофе Американо': 280.0,
        'Куриное филе с овощами': 750.0,
        'Маска для сна': 450.0,
        'Минеральная вода': 150.0,
        'Мягкая игрушка': 680.0,
        'Набор для раскрашивания': 450.0,
        'Орешки ассорти': 320.0,
        'Паста Карбонара': 680.0,
        'Пиво светлое': 450.0,
        'Роман "Мастер и Маргарита"': 550.0,
        'Свежевыжатый апельсиновый сок': 350.0,
        'Смузи ягодный': 380.0,
        'Сырная тарелка': 680.0,
        'Тирамису': 420.0,
        'Чай зеленый': 220.0,
        'Чизкейк': 390.0,
        'Чипсы картофельные': 280.0,
        'Шоколадный фондан': 450.0,
    }

    rv = client.get('/catalog?service=0')
    assert rv.status_code == 200
    data = rv.get_json()
    prices = {i['name']: i['price'] for i in data}
    assert prices == {
        'Куриное филе с овощами': 750.0,
        'Паста Карбонара': 680.0,
        'Стейк из говядины': 1200.0,
        'Рыба с овощами на пару': 850.0,
        'Вегетарианский салат': 450.0,
        'Борщ': 480.0,
        'Свежевыжатый апельсиновый сок': 350.0,
        'Минеральная вода': 150.0,
        'Кофе Американо': 280.0,
        'Чай зеленый': 220.0,
        'Смузи ягодный': 380.0,
        'Вино красное сухое': 750.0,
        'Пиво светлое': 450.0,
        'Виски': 950.0,
        'Орешки ассорти': 320.0,
        'Чипсы картофельные': 280.0,
        'Сырная тарелка': 680.0,
        'Тирамису': 420.0,
        'Чизкейк': 390.0,
        'Шоколадный фондан': 450.0,
        'Дорожная подушка': 980.0,
        'Маска для сна': 450.0,
        'Беруши': 280.0,
        'Наушники': 3500.0,
        'Увлажняющий крем': 850.0,
        'Набор миниатюр': 1200.0,
        'Мягкая игрушка': 680.0,
        'Набор для раскрашивания': 450.0,
        'Роман "Мастер и Маргарита"': 550.0,
        'Журнал о путешествиях': 320.0,
    }


def test_catalog_categories_hierarchy(client, sample_data):
    rv = client.get('/catalog/categories', headers={'Accept-Language': 'en'})
    assert rv.status_code == 200
    data = rv.get_json()
    # root categories
    root_names = {c['name'] for c in data}
    assert 'Drinks' in root_names
    assert 'Alcohol' not in root_names
    drinks = next(c for c in data if c['name'] == 'Drinks')
    child_names = {c['name'] for c in drinks['children']}
    assert 'Alcohol' in child_names
    assert 'image' in drinks
    assert 'image' in drinks['children'][0]
