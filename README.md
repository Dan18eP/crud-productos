#  CRUD de Productos - AWS DynamoDB & EC2

Aplicación web desarrollada con **Python (Flask)** y **Amazon DynamoDB**, diseñada para demostrar el uso de servicios en la **Capa Gratuita de AWS** y el cumplimiento de estándares de seguridad y buenas prácticas.

---

##  Tabla de Contenidos
- [Arquitectura](#-arquitectura)
- [Criterios de Evaluación Cubiertos](#-criterios-de-evaluación-cubiertos)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Configuración en AWS](#-configuración-en-aws)
- [Instalación Local](#-instalación-local)
- [Decisiones Técnicas](#-decisiones-técnicas)

---

## 🏗 Arquitectura
La aplicación sigue un modelo cliente-servidor desplegado en la infraestructura de AWS:
- **Frontend:** HTML5, Tailwind CSS y JavaScript Vanilla (interactúa con el API mediante Fetch).
- **Backend:** Flask (Python) sirviendo como API RESTful.
- **Base de Datos:** Amazon DynamoDB (NoSQL) para persistencia escalable.
- **Cómputo:** Instancia Amazon EC2 (t2.micro / t3.micro).
- **Seguridad:** Roles de IAM (Instance Profiles) para acceso programático sin llaves expuestas.

---

##  Criterios de Evaluación Cubiertos (Nivel Excelente)

### 1. Configuración y Despliegue
- **Capa Gratuita:** Uso exclusivo de servicios `Free Tier`.
- **Estabilidad:** Despliegue en EC2 con **Elastic IP** para asegurar un enlace funcional permanente.

### 2. Base de Datos - Amazon DynamoDB
- **Diseño Óptimo:** Tabla con Partition Key (`id` tipo UUID) para acceso rápido.
- **Operaciones CRUD:** Implementación completa (Create, Read, Update, Delete) usando el SDK `boto3`.
- **Manejo de Errores:** Captura de excepciones de `botocore` con retroalimentación clara al usuario.

### 3. Funcionalidad CRUD
- **Create:** Validación de campos y generación de IDs únicos.
- **Read:** Listado con **filtrado en tiempo real** (búsqueda por nombre o ID).
- **Update:** Pre-carga de datos en el formulario y actualización inmediata.
- **Delete:** **Confirmación explícita mediante Modal** antes de eliminar.

### 4. Seguridad y Buenas Prácticas
- **IAM Roles:** La aplicación **NO** contiene llaves de acceso (`AWS_ACCESS_KEY_ID`) en el código. Utiliza un rol asociado a la instancia EC2.
- **Sanitización:** Validación de entradas en backend y frontend.

---

## 🛠 Tecnologías Utilizadas
- **Lenguaje:** Python 3.x
- **Framework Web:** Flask
- **SDK AWS:** Boto3
- **Estilos:** Tailwind CSS (Modern UI)
- **Iconos:** FontAwesome

---

## ☁️ Configuración en AWS

### 1. DynamoDB
1. Crear una tabla llamada `Productos`.
2. Partition Key: `id` (String).

### 2. IAM (Seguridad)
1. Crear un **Role** para servicio `EC2`.
2. Adjuntar política `AmazonDynamoDBFullAccess` (o una política personalizada con permisos mínimos sobre la tabla `Productos`).
3. Nombre sugerido: `EC2-DynamoDB-Role`.

### 3. EC2 & Elastic IP
1. Lanzar instancia `t2.micro` (Amazon Linux 2023).
2. Asociar el **IAM Role** creado anteriormente.
3. En **Networking**, crear una **Elastic IP** y asociarla a la instancia.
4. Configurar **Security Group**: Permitir puerto `80` (HTTP) y `22` (SSH).

---

##  Instalación Local

1. Clonar el repositorio.
2. Crear entorno virtual: `python -m venv venv`.
3. Activar entorno: `source venv/bin/activate` (Linux) o `venv\Scripts\activate` (Windows).
4. Instalar dependencias: `pip install -r requirements.txt`.
5. Configurar archivo `.env`:
   ```env
   AWS_REGION=us-east-1
   DYNAMODB_TABLE=Productos
   ```
6. Ejecutar: `python run.py`.

---

##  Decisiones Técnicas
- **Uso de UUID:** Para evitar colisiones en una base de datos distribuida como DynamoDB.
- **Manejo de Decimals:** Se implementó un decodificador personalizado (`decoder.py`) para convertir los tipos numéricos de DynamoDB a tipos JSON-compatibles.
- **UI Progresiva:** Uso de Tailwind CSS para garantizar una interfaz profesional sin necesidad de frameworks pesados de frontend.
