from flask import Blueprint, request, render_template
from app.models import producto_model
from app.utils.response import success, error

producto_bp = Blueprint('producto_bp', __name__)


@producto_bp.route('/', methods=['GET'])
def home():
    return render_template('index.html')


@producto_bp.route('/productos', methods=['GET'])
def get_productos():
    productos = producto_model.get_all()
    return success(productos)


@producto_bp.route('/productos/<int:id>', methods=['GET'])
def get_producto(id):
    producto = producto_model.get_by_id(id)
    if producto:
        return success(producto)
    return error("Producto no encontrado", 404)


@producto_bp.route('/productos', methods=['POST'])
def create_producto():
    data = request.json

    if not data or 'nombre' not in data or 'precio' not in data or 'cantidad' not in data:
        return error("Datos incompletos", 400)

    producto_model.create(data['nombre'], data['precio'], data['cantidad'])
    return success(message="Producto creado", status=201)


@producto_bp.route('/productos/<int:id>', methods=['PUT'])
def update_producto(id):
    data = request.json

    if not data or 'nombre' not in data or 'precio' not in data or 'cantidad' not in data:
        return error("Datos incompletos", 400)

    producto_model.update(id, data['nombre'], data['precio'], data['cantidad'])
    return success(message="Producto actualizado")


@producto_bp.route('/productos/<int:id>', methods=['DELETE'])
def delete_producto(id):
    producto_model.delete(id)
    return success(message="Producto eliminado")