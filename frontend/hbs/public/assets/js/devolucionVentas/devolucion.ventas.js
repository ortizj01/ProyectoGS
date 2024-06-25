const urlVentas = 'http://localhost:3000/api/devolucionventas';
const urlVentasProducto = 'http://localhost:3000/api/ventasproducto';

const listarDevVentas = async () => {
    let ObjectId = document.getElementById('contenidoDevVentas');
    let contenido = '';

    try {
        const response = await fetch(urlVentas, {
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
        
        data.forEach(devolucion => {
            contenido += `
                <tr>
                    <td>${devolucion.IdDevolucionVenta}</td>
                    <td>${devolucion.IdVenta}</td>
                    <td>${devolucion.Motivo}</td>
                    <td>$${devolucion.ValorDevolucionVenta}</td>
                    <td>${devolucion.FechaVentaFormatted}</td>
                    <td>${devolucion.estado_descripcion}</td>
                    <td style="text-align: center;">
                        <div class="centered-container">
                            <a href="../visualizar_devolucion_venta.html?id=${devolucion.IdDevolucionVenta}">
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
                "infoPostFix": "",
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

const precargarDatosVentaEnFormulario = async () => {
    var urlParams = new URLSearchParams(window.location.search);
    var ventaId = urlParams.get('id');
    console.log(ventaId);

    try {
        const response = await fetch(`${urlVentas}/${ventaId}`, {
            method: 'GET',
            mode: 'cors',
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });

        if (!response.ok) {
            throw new Error('Error en la solicitud: ' + response.statusText);
        }

        const devolucion = await response.json();

        document.getElementById('Fecha_venta').value = devolucion.FechaVenta;
        document.getElementById('NumeroReciboVenta').value = devolucion.IdVenta;
        document.getElementById('ValorDev').value = devolucion.Total;

    } catch (error) {
        console.error('Error:', error);
    }
};

const precargarDatosProductosVentaEnFormulario = async () => {
    var urlParams = new URLSearchParams(window.location.search);
    var ventaId = urlParams.get('id');
    console.log(ventaId);
    
    try {
        const response = await fetch(`http://localhost:3000/api/ventasproducto/${ventaId}`, {
            method: 'GET',
            mode: 'cors',
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });

        if (!response.ok) {
            throw new Error('Error en la solicitud: ' + response.statusText);
        }

        const productos = await response.json();

        const productosContainer = document.getElementById('productosAgregados');
        productosContainer.innerHTML = '';

        productos.forEach(producto => {
            const divProducto = document.createElement('div');
            divProducto.classList.add('productoContainer');
            divProducto.style.display = 'flex';
            divProducto.style.alignItems = 'center';
            divProducto.style.marginBottom = '10px';
            divProducto.style.width = '500px';

            const selectNombre = document.createElement('select');
            selectNombre.style.width = '300px';
            selectNombre.style.marginRight = '30px';

            const optionNombre = document.createElement('option');
            optionNombre.value = producto.IdProducto;
            optionNombre.textContent = producto.NombreProducto;
            selectNombre.appendChild(optionNombre);
            selectNombre.disabled = true;
            selectNombre.name = 'productos[]';
            divProducto.appendChild(selectNombre);

            const spanValor = document.createElement('span');
            spanValor.textContent = 'valor: ';
            spanValor.style.marginRight = '10px';
            divProducto.appendChild(spanValor);

            const spanPrecio = document.createElement('span');
            spanPrecio.textContent = producto.PrecioProducto;
            spanPrecio.style.marginRight = '30px';
            divProducto.appendChild(spanPrecio);

            const spanCantidad = document.createElement('span');
            spanCantidad.textContent = 'Cantidad:';
            spanCantidad.style.marginRight = '10px';
            divProducto.appendChild(spanCantidad);

            const inputCantidad = document.createElement('input');
            inputCantidad.type = 'number';
            inputCantidad.style.width = '50px';
            inputCantidad.style.marginRight = '30px';
            inputCantidad.min = 0;
            inputCantidad.max = producto.CantidadProducto;
            inputCantidad.value = producto.CantidadProducto;
            inputCantidad.name = 'cantidades[]';
            inputCantidad.disabled = true;
            divProducto.appendChild(inputCantidad);

            productosContainer.appendChild(divProducto);
        });

    } catch (error) {
        console.error('Error:', error);
    }
};

const enviarDevVenta = async () => {
    const now = new Date();
    const FechaDevolucion = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    var urlParams = new URLSearchParams(window.location.search);
    var ventaId = urlParams.get('id');
    console.log(ventaId);
    const Motivo = document.getElementById("MDevolucion").value;
    const ValorDevolucionVenta = document.getElementById("ValorDev").value;

    if (Motivo === "" || ValorDevolucionVenta === "") {
        Swal.fire({
            icon: 'warning',
            title: 'Error',
            text: 'Llene todos los campos',
            confirmButtonText: 'Aceptar'
        });
        return;
    }

    const devventa = {
        Motivo,
        ValorDevolucionVenta,
        EstadoDevolucion: 1,
        IdVenta: ventaId,
        FechaDevolucion
    };

    try {
        const responseDevVenta = await fetch('http://localhost:3000/api/devolucionventas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(devventa)
        });

        if (!responseDevVenta.ok) {
            throw new Error(`Error en la devolución: ${responseDevVenta.status} - ${responseDevVenta.statusText}`);
        }

        const devventaData = await responseDevVenta.json();
        const IdDevolucionesVenta = devventaData.id;

        const productosContainers = document.querySelectorAll('.productoContainer');

        const productoPromises = Array.from(productosContainers).map(async (container) => {
            const productoSelect = container.querySelector('select[name="productos[]"]');
            const cantidadInput = container.querySelector('input[name="cantidades[]"]');

            if (productoSelect && cantidadInput) {
                const IdProducto = productoSelect.value;
                const CantidadProducto = cantidadInput.value;

                const productoVenta = {
                    IdDevolucionesVenta,
                    IdProducto,
                    CantidadProducto,
                    PrecioUnitario: parseFloat(container.querySelector('span:nth-child(3)').textContent)
                };

                const responseProducto = await fetch('http://localhost:3000/api/devolucionventasproducto', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(productoVenta)
                });

                if (!responseProducto.ok) {
                    throw new Error(`Error en la adición del producto: ${responseProducto.status} - ${responseProducto.statusText}`);
                }

                return responseProducto.json();
            } else {
                console.error('Error: No se encontró el elemento de producto o cantidad');
                return null;
            }
        });

        await Promise.all(productoPromises);

        Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'Devolución agregada con éxito',
            confirmButtonText: 'Aceptar'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = 'listar_devoluciones_ventas.html';
            }
        });
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un error al agregar la devolución',
            confirmButtonText: 'Aceptar'
        });
    }
};

const eliminarDevolucionVenta = async (id) => {
    try {
        const response = await fetch(`http://localhost:3000/api/devolucionventas/${id}`, {
            method: 'DELETE',
            mode: 'cors',
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
