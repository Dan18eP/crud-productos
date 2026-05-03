# CRUD Productos

Estructura básica de un proyecto Flask para administrar productos.

## Archivos y carpetas

- `app/` - paquete principal de la aplicación
- `app/config.py` - configuración de Flask
- `app/db.py` - inicialización de la base de datos
- `app/models/producto_model.py` - modelo `Producto`
- `app/routes/producto_routes.py` - rutas CRUD para productos
- `app/utils/response.py` - helpers de respuesta JSON
- `.env` - variables de entorno
- `requirements.txt` - dependencias
- `run.py` - punto de arranque

## Uso

1. Crear un entorno virtual:

   ```bash
   python -m venv venv
   .\venv\Scripts\activate
   pip install -r requirements.txt
   ```

2. Ejecutar la aplicación:

   ```bash
   python run.py
   ```

3. Acceder a la API:

   - `GET /productos/`
   - `POST /productos/`
   - `GET /productos/<id>`
   - `PUT /productos/<id>`
   - `DELETE /productos/<id>`

## Autor

- Daniel Echeverría