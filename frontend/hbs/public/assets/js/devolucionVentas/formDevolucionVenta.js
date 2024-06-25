const urlVentas = 'http://localhost:3000/api/ventas';
const urlDevoluciones = 'http://localhost:3000/api/devolucionventas';
const urlProductosDeVenta = 'http://localhost:3000/api/ventas';

document.addEventListener('DOMContentLoaded', () => {
    cargarVentas();
});

async function cargarVentas() {
    try {
        const response = await fetch(urlVentas);
        const ventas = await response.json();
        const selectVentas = document.getElementById('idVenta');
        ventas.forEach(venta => {
            const option = document.createElement('option');
            option.value = venta.IdVenta;
            option.textContent = `Venta ID: ${venta.IdVenta} - Usuario: ${venta.NombreUsuario} ${venta.ApellidosUsuario} - Fecha: ${venta.FechaVenta}`;
            selectVentas.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar las ventas:', error);
    }
}

async function cargarProductosDeVenta(ventaId) {
    try {
        const response = await fetch(`/api/ventas/${ventaId}/productos`);
        if (!response.ok) throw new Error('Error en la solicitud: ' + response.statusText);
        
        const productos = await response.json();
        // Aquí manejar los productos recibidos
        console.log(productos);
    } catch (error) {
        console.error('Error al cargar los productos de la venta:', error);
        // Manejo de errores en el cliente
    }
}

function calcularValorDevolucion(checkbox, precioUnitario, cantidad) {
    let totalDevolucion = parseFloat(document.getElementById('valorDevolucionVenta').value) || 0;

    if (checkbox.checked) {
        totalDevolucion += precioUnitario * cantidad;
    } else {
        totalDevolucion -= precioUnitario * cantidad;
    }

    document.getElementById('valorDevolucionVenta').value = totalDevolucion.toFixed(2);
}

async function enviarDevolucion() {
    const idVenta = document.getElementById('idVenta').value;
    const motivo = document.getElementById('motivo').value;
    const fechaDevolucion = document.getElementById('fechaDevolucion').value;
    const valorDevolucionVenta = document.getElementById('valorDevolucionVenta').value;
    const estadoDevolucion = 1; // Asumiendo estado por defecto

    const productosSeleccionados = Array.from(document.querySelectorAll('#productosDeVentaContainer input[type="checkbox"]:checked')).map(checkbox => {
        return {
            IdProducto: checkbox.value,
            Cantidad: parseInt(checkbox.nextElementSibling.textContent.split(' ')[2]), // Obtener la cantidad desde el texto
            PrecioUnitario: parseFloat(checkbox.nextElementSibling.textContent.split('$')[1].trim())
        };
    });

    const devolucion = {
        IdVenta: idVenta,
        Motivo: motivo,
        FechaDevolucion: fechaDevolucion,
        ValorDevolucionVenta: parseFloat(valorDevolucionVenta),
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
        location.reload();
    } catch (error) {
        console.error('Error:', error);
        alert('Error al crear la devolución');
    }
}
