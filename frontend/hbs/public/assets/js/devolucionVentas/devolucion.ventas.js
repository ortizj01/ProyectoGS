const url1 = 'http://localhost:3000/api/devolucionventas';
const url2 = 'http://localhost:3000/api/ventasproducto';
const url3 = 'http://localhost:3000/api/ventas';

const listarDevVentas = async () => {
    let ObjectId = document.getElementById('contenidoDevVentas');
    let contenido = '';

    try {
        const response = await fetch(url1, {
            method: 'GET',
            mode: 'cors',
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });

        if (!response.ok) {
            throw new Error('Error en la solicitud: ' + response.statusText);
        }

        const data = await response.json();
        
        data.forEach(venta => {
            contenido += `
                <tr>
                    <td>${venta.NumeroReciboVenta}</td>
                    <td>${venta.Motivo}</td>
                    <td>$${venta.ValorDevolucion}</td>
                    <td>${venta.FechaDevolucion}</td>
                    <td>${venta.estado_descripcion}</td>
                    <td style="text-align: center;">
                        <div class="centered-container">
                            <a href="../visualizardevventa?id=${venta.IdDevolucionVenta}">
                                <i class="fa-regular fa-eye fa-xl me-2"></i>
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
                    "last": "Ultimo",
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

document.addEventListener('DOMContentLoaded', listarDevVentas);
