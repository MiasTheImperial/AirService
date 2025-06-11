from unittest.mock import patch

from airservice.services import order_service, item_service
from airservice.models import db, Item


def test_order_service_create_and_idempotent(app, sample_data):
    item_id = sample_data['items']['Паста Карбонара']
    items = [{'item_id': item_id, 'quantity': 1}]
    with app.app_context():
        with patch('airservice.services.order_service.push_event') as pe:
            order, created = order_service.create_order('1A', items, payment_method='card', idempotency_key='key1')
            assert created
            pe.assert_called_with({'type': 'order_created', 'order_id': order.id})
            assert order.payment_method == 'card'
            order2, created2 = order_service.create_order('1A', items, payment_method='card', idempotency_key='key1')
            assert not created2
            assert order.id == order2.id


def test_update_order_status(app, sample_data):
    item_id = sample_data['items']['Паста Карбонара']
    with app.app_context():
        order, _ = order_service.create_order('2A', [{'item_id': item_id}], payment_method='cash', idempotency_key=None)
        with patch('airservice.services.order_service.push_event') as pe:
            updated = order_service.update_order_status(order.id, 'done')
            assert updated.status == 'done'
            pe.assert_called_with({'type': 'order_status_change', 'order_id': order.id, 'status': 'done'})


def test_item_service_crud(app):
    with app.app_context(), patch('airservice.services.item_service.logging'):
        item = item_service.create_item({'name': 'Tea', 'price': 2.0})
        assert db.session.get(Item, item.id)
        item_service.update_item(item, {'price': 3.0})
        assert db.session.get(Item, item.id).price == 3.0
        item_service.delete_item(item)
        assert db.session.get(Item, item.id) is None
