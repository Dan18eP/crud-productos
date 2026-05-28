# CRUD de Productos con AWS DynamoDB y EC2

Aplicación web CRUD desarrollada con **Python (Flask)** y **Amazon DynamoDB**, desplegada sobre **Amazon EC2** dentro de la **Capa Gratuita de AWS**. El proyecto fue diseñado para demostrar integración entre servicios cloud, seguridad sin credenciales expuestas, despliegue estable y buenas prácticas de desarrollo orientadas a evaluación académica.

***

## Tabla de contenidos
- [Descripción general](#descripción-general)
- [Arquitectura de la solución](#arquitectura-de-la-solución)
- [Funcionalidades](#funcionalidades)
- [Criterios de evaluación cubiertos](#criterios-de-evaluación-cubiertos)
- [Tecnologías utilizadas](#tecnologías-utilizadas)
- [Modelo de datos en DynamoDB](#modelo-de-datos-en-dynamodb)
- [Seguridad y buenas prácticas](#seguridad-y-buenas-prácticas)
- [Despliegue en AWS](#despliegue-en-aws)
- [Instalación local](#instalación-local)
- [Ejecución en producción](#ejecución-en-producción)
- [Observabilidad](#observabilidad)
- [Decisiones técnicas](#decisiones-técnicas)
- [Estructura sugerida del proyecto](#estructura-sugerida-del-proyecto)
- [Mejoras futuras](#mejoras-futuras)

***

## Descripción general
La aplicación permite gestionar productos mediante las cuatro operaciones fundamentales de un sistema CRUD: **crear, consultar, actualizar y eliminar**. La interfaz fue construida con HTML5, Tailwind CSS y JavaScript Vanilla, mientras que el backend expone un API RESTful con Flask y persiste la información en Amazon DynamoDB mediante `boto3`.

El despliegue se realiza en una instancia **Amazon EC2 t2.micro / t3.micro**, accesible mediante una **Elastic IP**, con autenticación hacia AWS a través de un **IAM Role (Instance Profile)**. De esta manera, la solución evita el uso de claves hardcodeadas y se alinea con prácticas recomendadas de seguridad en la nube.

***

## Arquitectura de la solución
La arquitectura sigue un modelo cliente-servidor desacoplado y organizado en capas:

### 1. Capa de usuario
- **Cliente:** Navegador web.
- **Frontend:** HTML5, Tailwind CSS y JavaScript Vanilla.
- **Interacción:** Consumo del API mediante `fetch`.
- **UX:** Validaciones de entrada, búsqueda dinámica y confirmación de eliminación mediante modal.

### 2. Capa de red y acceso
- **Internet Gateway:** Punto de entrada del tráfico web.
- **Elastic IP:** Dirección pública estática asociada a la instancia EC2.
- **Security Group:**
  - Puerto `80` habilitado para acceso HTTP.
  - Puerto `22` habilitado para administración vía SSH.

### 3. Capa de cómputo
- **Servicio:** Amazon EC2.
- **Instancia:** `t2.micro` o `t3.micro`.
- **Sistema operativo:** Ubuntu Server 24.04.
- **Runtime:** Python 3.x.
- **Backend:** Flask.
- **Servidor WSGI:** Gunicorn.
- **Seguridad de aplicación:** Flask-Talisman para cabeceras HTTP.
- **Autenticación AWS:** IAM Role `EC2-DynamoDB-Role`.

### 4. Capa de datos
- **Servicio:** Amazon DynamoDB.
- **Tabla:** `Productos`.
- **Partition Key:** `id` de tipo `String`.
- **Índice secundario global (GSI):** `NombreIndex` sobre el atributo `nombre`.
- **Control de concurrencia:** uso de `ConditionExpression` en operaciones sensibles.

***

## Funcionalidades
### Create
- Registro de nuevos productos.
- Validación de campos obligatorios.
- Generación automática de identificadores UUID.
- Retroalimentación inmediata al usuario.

### Read
- Listado de productos almacenados en DynamoDB.
- Filtrado en tiempo real por nombre o por ID.
- Actualización visual inmediata tras cambios en la base de datos.

### Update
- Precarga de datos en el formulario de edición.
- Persistencia de cambios en DynamoDB.
- Validación de existencia del ítem antes de actualizar.
- Manejo de concurrencia básica mediante `ConditionExpression="attribute_exists(id)"`.

### Delete
- Eliminación de productos desde la interfaz.
- Confirmación explícita mediante modal.
- Verificación de existencia antes de borrar.
- Actualización inmediata del listado tras eliminación.

***

## Criterios de evaluación cubiertos
El proyecto fue diseñado para apuntar al nivel **Excelente** de la rúbrica.

### 1. Configuración y despliegue en AWS
- Uso de servicios compatibles con la **Capa Gratuita**.
- Despliegue sobre EC2 con acceso público mediante Elastic IP.
- Aplicación accesible, estable y ejecutándose en un entorno cloud real.

### 2. Base de datos con Amazon DynamoDB
- Tabla correctamente configurada con clave primaria `id`.
- CRUD completo implementado con `boto3`.
- Manejo de errores en operaciones de base de datos.
- Optimización mediante **GSI por nombre** para búsquedas eficientes.

### 3. Funcionalidad de la aplicación
- Flujo completo de alta, consulta, actualización y eliminación.
- Validaciones de frontend y backend.
- Búsqueda dinámica y experiencia de usuario moderna.
- Confirmaciones explícitas en acciones destructivas.

### 4. Seguridad y buenas prácticas
- Sin credenciales AWS expuestas en el código.
- Uso de IAM Roles para acceso programático seguro.
- Cabeceras de seguridad HTTP con Flask-Talisman.
- Validación estricta de tipos, campos vacíos y valores inválidos.

### 5. Documentación y sustentación
- README técnico ampliado.
- Diagrama de arquitectura AWS.
- Explicación de decisiones técnicas.
- Justificación de observabilidad y despliegue.

***

## Tecnologías utilizadas
| Componente | Tecnología |
|-----------|------------|
| Lenguaje principal | Python 3.x |
| Framework backend | Flask |
| Servidor de producción | Gunicorn |
| Base de datos | Amazon DynamoDB |
| SDK AWS | Boto3 |
| Frontend | HTML5, Tailwind CSS, JavaScript Vanilla |
| Seguridad HTTP | Flask-Talisman |
| Infraestructura | Amazon EC2 + Elastic IP + IAM |

***

## Modelo de datos en DynamoDB
La tabla principal utilizada por la aplicación es `Productos`.

### Esquema principal
- **Table Name:** `Productos`
- **Partition Key:** `id` (`String`)

### Atributos típicos
- `id`
- `nombre`
- `precio`
- `cantidad`
- `descripcion` (si aplica)

### Optimización con GSI
Para mejorar el desempeño de búsquedas por nombre, se recomienda crear el siguiente índice secundario global:

- **Index Name:** `NombreIndex`
- **Partition Key:** `nombre` (`String`)
- **Projection:** `ALL`

### Ventaja del GSI
El índice permite reemplazar búsquedas costosas con `Scan` por consultas más eficientes basadas en `Query`, reduciendo consumo de lectura y mejorando tiempo de respuesta a medida que la tabla crece.

***

## Seguridad y buenas prácticas
### IAM Roles
La aplicación utiliza un **Instance Profile** asociado a EC2 para obtener permisos temporales de acceso a DynamoDB. Esto elimina la necesidad de definir variables sensibles como:

```env
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
```

### Seguridad de aplicación
Se integró **Flask-Talisman** para añadir cabeceras HTTP como:
- `X-Content-Type-Options`
- `X-Frame-Options`
- `Strict-Transport-Security`
- `X-XSS-Protection`

### Validación de datos
- Validación de tipos y obligatoriedad de campos.
- Rechazo de valores negativos o inconsistentes.
- Sanitización de entradas tanto en frontend como en backend.

### Concurrencia
Las operaciones de actualización y eliminación incluyen expresiones condicionales para evitar modificaciones sobre elementos inexistentes o eliminados previamente.

***

## Despliegue en AWS
### 1. Crear tabla en DynamoDB
1. Abrir el servicio **DynamoDB**.
2. Crear la tabla `Productos`.
3. Definir `id` como clave de partición de tipo `String`.
4. Crear opcionalmente el GSI `NombreIndex` con `nombre` como clave.

### 2. Crear el rol IAM
1. Ir al servicio **IAM**.
2. Crear un rol para el servicio **EC2**.
3. Adjuntar `AmazonDynamoDBFullAccess` o una política de mínimo privilegio.
4. Nombre sugerido: `EC2-DynamoDB-Role`.

### 3. Lanzar la instancia EC2
1. Crear instancia `t2.micro` o `t3.micro`.
2. Sistema operativo: **Ubuntu Server 24.04**.
3. Asociar el rol `EC2-DynamoDB-Role`.
4. Abrir puertos `80` y `22` en el Security Group.
5. Asociar una **Elastic IP**.

***

## Instalación local
### 1. Clonar el repositorio
```bash
git clone <TU_URL_DEL_REPOSITORIO>
cd crud-productos
```

### 2. Crear y activar entorno virtual
```bash
python -m venv venv
source venv/bin/activate
```

En Windows:
```bash
venv\Scripts\activate
```

### 3. Instalar dependencias
```bash
pip install -r requirements.txt
```

### 4. Configurar variables de entorno
Crear un archivo `.env` con el siguiente contenido:

```env
AWS_REGION=us-east-1
DYNAMODB_TABLE=Productos
```

### 5. Ejecutar la aplicación localmente
```bash
python run.py
```

***

## Ejecución en producción
En el servidor EC2, una forma simple de levantar la aplicación con Gunicorn es:

```bash
cd /home/ubuntu/crud-productos
source venv/bin/activate
sudo PYTHONUNBUFFERED=1 /home/ubuntu/crud-productos/venv/bin/gunicorn \
  --chdir /home/ubuntu/crud-productos \
  --bind 0.0.0.0:80 \
  --access-logfile - \
  --error-logfile - \
  run:app
```

> **Nota:** Si el proyecto no utiliza `run.py` como punto de entrada, el módulo WSGI debe ajustarse según el archivo real que exponga la variable `app`.

***

## Observabilidad
Para el monitoreo en tiempo real, Gunicorn se ejecuta con salida de logs sin búfer mediante `PYTHONUNBUFFERED=1`. Esto permite:

- observar peticiones HTTP en tiempo real,
- revisar códigos de respuesta (`200`, `201`, `400`, `500`),
- validar consumo del API durante la demostración,
- detectar rápidamente errores de despliegue o integración.

Un comando recomendado para observabilidad en consola es:

```bash
sudo PYTHONUNBUFFERED=1 /home/ubuntu/crud-productos/venv/bin/gunicorn \
  --chdir /home/ubuntu/crud-productos \
  --bind 0.0.0.0:80 \
  --access-logfile - \
  --error-logfile - \
  --access-logformat '%(h)s %(l)s %(u)s %(t)s "%(r)s" %(s)s %(b)s "%(f)s"' \
  run:app
```

### Sobre el mensaje `Handling signal: winch`
Este mensaje **no representa un error**. Corresponde a una señal del sistema que Gunicorn recibe cuando cambia el tamaño de la terminal, por lo que puede mostrarse durante demostraciones o grabaciones de pantalla.

***

## Decisiones técnicas
- **UUID como clave primaria:** evita colisiones en un entorno distribuido.
- **DynamoDB como base NoSQL:** simplifica operación, escalabilidad y alineación con AWS.
- **Gunicorn en producción:** mejora estabilidad frente al servidor de desarrollo de Flask.
- **IAM Role sobre credenciales estáticas:** refuerza seguridad y evita exposición de secretos.
- **Flask-Talisman:** agrega una capa adicional de endurecimiento HTTP.
- **GSI por nombre:** optimiza búsquedas frecuentes y mejora el diseño de la tabla.
- **ConditionExpressions:** aportan robustez frente a concurrencia básica en operaciones de escritura.
- **Tailwind CSS:** permite una interfaz moderna, limpia y responsiva sin sobrecargar el frontend.

***

## Estructura sugerida del proyecto
```bash
crud-productos/
├── app/
│   ├── __init__.py
│   ├── routes/
│   ├── models/
│   ├── services/
│   └── utils/
├── static/
├── templates/
├── venv/
├── run.py
├── requirements.txt
├── .env
└── README.md
```

> La estructura puede variar según la implementación final, pero se recomienda mantener separación entre rutas, lógica de negocio, acceso a datos y utilidades.

***

## Mejoras futuras
- Configurar **Nginx** como reverse proxy delante de Gunicorn.
- Implementar **HTTPS real** con dominio y certificado TLS.
- Reemplazar `Scan` residuales por consultas apoyadas en índices.
- Incorporar **CloudWatch Logs** para centralizar observabilidad.
- Agregar paginación del lado servidor.
- Implementar autenticación para panel administrativo.

***

## Autor
**Daniel Echeverría**  
Proyecto académico — Cloud Computing
