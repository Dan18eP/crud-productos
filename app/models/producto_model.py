from app.db import get_connection

def get_all():
    conn = get_connection()
    with conn.cursor() as cursor:
        cursor.execute("SELECT * FROM productos")
        result = cursor.fetchall()
    conn.close()
    return result


def get_by_id(id):
    conn = get_connection()
    with conn.cursor() as cursor:
        cursor.execute("SELECT * FROM productos WHERE id=%s", (id,))
        result = cursor.fetchone()
    conn.close()
    return result


def create(nombre, precio):
    conn = get_connection()
    with conn.cursor() as cursor:
        cursor.execute(
            "INSERT INTO productos (nombre, precio) VALUES (%s, %s)",
            (nombre, precio)
        )
    conn.commit()
    conn.close()


def update(id, nombre, precio):
    conn = get_connection()
    with conn.cursor() as cursor:
        cursor.execute(
            "UPDATE productos SET nombre=%s, precio=%s WHERE id=%s",
            (nombre, precio, id)
        )
    conn.commit()
    conn.close()


def delete(id):
    conn = get_connection()
    with conn.cursor() as cursor:
        cursor.execute("DELETE FROM productos WHERE id=%s", (id,))
    conn.commit()
    conn.close()