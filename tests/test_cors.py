import os
import pytest
from airservice.app import create_app
from airservice.config import TestConfig
from airservice.models import db


@pytest.fixture
def cors_client(monkeypatch):
    monkeypatch.setenv("DATABASE_URL", "sqlite:///:memory:")
    monkeypatch.setenv("ADMIN_USERNAME", "admin")
    from werkzeug.security import generate_password_hash
    monkeypatch.setenv("ADMIN_PASSWORD_HASH", generate_password_hash("admin"))
    monkeypatch.setenv("FRONTEND_ORIGIN", "http://example.com")
    app = create_app(TestConfig)
    with app.app_context():
        db.create_all()
    yield app.test_client()

def test_cors_header(cors_client):
    resp = cors_client.get('/catalog')
    assert resp.status_code == 200
    assert resp.headers['Access-Control-Allow-Origin'] == 'http://example.com'

