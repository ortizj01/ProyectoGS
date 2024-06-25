const urlVentas = 'http://localhost:3000/api/devolucionventas';

const listarDevVentas = async () => {
    let ObjectId = document.getElementById('contenidoDevVentas');
    let contenido = '';

    try {
        const response = await fetch(urlVentas, {
            method: 'GET',
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });

        if (!response.ok) {
            throw new Error('Error en la solicitud: ' + response.statusText);
        }

        const data = await response.json();

        data.forEach(devolucion => {
            contenido += `
                <tr>
                    <td>${devolucion.IdDevolucionVenta}</td>
                    <td>${devolucion.IdVenta}</td>
                    <td>${devolucion.Motivo}</td>
                    <td>$${devolucion.ValorDevolucionVenta}</td>
                    <td>${devolucion.FechaDevolucionFormatted}</td>
                    <td>${devolucion.estado_descripcion}</td>
                    <td style="text-align: center;">
                        <div class="centered-container">
                            <a href="visualizar_devolucion_venta.html?id=${devolucion.IdDevolucionVenta}">
                                <i class="fa-regular fa-eye fa-xl me-2"></i>
                            </a>
                            <a href="javascript:void(0);" onclick="eliminarDevolucionVenta(${devolucion.IdDevolucionVenta})">
                                <i class="fa-regular fa-trash-alt fa-xl me-2"></i>
                            </a>
                        </div>
                    </td>
                </tr>
            `;
        });

        ObjectId.innerHTML = contenido;

        $('#dataTable').DataTable().destroy();
        $('#dataTable').DataTable({
            language: {
                "decimal": "",
                "emptyTable": "No hay información",
                "info": "Mostrando _START_ a _END_ de _TOTAL_ Entradas",
                "infoEmpty": "Mostrando 0 a 0 de 0 Entradas",
                "infoFiltered": "(Filtrado de _MAX_ total entradas)",
                "thousands": ",",
                "lengthMenu": "Mostrar _MENU_ Entradas",
                "loadingRecords": "Cargando...",
                "processing": "Procesando...",
                "search": "Buscar:",
                "zeroRecords": "Sin resultados encontrados",
                "paginate": {
                    "first": "Primero",
                    "last": "Último",
                    "next": "Siguiente",
                    "previous": "Anterior"
                }
            },
            lengthMenu: [5, 10, 25, 50],
            pageLength: 5
        });

    } catch (error) {
        console.error('Error:', error);
    }
};

const eliminarDevolucionVenta = async (id) => {
    try {
        const response = await fetch(`http://localhost:3000/api/devolucionventas/${id}`, {
            method: 'DELETE',
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });

        if (!response.ok) {
            throw new Error('Error en la solicitud: ' + response.statusText);
        }

        Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'Devolución eliminada con éxito',
            confirmButtonText: 'Aceptar'
        }).then((result) => {
            if (result.isConfirmed) {
                listarDevVentas();
            }
        });
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un error al eliminar la devolución',
            confirmButtonText: 'Aceptar'
        });
    }
};

document.addEventListener('DOMContentLoaded', listarDevVentas);
