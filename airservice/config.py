import os
from werkzeug.security import generate_password_hash


class BaseConfig:
    """Common configuration loading values from environment variables."""

    def __init__(self):
        self.SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "sqlite:///airservice.db")
        self.SQLALCHEMY_TRACK_MODIFICATIONS = False
        self.ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", "admin")
        pwd_hash = os.getenv("ADMIN_PASSWORD_HASH")
        if not pwd_hash:
            pwd_hash = generate_password_hash(os.getenv("ADMIN_PASSWORD", "admin"))
        self.ADMIN_PASSWORD_HASH = pwd_hash
        self.BABEL_DEFAULT_LOCALE = os.getenv("BABEL_DEFAULT_LOCALE", "ru")
        self.API_RATE_LIMIT = os.getenv("API_RATE_LIMIT", "100 per hour")


class DevConfig(BaseConfig):
    DEBUG = True


class TestConfig(BaseConfig):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "sqlite:///:memory:")
