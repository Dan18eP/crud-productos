from flask import Flask
from app.routes.producto_routes import producto_bp

def create_app():
    app = Flask(__name__)

    app.register_blueprint(producto_bp)

    return app