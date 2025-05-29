document.addEventListener('DOMContentLoaded', cargarProductos);

let productoEditandoId = null;

function cargarProductos() {
    fetch('/productos')
        .then(response => response.json())
        .then(data => {
            const tbody = document.querySelector('#tabla-productos tbody');
            tbody.innerHTML = '';
            data.forEach(producto => {
                tbody.innerHTML += `
                    <tr>
                        <td>${producto.id}</td>
                        <td>${producto.nombre}</td>
                        <td>${producto.precio}</td>
                        <td>${producto.descripcion}</td>
                        <td>
                            <button onclick="editarProducto(${producto.id})">Editar</button>
                            <button onclick="eliminarProducto(${producto.id})">Eliminar</button>
                        </td>
                    </tr>
                `;
            });
        });
}

function guardarProducto() {
    const nombre = document.getElementById('nombre').value.trim();
    const precio = parseFloat(document.getElementById('precio').value);
    const descripcion = document.getElementById('descripcion').value.trim();

    if (!nombre || isNaN(precio)) {
        document.getElementById('message').textContent = 'Nombre y precio son obligatorios';
        return;
    }

    const producto = { nombre, precio, descripcion };
    const url = productoEditandoId ? `/productos/${productoEditandoId}` : '/productos';
    const method = productoEditandoId ? 'PUT' : 'POST';

    fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(producto)
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('message').textContent = data.mensaje;
        cargarProductos();
        limpiarFormulario();
        productoEditandoId = null;
    });
}

function editarProducto(id) {
    fetch(`/productos/${id}`)
        .then(response => response.json())
        .then(producto => {
            productoEditandoId = id;
            document.getElementById('nombre').value = producto.nombre;
            document.getElementById('precio').value = producto.precio;
            document.getElementById('descripcion').value = producto.descripcion;
            window.scrollTo(0, 0);
        });
}

function eliminarProducto(id) {
    if (confirm('¿Eliminar este producto?')) {
        fetch(`/productos/${id}`, { method: 'DELETE' })
            .then(response => response.json())
            .then(data => {
                document.getElementById('message').textContent = data.mensaje;
                cargarProductos();
            });
    }
}

function limpiarFormulario() {
    document.getElementById('nombre').value = '';
    document.getElementById('precio').value = '';
    document.getElementById('descripcion').value = '';
    productoEditandoId = null;
}
