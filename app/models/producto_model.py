import uuid
from datetime import datetime
from botocore.exceptions import ClientError
from app.db import get_table
from app.utils.decoder import decode_dynamodb_item

def get_all():
    table = get_table()
    try:
        response = table.scan()
        items = response.get('Items', [])
        return decode_dynamodb_item(items)
    except ClientError as e:
        print(f"Error al obtener productos: {e.response['Error']['Message']}")
        return []


def get_by_id(producto_id):
    table = get_table()
    try:
        response = table.get_item(Key={'id': producto_id})
        item = response.get('Item')
        return decode_dynamodb_item(item)
    except ClientError as e:
        print(f"Error al obtener producto {producto_id}: {e.response['Error']['Message']}")
        return None


def create(nombre, precio, cantidad):
    table = get_table()
    producto_id = uuid.uuid4().hex
    item = {
        'id': producto_id,
        'nombre': nombre,
        'precio': precio,
        'cantidad': cantidad,
        'createdAt': datetime.utcnow().isoformat()
    }
    try:
        table.put_item(Item=item)
        return producto_id
    except ClientError as e:
        print(f"Error al crear producto: {e.response['Error']['Message']}")
        raise e


def update(producto_id, nombre, precio, cantidad):
    table = get_table()
    try:
        table.update_item(
            Key={'id': producto_id},
            UpdateExpression="set nombre=:n, precio=:p, cantidad=:c, updatedAt=:u",
            ExpressionAttributeValues={
                ':n': nombre,
                ':p': precio,
                ':c': cantidad,
                ':u': datetime.utcnow().isoformat()
            },
            ReturnValues="UPDATED_NEW"
        )
        return True
    except ClientError as e:
        print(f"Error al actualizar producto {producto_id}: {e.response['Error']['Message']}")
        return False


def delete(producto_id):
    table = get_table()
    try:
        table.delete_item(Key={'id': producto_id})
        return True
    except ClientError as e:
        print(f"Error al eliminar producto {producto_id}: {e.response['Error']['Message']}")
        return False
