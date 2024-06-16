const url1 = 'http://localhost:3000/api/devolucioncompras'
const url2 = 'http://localhost:3000/api/comprasproducto'

const precargarDatosCompraEnFormulario = async () => {

    // Buscar el parámetro 'id' en la URL
    var urlParams = new URLSearchParams(window.location.search);
    var compraId = urlParams.get('id');
    console.log(compraId);
    try {
        const response = await fetch(`${url1}/${compraId}`, {
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

        // Precargar los datos de la compra en el formulario en label
        document.getElementById('Fecha_compra').value = devolucion.Fecha_RegistroCompra;
        document.getElementById('NumeroReciboCompra').value = devolucion.NumeroReciboCompra;
        document.getElementById('ValorDev').value = devolucion.ValorCompra;

    } catch (error) {
        console.error('Error:', error);
    }
};


const precargarDatosproductosEnFormulario = async () => {
    var urlParams = new URLSearchParams(window.location.search);
    var compraId = urlParams.get('id');
    console.log(compraId);
    
    try {
        const response = await fetch(`http://localhost:3000/api/comprasproducto/${compraId}`, {
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

async function enviarDevCompra() {
    const now = new Date();
    const FechaDevolucionCompra = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    var urlParams = new URLSearchParams(window.location.search);
    var compraId = urlParams.get('id');
    console.log(compraId);
    const Motivo = document.getElementById("MDevolucion").value;
    const ValorDevolucion = document.getElementById("ValorDev").value;

    const devcompra = {
        Motivo,
        ValorDevolucion,
        EstadoDevolucion: 1,
        IdCompra: compraId,
        FechaDevolucionCompra
    };

    try {
        const responsedevcompra = await fetch('http://localhost:3000/api/devolucioncompras', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(devcompra)
        });

        if (!responsedevcompra.ok) {
            throw new Error(`Error en la compra: ${responsedevcompra.status} - ${responsedevcompra.statusText}`);
        }

        const devcompracompraData = await responsedevcompra.json();
        const IdDevolucionesCompra = devcompracompraData.id;

        const productosContainers = document.querySelectorAll('.productoContainer');

        const productoPromises = Array.from(productosContainers).map(async (container) => {
            const productoSelect = container.querySelector('select[name="productos[]"]');
            const cantidadInput = container.querySelector('input[name="cantidades[]"]');

            console.log(productoSelect);
            console.log(cantidadInput);

            if (productoSelect && cantidadInput) {
                const IdProducto = productoSelect.value;
                const CantidadProducto = cantidadInput.value;

                const productoCompra = {
                    IdDevolucionesCompra,
                    IdProducto,
                    CantidadProducto
                };
                console.log(productoCompra);

                const responseProducto = await fetch('http://localhost:3000/api/devolucioncomprasproducto', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(productoCompra)
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
                window.location.href = '../Devolucioncom'; // Reemplaza esta URL con la ruta real
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
}

const listarDevCompras = async () => {
    let ObjectId = document.getElementById('contenidoDevCompras'); // obj donde se mostrara la info
    let contenido = ''; // contiene las filas y celdas que se mostraran en el tbody

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
        
        // Verificar datos recibidos
        console.log('Datos recibidos:', data);
        
        // Aquí asumimos que data es un array de objetos de rutinas
        data.forEach(compra => {
            // Verificar cada rutina
            console.log('compra:', compra);
            
            // Asegurarse de que las propiedades existan
            if (compra.NumeroReciboCompra && compra.Motivo && compra.ValorDevolucion && compra.Fecha_compraf && compra.estado_descripcion !== undefined) {
                contenido += `
                    <tr>
                        <td>${compra.NumeroReciboCompra}</td>
                        <td>${compra.Motivo}</td>
                        <td>$${compra.ValorDevolucion}</td>
                        <td>${compra.Fecha_compraf}</td>
                        <td>${compra.estado_descripcion}</td>
                        <td style="text-align: center;">
                            <div class="centered-container">
                            <a href="../visualizarcompra?id=${compra.IdCompra}">
                                <i class="fa-regular fa-eye fa-xl me-2"></i>
                            </a>
                        </td>
                    </tr>
                `;
            } else {
                console.error('Formato de datos incorrecto', compra);
            }
        });

        ObjectId.innerHTML = contenido;
        $('#dataTable').DataTable().destroy();

        $('#dataTable').DataTable({
            language: {
                "decimal": "",
                "emptyTable": "No hay información",
                "info": "Mostrando _START_ a _END_ de _TOTAL_ Entradas",
                "infoEmpty": "Mostrando 0 to 0 of 0 Entradas",
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
                    "last": "Ultimo",
                    "next": "Siguiente",
                    "previous": "Anterior"
                }
            }, 
            lengthMenu: [5, 10, 25, 50], // Opciones de selección de registros por página
            pageLength: 5 
        });

    } catch (error) {
        console.error('Error:', error);
    }
}; 











