import logging
from typing import List, Tuple

from ..models import db, Item, Order, OrderItem
from ..events import push_event


def create_order(seat: str, items: List[dict], *, payment_method: str | None = None, idempotency_key: str | None = None) -> Tuple[Order, bool]:
    """Create a new order with given items.

    Returns a tuple of (order, created) where created=False means an order with
    the provided idempotency key already existed.
    """
    if idempotency_key:
        existing = Order.query.filter_by(idempotency_key=idempotency_key).first()
        if existing:
            return existing, False
    order = Order(seat=seat, idempotency_key=idempotency_key, payment_method=payment_method)
    db.session.add(order)
    db.session.commit()
    for it in items:
        item = db.session.get(Item, it.get("item_id"))
        if item:
            oi = OrderItem(order_id=order.id, item_id=item.id, quantity=it.get("quantity", 1))
            db.session.add(oi)
    db.session.commit()
    logging.info("order_created %s seat=%s", order.id, order.seat)
    push_event({"type": "order_created", "order_id": order.id})
    return order, True


def get_order(order_id: int) -> Order | None:
    return db.session.get(Order, order_id)


def update_order_status(order_id: int, status: str) -> Order | None:
    order = db.session.get(Order, order_id)
    if not order:
        return None
    order.status = status
    db.session.commit()
    logging.info("order_status_change %s status=%s", order.id, status)
    push_event({"type": "order_status_change", "order_id": order.id, "status": status})
    return order
