from conftest import auth_header


def test_order_flow_and_idempotency(client, sample_data):
    item_id = sample_data['items']['Sandwich']
    payload = {
        'seat': '10B',
        'items': [{'item_id': item_id, 'quantity': 2}],
        'payment_method': 'card'
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


def test_create_order_rejects_invalid_items(client, sample_data):
    bad_id = max(sample_data['items'].values()) + 1
    payload = {'seat': '22A', 'items': [{'item_id': bad_id}]}
    rv = client.post('/orders', json=payload)
    assert rv.status_code == 400

    payload = {
        'seat': '22B',
        'items': [
            {'item_id': sample_data['items']['Sandwich']},
            {'item_id': bad_id},
        ],
    }
    rv = client.post('/orders', json=payload)
    assert rv.status_code == 400


def test_update_order_status_validation(client, sample_data):
    item_id = sample_data['items']['Sandwich']
    rv = client.post('/orders', json={'seat': '15C', 'items': [{'item_id': item_id}], 'payment_method': 'cash'})
    assert rv.status_code == 201
    order_id = rv.get_json()['order_id']
    rv = client.patch(f'/admin/orders/{order_id}', json={'status': 'forming'}, headers=auth_header())
    assert rv.status_code == 200
    assert rv.get_json()['status'] == 'forming'
    rv = client.patch(f'/admin/orders/{order_id}', json={'status': 'bad'}, headers=auth_header())
    assert rv.status_code == 200
    assert rv.get_json()['status'] == 'forming'


def test_list_orders_filters(client, sample_data):
    item_id = sample_data['items']['Sandwich']
    rv = client.post('/orders', json={'seat': '5A', 'items': [{'item_id': item_id}]})
    first = rv.get_json()['order_id']
    rv = client.post('/orders', json={'seat': '5A', 'items': [{'item_id': item_id}]})
    second = rv.get_json()['order_id']
    client.patch(f'/admin/orders/{second}', json={'status': 'done'}, headers=auth_header())
    client.post('/orders', json={'seat': '6A', 'items': [{'item_id': item_id}]})

    rv = client.get('/orders?seat=5A')
    assert rv.status_code == 200
    data = rv.get_json()
    assert [o['id'] for o in data] == [first, second]

    rv = client.get('/orders?seat=5A&status=done')
    assert rv.status_code == 200
    data = rv.get_json()
    assert len(data) == 1 and data[0]['id'] == second

    rv = client.get('/orders')
    assert rv.status_code == 400
