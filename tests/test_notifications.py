from queue import Queue
from unittest.mock import patch
from airservice.api import integration
from conftest import auth_header


def test_sse_notifications(app):
    q = Queue()
    with patch('airservice.api.integration.register_queue', lambda: q), \
         patch('airservice.api.integration.unregister_queue', lambda _q: None):
        with app.test_request_context('/', headers=auth_header()):
            q.put({'hello': 'world'})
            resp = integration.notifications()
            gen = resp.response
            chunk = next(gen)
            assert chunk == 'data: {"hello": "world"}\n\n'
            gen.close()
