from flask import Blueprint, request, jsonify, abort
from werkzeug.security import check_password_hash
from flask_babel import gettext
from marshmallow import ValidationError
from marshmallow.validate import Email

from ..models import User

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')


@auth_bp.post('/login')
def login():
    data = request.get_json() or {}
    email = data.get('email')
    password = data.get('password')
    if not email or not password:
        abort(400)

    try:
        Email()(email)
    except ValidationError:
        return jsonify({'error': gettext('Invalid email')}), 400
    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({'error': gettext('Invalid credentials')}), 401
    return jsonify({'seat': user.seat, 'is_admin': user.is_admin})
