import base64
from werkzeug.security import generate_password_hash

from airservice.models import db, User


def auth_header(email: str, password: str):
    creds = base64.b64encode(f"{email}:{password}".encode()).decode()
    return {"Authorization": f"Basic {creds}"}


def test_login_and_order_uses_account_seat(client, app, sample_data):
    with app.app_context():
        user = User(email="user@example.com", password_hash=generate_password_hash("pass"), seat="12A")
        db.session.add(user)
        db.session.commit()

    rv = client.post("/auth/login", json={"email": "user@example.com", "password": "pass"})
    assert rv.status_code == 200
    data = rv.get_json()
    assert data["seat"] == "12A"
    assert not data["is_admin"]

    item_id = sample_data["items"]["Sandwich"]
    rv = client.post(
        "/orders",
        json={"items": [{"item_id": item_id}]},
        headers=auth_header("user@example.com", "pass"),
    )
    assert rv.status_code == 201
    order_id = rv.get_json()["order_id"]

    rv = client.get(f"/orders/{order_id}")
    assert rv.status_code == 200
    assert rv.get_json()["seat"] == "12A"
