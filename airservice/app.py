from flask import Flask
import logging
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_babel import Babel
from flasgger import Swagger
from flask_migrate import Migrate

from .config import DevConfig
from .models import db
from .api.catalog import catalog_bp
from .api.orders import orders_bp
from .api.admin import admin_bp
from .api.integration import integration_bp


def create_app(config_object=None):
    app = Flask(__name__)
    if config_object is None:
        config_object = DevConfig

    if isinstance(config_object, dict):
        app.config.from_object(DevConfig())
        app.config.update(config_object)
    else:
        cfg = config_object() if isinstance(config_object, type) else config_object
        app.config.from_object(cfg)

    logging.basicConfig(filename='airservice.log', level=logging.INFO)

    Limiter(get_remote_address, app=app, default_limits=['100 per hour'])

    Babel(app)
    Swagger(app)

    db.init_app(app)
    Migrate(app, db)

    app.register_blueprint(catalog_bp)
    app.register_blueprint(orders_bp)
    app.register_blueprint(admin_bp, url_prefix='/admin')
    app.register_blueprint(integration_bp)

    return app


if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
