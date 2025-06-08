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
