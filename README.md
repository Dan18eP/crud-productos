# CRUD Productos

Aplicación web CRUD de productos construida con Flask, MySQL y JavaScript.

El proyecto permite listar, crear, editar y eliminar productos desde una interfaz web servida por Flask, además de exponer endpoints JSON para la API. Flask usa carpetas `templates/` para las vistas HTML y `static/` para archivos CSS y JavaScript. [web:117][web:123][web:116]

## Tecnologías usadas

- Python
- Flask
- Flask-CORS
- MySQL
- HTML
- CSS
- JavaScript

## Estructura del proyecto

```bash
CRUD-PRODUCTOS/
├── app/
│   ├── models/
│   │   └── producto_model.py
│   ├── routes/
│   │   └── producto_routes.py
│   ├── static/
│   │   ├── js/
│   │   │   └── script.js
│   │   └── styles/
│   │       └── style.css
│   ├── templates/
│   │   └── index.html
│   ├── utils/
│   │   └── response.py
│   ├── __init__.py
│   ├── config.py
│   └── db.py
├── .env
├── requirements.txt
├── run.py
└── README.md
```

## Descripción de carpetas y archivos

- `app/`: paquete principal de la aplicación Flask.
- `app/models/producto_model.py`: consultas a la base de datos para productos.
- `app/routes/producto_routes.py`: rutas de la API y ruta principal de la vista.
- `app/static/js/script.js`: lógica del frontend para consumir la API y manejar el CRUD.
- `app/static/styles/style.css`: estilos de la interfaz.
- `app/templates/index.html`: vista principal renderizada con Jinja.
- `app/utils/response.py`: helpers para respuestas JSON.
- `app/__init__.py`: inicialización de Flask y configuración general, incluyendo CORS.
- `app/config.py`: configuración de variables de entorno.
- `app/db.py`: conexión a MySQL.
- `.env`: variables de entorno del proyecto.
- `run.py`: punto de entrada para ejecutar la aplicación.

## Funcionalidades

- Listar productos.
- Crear productos.
- Editar productos.
- Eliminar productos.
- Mostrar una interfaz web conectada a la API.
- Responder en formato JSON desde los endpoints backend.

## Endpoints disponibles

- `GET /` → muestra la interfaz web.
- `GET /productos` → lista todos los productos.
- `GET /productos/<id>` → obtiene un producto por id.
- `POST /productos` → crea un producto.
- `PUT /productos/<id>` → actualiza un producto.
- `DELETE /productos/<id>` → elimina un producto.

## Requisitos previos

- Python 3 instalado.
- MySQL disponible.
- Variables de entorno configuradas en `.env`.
- Entorno virtual recomendado.

## Instalación

1. Clona el repositorio:

```bash
git clone <url-del-repositorio>
cd CRUD-PRODUCTOS
```

2. Crea y activa un entorno virtual:

### Windows
```bash
python -m venv venv
.\venv\Scripts\activate
```

### Linux / macOS
```bash
python3 -m venv venv
source venv/bin/activate
```

3. Instala las dependencias:

```bash
pip install -r requirements.txt
```

## Ejecución

Inicia la aplicación con:

```bash
python run.py
```

Luego abre en el navegador:

```bash
http://127.0.0.1:5000/
```

## Variables de entorno

Asegúrate de definir en `.env` las credenciales necesarias para la conexión a MySQL, según la configuración usada por `app/config.py` y `app/db.py`. [web:221]

## Acceso desde navegador

Si la aplicación está desplegada en una instancia EC2 con IP pública y el puerto 5000 está habilitado en el security group, se puede acceder desde el navegador usando:

- `http://<IP_PUBLICA_EC2>:5000/`
- `http://<IP_PUBLICA_EC2>:5000/productos`

## Notas

- El frontend está servido desde Flask, no desde GitHub Pages.
- La interfaz usa JavaScript con `fetch()` para consumir los endpoints del backend. Flask documenta este patrón para trabajar con JavaScript, `fetch` y JSON. [web:164]
- Se habilitó CORS en Flask como parte de la configuración del proyecto. Flask-CORS permite habilitar solicitudes cross-origin con una configuración simple sobre la aplicación Flask. [web:6][web:223]

## Autor

- Daniel Echeverría