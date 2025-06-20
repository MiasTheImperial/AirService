from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

# allowed order statuses
ORDER_STATUSES = ['new', 'forming', 'done', 'cancelled']


db = SQLAlchemy()


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    seat = db.Column(db.String(10), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)


class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name_ru = db.Column(db.String(120), nullable=False)
    name_en = db.Column(db.String(120), nullable=False)
    image = db.Column(db.String(255))
    parent_id = db.Column(db.Integer, db.ForeignKey('category.id'))
    parent = db.relationship('Category', remote_side=[id])


class Item(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name_ru = db.Column(db.String(120))
    name_en = db.Column(db.String(120))
    image = db.Column(db.String(255))
    description_ru = db.Column(db.Text)
    description_en = db.Column(db.Text)
    price = db.Column(db.Float, nullable=False)
    available = db.Column(db.Boolean, default=True)
    is_service = db.Column(db.Boolean, default=False)
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'))
    category = db.relationship('Category')


class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    seat = db.Column(db.String(10), nullable=False)
    idempotency_key = db.Column(db.String(64), unique=True)
    created_at = db.Column(db.DateTime, default=datetime.now)
    status = db.Column(db.String(20), default='new')
    payment_method = db.Column(db.String(20))


class OrderItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('order.id'))
    order = db.relationship('Order', backref=db.backref('items', lazy=True))
    item_id = db.Column(db.Integer, db.ForeignKey('item.id'))
    item = db.relationship('Item')
    quantity = db.Column(db.Integer, default=1)


class OutgoingMessage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    payload = db.Column(db.Text, nullable=False)
    target = db.Column(db.String(120))
    sent = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.now)
