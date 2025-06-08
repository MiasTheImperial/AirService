import pytest


def test_invalid_payload_accept_language_ru(client):
    rv = client.post('/orders', json={}, headers={'Accept-Language': 'ru'})
    assert rv.status_code == 400
    assert rv.get_json()['error'] == 'Неверные данные'


def test_invalid_payload_accept_language_en(client):
    rv = client.post('/orders', json={}, headers={'Accept-Language': 'en'})
    assert rv.status_code == 400
    assert rv.get_json()['error'] == 'Invalid payload'


def test_invalid_payload_lang_param_precedence(client):
    rv = client.post('/orders?lang=ru', json={}, headers={'Accept-Language': 'en'})
    assert rv.status_code == 400
    assert rv.get_json()['error'] == 'Неверные данные'


def test_invalid_item_ids_ru(client, sample_data):
    bad_id = max(sample_data['items'].values()) + 1
    payload = {'seat': '1A', 'items': [{'item_id': bad_id}]}
    rv = client.post('/orders', json=payload, headers={'Accept-Language': 'ru'})
    assert rv.status_code == 400
    assert 'Неверные ID товаров' in rv.get_json()['error']


def test_invalid_item_ids_en(client, sample_data):
    bad_id = max(sample_data['items'].values()) + 1
    payload = {'seat': '1A', 'items': [{'item_id': bad_id}]}
    rv = client.post('/orders', json=payload, headers={'Accept-Language': 'en'})
    assert rv.status_code == 400
    assert 'Invalid item IDs' in rv.get_json()['error']


