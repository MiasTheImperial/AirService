from airservice.app import create_app
import os

app = create_app()

if __name__ == '__main__':
    ssl_cert = os.getenv('SSL_CERT')
    ssl_key = os.getenv('SSL_KEY')
    context = (ssl_cert, ssl_key) if ssl_cert and ssl_key else None
    app.run(ssl_context=context)
