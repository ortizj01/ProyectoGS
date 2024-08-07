const urlVentas = 'http://localhost:3000/api/ventas';
const urlEstadosVentas = 'http://localhost:3000/api/estadosVentas'; // URL para obtener los estados

document.addEventListener('DOMContentLoaded', () => {
    cargarVentas();
    cargarEstados(); // Cargar los estados disponibles
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
                <td>${venta.EstadoVenta || 'Estado desconocido'}</td> <!-- Manejando undefined -->
                <td>
                    <i class="fa-regular fa-eye fa-xl me-2" onclick="verDetalleVenta(${venta.IdVenta})"></i>
                    <i class="fa-solid fa-arrows-rotate fa-xl me-2 change-state-icon" onclick="abrirModalCambioEstado(${venta.IdVenta})"></i>
                </td>
            `;
            listaVentas.appendChild(row);
        }

        // Inicializar DataTable
        $('#dataTable').DataTable();
    } catch (error) {
        console.error('Error al cargar las ventas:', error);
    }
}

async function cargarEstados() {
    try {
        const response = await fetch(urlEstadosVentas);
        const estados = await response.json();
        const estadoSelect = document.getElementById('nuevoEstado');
        estadoSelect.innerHTML = ''; // Limpiar opciones previas

        for (const estado of estados) {
            const option = document.createElement('option');
            option.value = estado.IdEstadoVenta;
            option.textContent = estado.NombreEstado;
            estadoSelect.appendChild(option);
        }
    } catch (error) {
        console.error('Error al cargar los estados:', error);
    }
}

function abrirModalCambioEstado(idVenta) {
    document.getElementById('cambiarEstadoForm').setAttribute('data-id', idVenta);
    $('#cambiarEstadoModal').modal('show');
}

async function cambiarEstado() {
    const idVenta = document.getElementById('cambiarEstadoForm').getAttribute('data-id');
    const nuevoEstado = document.getElementById('nuevoEstado').value;

    try {
        const response = await fetch(`${urlVentas}/${idVenta}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nuevoEstado })
        });

        const data = await response.json();

        if (response.ok) {
            Swal.fire(
                'Éxito!',
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

        $('#cambiarEstadoModal').modal('hide');
        cargarVentas(); // Recargar las ventas después del cambio de estado
    } catch (error) {
        console.error('Error al cambiar el estado de la venta:', error);
        Swal.fire(
            'Error!',
            'Error al cambiar el estado de la venta',
            'error'
        );
    }
}

async function verDetalleVenta(idVenta) {
    try {
        const response = await fetch(`${urlVentas}/${idVenta}`);
        const data = await response.json();
        const { NombreCompleto, Documento, FechaVenta, Total, EstadoVenta, productos, membresias } = data;

        const detalleVentaContenido = document.getElementById('detalleVentaContenido');
        detalleVentaContenido.innerHTML = `
            <div class="row mb-3">
                <div class="col">
                    <p><strong>Nombre:</strong> ${NombreCompleto}</p>
                    <p><strong>Documento:</strong> ${Documento}</p>
                </div>
                <div class="col">
                    <p><strong>Fecha de Venta:</strong> ${new Date(FechaVenta).toLocaleDateString()}</p>
                    <p><strong>Total:</strong> ${Total}</p>
                    <p><strong>Estado:</strong> ${EstadoVenta || 'Estado desconocido'}</p> <!-- Manejando undefined -->
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <h5><strong>Productos:</strong></h5>
                    <ul>${productos.map(p => `<li>${p.NombreProducto} - Cantidad: ${p.Cantidad}</li>`).join('')}</ul>
                </div>
                <div class="col">
                    <h5><strong>Membresías:</strong></h5>
                    <ul>${membresias.map(m => `<li>${m.NombreMembresia} - Cantidad: ${m.Cantidad}</li>`).join('')}</ul>
                </div>
            </div>
        `;

        $('#detalleVentaModal').modal('show');
    } catch (error) {
        console.error('Error al obtener los detalles de la venta:', error);
    }
}

