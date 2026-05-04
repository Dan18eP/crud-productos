const mensaje = document.getElementById("mensaje");
const tbody = document.getElementById("tbody-productos");
const form = document.getElementById("form-producto");
const inputId = document.getElementById("producto-id");
const inputNombre = document.getElementById("nombre");
const inputPrecio = document.getElementById("precio");
const inputCantidad = document.getElementById("cantidad");
const btnCancelar = document.getElementById("cancelar-edicion");

async function cargarProductos() {
    try {
        mensaje.textContent = "Cargando productos...";
        const response = await fetch("/productos");
        const result = await response.json();

        if (!result.success) {
            throw new Error(result.message || "Error al cargar productos");
        }

        tbody.innerHTML = "";

        result.data.forEach(producto => {
            const fila = document.createElement("tr");

            fila.innerHTML = `
                <td>${producto.id}</td>
                <td>${producto.nombre}</td>
                <td>$${Number(producto.precio).toLocaleString("es-CO")}</td>
                <td>${producto.cantidad}</td>
                <td class="acciones"></td>
            `;

            const celdaAcciones = fila.querySelector(".acciones");

            const btnEditar = document.createElement("button");
            btnEditar.textContent = "Editar";
            btnEditar.className = "btn-editar";
            btnEditar.addEventListener("click", () => {
                editarProducto(producto.id, producto.nombre, producto.precio, producto.cantidad);
            });

            const btnEliminar = document.createElement("button");
            btnEliminar.textContent = "Eliminar";
            btnEliminar.className = "btn-eliminar";
            btnEliminar.addEventListener("click", () => {
                eliminarProducto(producto.id);
            });

            celdaAcciones.appendChild(btnEditar);
            celdaAcciones.appendChild(btnEliminar);

            tbody.appendChild(fila);
        });

        mensaje.textContent = "Productos cargados correctamente";
    } catch (error) {
        mensaje.textContent = "Error: " + error.message;
    }
}

function limpiarFormulario() {
    inputId.value = "";
    inputNombre.value = "";
    inputPrecio.value = "";
    inputCantidad.value = "";
}

function editarProducto(id, nombre, precio, cantidad) {
    inputId.value = id;
    inputNombre.value = nombre;
    inputPrecio.value = precio;
    inputCantidad.value = cantidad;
    mensaje.textContent = `Editando producto ID ${id}`;
}

async function eliminarProducto(id) {
    const confirmar = confirm("¿Seguro que deseas eliminar este producto?");
    if (!confirmar) return;

    try {
        const response = await fetch(`/productos/${id}`, {
        method: "DELETE"
        });

        const result = await response.json();

        if (!result.success) {
        throw new Error(result.message || "No se pudo eliminar");
        }

        mensaje.textContent = "Producto eliminado correctamente";
        cargarProductos();
    } catch (error) {
        mensaje.textContent = "Error: " + error.message;
    }
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const producto = {
        nombre: inputNombre.value,
        precio: Number(inputPrecio.value),
        cantidad: Number(inputCantidad.value)
    };

    const id = inputId.value;
    const url = id ? `/productos/${id}` : "/productos";
    const method = id ? "PUT" : "POST";

    try {
        const response = await fetch(url, {
        method,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(producto)
        });

        const result = await response.json();

        if (!result.success) {
        throw new Error(result.message || "Error al guardar");
        }

        mensaje.textContent = id
        ? "Producto actualizado correctamente"
        : "Producto creado correctamente";

        limpiarFormulario();
        cargarProductos();
    } catch (error) {
        mensaje.textContent = "Error: " + error.message;
    }
});

btnCancelar.addEventListener("click", () => {
    limpiarFormulario();
    mensaje.textContent = "Edición cancelada";
});

cargarProductos();