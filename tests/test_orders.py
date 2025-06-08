from conftest import auth_header


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


def test_create_order_invalid_payload(client):
    rv = client.post('/orders', json={'items': []})
    assert rv.status_code == 400
    rv = client.post('/orders', json={'seat': '1A', 'items': {}})
    assert rv.status_code == 400


def test_update_order_status_validation(client, sample_data):
    item_id = sample_data['items']['Sandwich']
    rv = client.post('/orders', json={'seat': '15C', 'items': [{'item_id': item_id}]})
    assert rv.status_code == 201
    order_id = rv.get_json()['order_id']
    rv = client.patch(f'/admin/orders/{order_id}', json={'status': 'forming'}, headers=auth_header())
    assert rv.status_code == 200
    assert rv.get_json()['status'] == 'forming'
    rv = client.patch(f'/admin/orders/{order_id}', json={'status': 'bad'}, headers=auth_header())
    assert rv.status_code == 200
    assert rv.get_json()['status'] == 'forming'
