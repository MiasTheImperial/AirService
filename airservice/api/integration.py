import json
from flask import Blueprint, jsonify, request, current_app

from ..models import db, OutgoingMessage
from ..events import register_queue, unregister_queue

integration_bp = Blueprint('integration', __name__)


@integration_bp.route('/integration/ai', methods=['POST'])
def send_to_ai():
    payload = request.get_json() or {}
    msg = OutgoingMessage(payload=json.dumps(payload), target='ai')
    db.session.add(msg)
    db.session.commit()
    return jsonify({'queued': msg.id})


@integration_bp.route('/integration/sync', methods=['POST'])
def sync_ground():
    payload = request.get_json() or {}
    msg = OutgoingMessage(payload=json.dumps(payload), target='ground')
    db.session.add(msg)
    db.session.commit()
    return jsonify({'queued': msg.id})


@integration_bp.route('/retry_pending')
def retry_pending():
    msgs = OutgoingMessage.query.filter_by(sent=False).all()
    for m in msgs:
        m.sent = True  # pretend send succeeds
    db.session.commit()
    return jsonify({'retried': len(msgs)})


@integration_bp.route('/notifications')
def notifications():
    def stream():
        q = register_queue()
        try:
            while True:
                data = q.get()
                yield f"data: {json.dumps(data)}\n\n"
        finally:
            unregister_queue(q)
    return current_app.response_class(stream(), mimetype='text/event-stream')
