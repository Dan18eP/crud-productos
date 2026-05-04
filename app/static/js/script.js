async function cargarProductos() {
    const mensaje = document.getElementById("mensaje");
    const tbody = document.getElementById("tbody-productos");

    try {
        const response = await fetch("/productos");
        const result = await response.json();

        if (!result.success) {
        throw new Error(result.message || "No se pudieron cargar los productos");
        }

        tbody.innerHTML = "";

        result.data.forEach(producto => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${producto.id}</td>
            <td>${producto.nombre}</td>
            <td>$${Number(producto.precio).toLocaleString("es-CO")}</td>
            <td>${producto.cantidad}</td>
        `;
        tbody.appendChild(fila);
        });

        mensaje.textContent = "Productos cargados correctamente";
    } catch (error) {
        mensaje.textContent = "Error: " + error.message;
    }
}

cargarProductos();