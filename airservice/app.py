from flask import Flask, request, g
import logging
import os
from datetime import datetime
from pythonjsonlogger import jsonlogger
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_babel import Babel
from flasgger import Swagger
from flask_migrate import Migrate
from flask_cors import CORS

from .config import DevConfig
from .models import db
from .api.catalog import catalog_bp
from .api.orders import orders_bp
from .api.admin import admin_bp
from .api.integration import integration_bp


def create_app(config_object=None):
    app = Flask(__name__, static_folder='../frontend/web-build', static_url_path='/')
    if config_object is None:
        config_object = DevConfig

    if isinstance(config_object, dict):
        app.config.from_object(DevConfig())
        app.config.update(config_object)
    else:
        cfg = config_object() if isinstance(config_object, type) else config_object
        app.config.from_object(cfg)

    CORS(app, origins=os.getenv("FRONTEND_ORIGIN", "*"))

    class RequestFilter(logging.Filter):
        def filter(self, record):
            record.user = getattr(g, 'log_user', 'system')
            record.endpoint = getattr(g, 'log_endpoint', '')
            record.timestamp = datetime.utcnow().isoformat()
            return True

    handler = logging.FileHandler('airservice.log')
    formatter = jsonlogger.JsonFormatter('%(timestamp)s %(user)s %(endpoint)s %(message)s')
    handler.setFormatter(formatter)
    handler.addFilter(RequestFilter())

    logger = logging.getLogger()
    logger.handlers = []
    logger.addHandler(handler)
    logger.setLevel(logging.INFO)

    @app.before_request
    def set_log_context():
        user = request.authorization.username if request.authorization else 'guest'
        g.log_user = user
        g.log_endpoint = request.path

    Limiter(
        get_remote_address,
        app=app,
        default_limits=[app.config.get("API_RATE_LIMIT")]
    )

    def get_locale():
        lang = request.args.get("lang")
        if lang:
            return lang
        return request.accept_languages.best_match(["ru", "en"]) or app.config.get("BABEL_DEFAULT_LOCALE")

    Babel(app, locale_selector=get_locale)
    Swagger(app)

    db.init_app(app)
    Migrate(app, db)

    app.register_blueprint(catalog_bp)
    app.register_blueprint(orders_bp)
    app.register_blueprint(admin_bp, url_prefix='/admin')
    app.register_blueprint(integration_bp)

    @app.route('/')
    def index():
        return app.send_static_file('index.html')

    return app


if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
