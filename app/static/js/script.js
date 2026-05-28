/**
 * Script de gestión de productos para AWS DynamoDB CRUD
 */

const tbody = document.getElementById("tbody-productos");
const form = document.getElementById("form-producto");
const inputId = document.getElementById("producto-id");
const inputNombre = document.getElementById("nombre");
const inputPrecio = document.getElementById("precio");
const inputCantidad = document.getElementById("cantidad");
const btnCancelar = document.getElementById("cancelar-edicion");
const btnSubmit = document.getElementById("btn-submit");
const formTitle = document.getElementById("form-title");
const loader = document.getElementById("loader");
const emptyState = document.getElementById("empty-state");
const busquedaInput = document.getElementById("busqueda");
const toastContainer = document.getElementById("toast-container");

// Modal Delete
const modalDelete = document.getElementById("modal-delete");
const btnCancelDelete = document.getElementById("btn-cancel-delete");
const btnConfirmDelete = document.getElementById("btn-confirm-delete");

let productosCache = [];
let idAEliminar = null;

/**
 * Muestra notificaciones tipo Toast
 */
function showToast(message, type = 'success') {
    const toast = document.createElement("div");
    const bgColor = type === 'success' ? 'bg-green-600' : 'bg-red-600';
    const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
    
    toast.className = `${bgColor} text-white px-6 py-3 rounded-lg shadow-xl flex items-center animate-bounce-in transition-all duration-300 transform translate-y-0 opacity-100`;
    toast.innerHTML = `
        <i class="fas ${icon} mr-3"></i>
        <span class="font-medium">${message}</span>
    `;
    
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

/**
 * Carga productos desde el API
 */
async function cargarProductos() {
    try {
        loader.classList.remove("hidden");
        tbody.innerHTML = "";
        emptyState.classList.add("hidden");

        const response = await fetch("/productos");
        const result = await response.json();

        loader.classList.add("hidden");

        if (!result.success) throw new Error(result.message);

        productosCache = result.data;
        renderizarTabla(productosCache);

    } catch (error) {
        loader.classList.add("hidden");
        showToast("Error: " + error.message, 'error');
    }
}

/**
 * Renderiza los items en la tabla
 */
function renderizarTabla(items) {
    tbody.innerHTML = "";
    
    if (items.length === 0) {
        emptyState.classList.remove("hidden");
        return;
    }

    emptyState.classList.add("hidden");

    items.forEach(producto => {
        const fila = document.createElement("tr");
        fila.className = "hover:bg-slate-50 transition duration-150 border-b border-slate-100 last:border-0";

        fila.innerHTML = `
            <td class="px-6 py-4">
                <div class="font-bold text-slate-800">${producto.nombre}</div>
                <div class="text-[10px] text-slate-400 font-mono truncate w-32">${producto.id}</div>
            </td>
            <td class="px-6 py-4">
                <span class="font-semibold text-slate-700">$${Number(producto.precio).toLocaleString("es-CO")}</span>
            </td>
            <td class="px-6 py-4">
                <span class="px-2 py-1 rounded text-xs font-bold ${producto.cantidad > 5 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}">
                    ${producto.cantidad} unidades
                </span>
            </td>
            <td class="px-6 py-4 text-center">
                <div class="flex justify-center gap-2">
                    <button onclick="prepararEdicion('${producto.id}', '${producto.nombre}', ${producto.precio}, ${producto.cantidad})" 
                        class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="confirmarEliminacion('${producto.id}')" 
                        class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(fila);
    });
}

/**
 * Filtrado en tiempo real
 */
busquedaInput.addEventListener("input", (e) => {
    const term = e.target.value.toLowerCase();
    const filtrados = productosCache.filter(p => 
        p.nombre.toLowerCase().includes(term) || 
        p.id.toLowerCase().includes(term)
    );
    renderizarTabla(filtrados);
});

/**
 * Prepara el formulario para edición
 */
window.prepararEdicion = (id, nombre, precio, cantidad) => {
    inputId.value = id;
    inputNombre.value = nombre;
    inputPrecio.value = precio;
    inputCantidad.value = cantidad;
    
    formTitle.innerHTML = '<i class="fas fa-edit text-orange-500 mr-2"></i>Editar Producto';
    btnSubmit.innerHTML = '<i class="fas fa-sync-alt mr-2"></i>Actualizar Cambios';
    btnSubmit.classList.replace('bg-blue-600', 'bg-orange-600');
    btnSubmit.classList.replace('hover:bg-blue-700', 'hover:bg-orange-700');
    btnCancelar.classList.remove("hidden");
    
    inputNombre.focus();
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

function limpiarFormulario() {
    inputId.value = "";
    form.reset();
    formTitle.innerHTML = '<i class="fas fa-plus-circle text-blue-500 mr-2"></i>Nuevo Producto';
    btnSubmit.innerHTML = '<i class="fas fa-save mr-2"></i>Guardar Producto';
    btnSubmit.classList.replace('bg-orange-600', 'bg-blue-600');
    btnSubmit.classList.replace('hover:bg-orange-700', 'hover:bg-blue-700');
    btnCancelar.classList.add("hidden");
}

/**
 * Manejo de eliminación con Modal
 */
window.confirmarEliminacion = (id) => {
    idAEliminar = id;
    modalDelete.classList.remove("hidden");
};

btnCancelDelete.addEventListener("click", () => {
    modalDelete.classList.add("hidden");
    idAEliminar = null;
});

btnConfirmDelete.addEventListener("click", async () => {
    if (!idAEliminar) return;
    
    try {
        const response = await fetch(`/productos/${idAEliminar}`, { method: "DELETE" });
        const result = await response.json();
        
        if (!result.success) throw new Error(result.message);
        
        showToast("Producto eliminado de DynamoDB");
        cargarProductos();
    } catch (error) {
        showToast(error.message, 'error');
    } finally {
        modalDelete.classList.add("hidden");
        idAEliminar = null;
    }
});

/**
 * Submit Formulario (Create / Update)
 */
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
        btnSubmit.disabled = true;
        btnSubmit.innerHTML = '<i class="fas fa-circle-notch animate-spin mr-2"></i>Procesando...';

        const response = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(producto)
        });

        const result = await response.json();
        if (!result.success) throw new Error(result.message);

        showToast(id ? "Producto actualizado correctamente" : "Producto guardado en DynamoDB");
        limpiarFormulario();
        cargarProductos();
    } catch (error) {
        showToast(error.message, 'error');
    } finally {
        btnSubmit.disabled = false;
    }
});

btnCancelar.addEventListener("click", limpiarFormulario);

// Inicio
cargarProductos();
