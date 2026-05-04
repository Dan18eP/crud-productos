from flask import Flask
from flask_cors import CORS
from app.routes.producto_routes import producto_bp

def create_app():
    app = Flask(__name__)
    
    CORS(app, resources={
        r"/productos*": {
            "origins": ["https://Dan18eP.github.io"]
        }
    })

    app.register_blueprint(producto_bp)

    return app