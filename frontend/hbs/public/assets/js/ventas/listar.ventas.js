const urlVentas = 'http://localhost:3000/api/ventas';

document.addEventListener('DOMContentLoaded', () => {
    cargarVentas();
});

async function cargarVentas() {
    try {
        const response = await fetch(urlVentas);
        const ventas = await response.json();
        const listaVentas = document.getElementById('listaVentas');
        listaVentas.innerHTML = '';

        for (const venta of ventas) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${venta.NombreCompleto}</td>
                <td>${venta.Documento}</td>
                <td>${new Date(venta.FechaVenta).toLocaleDateString()}</td>
                <td>${venta.Total}</td>
                <td>${venta.EstadoVenta === 1 ? 'Activo' : 'Inactivo'}</td>
                <td>
                    <i class="fa-regular fa-eye fa-xl me-2" onclick="verDetalleVenta(${venta.IdVenta})"></i>
                    <i class="fa-solid fa-trash fa-xl me-2 trash-icon" onclick="confirmarEliminarVenta(${venta.IdVenta})"></i>
                </td>
            `;
            listaVentas.appendChild(row);
        }
    } catch (error) {
        console.error('Error al cargar las ventas:', error);
    }
}

async function verDetalleVenta(idVenta) {
    try {
        const response = await fetch(`${urlVentas}/${idVenta}`);
        const data = await response.json();
        const { venta, productos, membresias } = data;

        const detalleVentaContenido = document.getElementById('detalleVentaContenido');
        detalleVentaContenido.innerHTML = `
            <div class="row mb-3">
                <div class="col">
                    <p><strong>Nombre:</strong> ${venta.NombreCompleto}</p>
                    <p><strong>Documento:</strong> ${venta.Documento}</p>
                    <p><strong>Correo:</strong> ${venta.Correo}</p>
                    <p><strong>Teléfono:</strong> ${venta.Telefono}</p>
                    <p><strong>Dirección:</strong> ${venta.Direccion}</p>
                </div>
                <div class="col">
                    <p><strong>Fecha de Venta:</strong> ${new Date(venta.FechaVenta).toLocaleDateString()}</p>
                    <p><strong>IVA:</strong> ${venta.Iva}</p>
                    <p><strong>Total:</strong> ${venta.Total}</p>
                    <p><strong>Estado:</strong> ${venta.EstadoVenta === 1 ? 'Activo' : 'Inactivo'}</p>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <p><strong>Productos:</strong></p>
                    <ul>${productos.map(p => `<li>${p.NombreProducto} - Cantidad: ${p.Cantidad}</li>`).join('')}</ul>
                </div>
                <div class="col">
                    <p><strong>Membresías:</strong></p>
                    <ul>${membresias.map(m => `<li>${m.NombreMembresia} - Cantidad: ${m.Cantidad}</li>`).join('')}</ul>
                </div>
            </div>
        `;

        $('#detalleVentaModal').modal('show');
    } catch (error) {
        console.error('Error al obtener los detalles de la venta:', error);
    }
}

function confirmarEliminarVenta(id) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "No podrás revertir esto",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
        if (result.isConfirmed) {
            eliminarVenta(id);
        }
    });
}

async function eliminarVenta(id) {
    try {
        const response = await fetch(`${urlVentas}/${id}`, {
            method: 'DELETE',
        });

        const data = await response.json();

        if (response.ok) {
            Swal.fire(
                'Eliminada!',
                data.message,
                'success'
            );
        } else {
            Swal.fire(
                'Error!',
                data.message,
                'error'
            );
        }

        // Recargar las ventas después de la eliminación
        cargarVentas();
    } catch (error) {
        console.error('Error al eliminar la venta:', error);
        Swal.fire(
            'Error!',
            'Error al eliminar la venta',
            'error'
        );
    }
}