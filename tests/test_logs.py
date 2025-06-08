from conftest import auth_header


def test_admin_logs_filters(client, sample_logs):
    rv = client.get('/admin/logs?user=admin', headers=auth_header())
    assert rv.status_code == 200
    assert len(rv.get_json()) == 2

    rv = client.get('/admin/logs?endpoint=/orders', headers=auth_header())
    assert len(rv.get_json()) == 1

    rv = client.get('/admin/logs?from=2024-01-02T00:00:00&to=2024-01-03T00:00:00', headers=auth_header())
    assert len(rv.get_json()) == 1
