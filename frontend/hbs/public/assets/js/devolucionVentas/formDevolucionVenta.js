// URLs de las APIs
const urlVentas = 'http://localhost:3000/api/ventas';
const urlDevoluciones = 'http://localhost:3000/api/devoluciones';

// Al cargar la página, obtenemos las ventas
document.addEventListener('DOMContentLoaded', () => {
    cargarVentas();
});

// Función para cargar las ventas
async function cargarVentas() {
    try {
        const response = await fetch(urlVentas);
        if (!response.ok) throw new Error('Error al obtener las ventas');
        
        const ventas = await response.json();
        const selectVentas = document.getElementById('idVenta');

        // Llenar el selector de ventas
        ventas.forEach(venta => {
            const option = document.createElement('option');
            option.value = venta.IdVenta;
            option.textContent = `Venta ID: ${venta.IdVenta} - Cliente: ${venta.NombreCompleto}`;
            selectVentas.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar las ventas:', error);
        document.getElementById('idVenta-error').textContent = 'Error al cargar las ventas.';
    }
}

/// Función para cargar productos de una venta
async function cargarProductosDeVenta(ventaId) {
    try {
        const response = await fetch(`${urlVentas}/${ventaId}/productos`);
        if (!response.ok) throw new Error('Error al obtener los productos');

        const productos = await response.json();
        const container = document.getElementById('productosDeVentaContainer');
        container.innerHTML = ''; // Limpiar contenedor antes de agregar productos

        if (productos.length === 0) {
            container.innerHTML = '<p>No hay productos asociados a esta venta.</p>';
            return;
        }

        productos.forEach(producto => {
            const productoHTML = `
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="${producto.IdProducto}" id="producto-${producto.IdProducto}" onchange="calcularValorDevolucion(this, ${producto.PrecioUnitario}, ${producto.Cantidad})">
                    <label class="form-check-label" for="producto-${producto.IdProducto}">
                        ${producto.NombreProducto} - Cantidad: ${producto.Cantidad} - Precio Unitario: $${producto.PrecioUnitario.toFixed(2)}
                    </label>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', productoHTML);
        });
    } catch (error) {
        console.error('Error al cargar los productos de la venta:', error);
        document.getElementById('productosDeVentaContainer').innerHTML = '<p>Error al cargar los productos. Por favor, intente de nuevo.</p>';
    }
}


// Función para calcular el valor total de la devolución
function calcularValorDevolucion(checkbox, precioUnitario, cantidad) {
    let totalDevolucion = parseFloat(document.getElementById('valorDevolucionVenta').value) || 0;

    if (checkbox.checked) {
        totalDevolucion += precioUnitario * cantidad;
    } else {
        totalDevolucion -= precioUnitario * cantidad;
    }

    document.getElementById('valorDevolucionVenta').value = totalDevolucion.toFixed(2);
}

// Función para enviar la devolución
async function enviarDevolucion() {
    const idVenta = document.getElementById('idVenta').value;
    const motivo = document.getElementById('motivo').value;
    const fechaDevolucion = new Date().toISOString().split('T')[0]; // Fecha de hoy
    const valorDevolucionVenta = parseFloat(document.getElementById('valorDevolucionVenta').value);
    const estadoDevolucion = 1; // Asumiendo estado activo

    const productosSeleccionados = Array.from(document.querySelectorAll('#productosDeVentaContainer input[type="checkbox"]:checked')).map(checkbox => {
        const cantidad = parseInt(checkbox.parentElement.querySelector('.form-check-label').textContent.split(' ')[2]); // Obtener la cantidad desde el texto
        const precioUnitario = parseFloat(checkbox.parentElement.querySelector('.form-check-label').textContent.split('$')[1].trim());

        return {
            IdProducto: checkbox.value,
            Cantidad: cantidad,
            PrecioUnitario: precioUnitario
        };
    });

    if (productosSeleccionados.length === 0) {
        alert('Debe seleccionar al menos un producto para devolver.');
        return;
    }

    const devolucion = {
        IdVenta: idVenta,
        Motivo: motivo,
        FechaDevolucion: fechaDevolucion,
        ValorDevolucionVenta: valorDevolucionVenta,
        EstadoDevolucion: estadoDevolucion,
        productos: productosSeleccionados
    };

    try {
        const response = await fetch(urlDevoluciones, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(devolucion)
        });

        if (!response.ok) throw new Error('Error al crear la devolución');
        alert('Devolución creada exitosamente');
        window.location.href = '/GestionDevoluciones'; // Redireccionar después de guardar
    } catch (error) {
        console.error('Error:', error);
        alert('Error al crear la devolución');
    }
}
