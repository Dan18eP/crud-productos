from flask import Flask
from flask_cors import CORS
from flask_talisman import Talisman
from app.routes.producto_routes import producto_bp

def create_app():
    app = Flask(__name__)

    CORS(app)

    # Seguridad: Añade cabeceras como X-Content-Type-Options, X-Frame-Options, etc.
    # Deshabilitamos force_https porque en EC2 sin dominio no hay SSL instalado.
    Talisman(app, force_https=False, content_security_policy=None)

    app.register_blueprint(producto_bp)

    return app