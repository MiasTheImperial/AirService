import json
from flask import Blueprint, jsonify, request, current_app

from .admin import auth_required

from ..models import db, OutgoingMessage
from ..events import register_queue, unregister_queue
from ..tasks import task_queue, process_outgoing_message

integration_bp = Blueprint('integration', __name__)


@integration_bp.route('/integration/ai', methods=['POST'])
def send_to_ai():
    """Send data to AI system asynchronously.

    ---
    requestBody:
      content:
        application/json:
          schema:
            type: object
    responses:
      200:
        description: Message queued
    """
    payload = request.get_json() or {}
    msg = OutgoingMessage(payload=json.dumps(payload), target='ai')
    db.session.add(msg)
    db.session.commit()
    task_queue.enqueue(process_outgoing_message, msg.id)
    return jsonify({'queued': msg.id})


@integration_bp.route('/integration/sync', methods=['POST'])
def sync_ground():
    """Send data to ground services.

    ---
    requestBody:
      content:
        application/json:
          schema:
            type: object
    responses:
      200:
        description: Message queued
    """
    payload = request.get_json() or {}
    msg = OutgoingMessage(payload=json.dumps(payload), target='ground')
    db.session.add(msg)
    db.session.commit()
    task_queue.enqueue(process_outgoing_message, msg.id)
    return jsonify({'queued': msg.id})


@integration_bp.route('/retry_pending')
def retry_pending():
    """Retry sending all pending messages.

    ---
    responses:
      200:
        description: Count of retried messages
    """
    msgs = OutgoingMessage.query.filter_by(sent=False).all()
    for m in msgs:
        task_queue.enqueue(process_outgoing_message, m.id)
    db.session.commit()
    return jsonify({'retried': len(msgs)})


@integration_bp.route('/notifications')
def notifications():
    """Server-sent events with integration notifications.

    ---
    responses:
      200:
        description: SSE stream
        content:
          text/event-stream:
            schema:
              type: string
    """
    auth_required()
    def stream():
        q = register_queue()
        try:
            while True:
                data = q.get()
                yield f"data: {json.dumps(data)}\n\n"
        finally:
            unregister_queue(q)
    return current_app.response_class(stream(), mimetype='text/event-stream')
