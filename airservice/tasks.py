import os
from redis import Redis
from rq import Queue

from .models import db, OutgoingMessage

# Redis connection from REDIS_URL env var or default
redis_url = os.getenv("REDIS_URL", "redis://localhost:6379/0")
redis_conn = Redis.from_url(redis_url)

# Shared queue for outgoing messages
task_queue = Queue('default', connection=redis_conn)

def process_outgoing_message(message_id: int) -> None:
    """Mark the given message as sent."""
    from .app import create_app  # imported here to avoid circular import
    app = create_app()
    with app.app_context():
        msg = db.session.get(OutgoingMessage, message_id)
        if msg and not msg.sent:
            # Here would be the real sending logic
            msg.sent = True
            db.session.commit()

