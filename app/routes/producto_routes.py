from flask import Blueprint, request, jsonify
from app.models import producto_model

producto_bp = Blueprint('producto_bp', __name__)

@producto_bp.route('/productos', methods=['GET'])
def get_productos():
    productos = producto_model.get_all()
    return jsonify(productos)


@producto_bp.route('/productos/<int:id>', methods=['GET'])
def get_producto(id):
    producto = producto_model.get_by_id(id)
    if producto:
        return jsonify(producto)
    return jsonify({"error": "Producto no encontrado"}), 404


@producto_bp.route('/productos', methods=['POST'])
def create_producto():
    data = request.json

    if not data or 'nombre' not in data or 'precio' not in data:
        return jsonify({"error": "Datos incompletos"}), 400

    producto_model.create(data['nombre'], data['precio'])
    return jsonify({"msg": "Producto creado"}), 201


@producto_bp.route('/productos/<int:id>', methods=['PUT'])
def update_producto(id):
    data = request.json

    if not data or 'nombre' not in data or 'precio' not in data:
        return jsonify({"error": "Datos incompletos"}), 400

    producto_model.update(id, data['nombre'], data['precio'])
    return jsonify({"msg": "Producto actualizado"})


@producto_bp.route('/productos/<int:id>', methods=['DELETE'])
def delete_producto(id):
    producto_model.delete(id)
    return jsonify({"msg": "Producto eliminado"})