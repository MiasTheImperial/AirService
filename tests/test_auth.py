import base64
from werkzeug.security import generate_password_hash

from airservice.models import db, User


def auth_header(email: str, password: str):
    creds = base64.b64encode(f"{email}:{password}".encode()).decode()
    return {"Authorization": f"Basic {creds}"}


def test_login_and_order_uses_account_seat(client, app, sample_data):
    with app.app_context():
        user = User(
            email="user@example.com",
            password_hash=generate_password_hash("password"),
            seat="12A",
        )
        db.session.add(user)
        db.session.commit()

    rv = client.post(
        "/auth/login",
        json={"email": "user@example.com", "password": "password"},
    )
    assert rv.status_code == 200
    data = rv.get_json()
    assert data["seat"] == "12A"
    assert not data["is_admin"]

    item_id = sample_data["items"]["Паста Карбонара"]
    rv = client.post(
        "/orders",
        json={"items": [{"item_id": item_id}]},
        headers=auth_header("user@example.com", "password"),
    )
    assert rv.status_code == 201
    order_id = rv.get_json()["order_id"]

    rv = client.get(f"/orders/{order_id}")
    assert rv.status_code == 200
    assert rv.get_json()["seat"] == "12A"


def test_login_invalid_email_format(client):
    rv = client.post(
        "/auth/login",
        json={"email": "bad_email", "password": "x"},
        headers={"Accept-Language": "ru"},
    )
    assert rv.status_code == 400
    assert rv.get_json()["error"] == "Неверный формат электронной почты"


def test_login_wrong_credentials(client, app):
    with app.app_context():
        user = User(
            email="demo@example.com",
            password_hash=generate_password_hash("secret"),
            seat="1A",
        )
        db.session.add(user)
        db.session.commit()

    rv = client.post(
        "/auth/login",
        json={"email": "demo@example.com", "password": "bad"},
        headers={"Accept-Language": "en"},
    )
    assert rv.status_code == 401
    assert rv.get_json()["error"] == "Invalid credentials"
