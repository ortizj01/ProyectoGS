const formulario = document.getElementById('FormularioDevolucion');

if (formulario) {
    formulario.addEventListener("submit", function (event) {
        event.preventDefault();
        validateForm();
    });
}

document.addEventListener("DOMContentLoaded", function () {
    function validateNombreVenta (input) {
        const regex = /^[a-zA-Z\s]*$/;
        return regex.test(input.value.trim());
    }

    function validateIdVenta(input) {
        const regex = /^\d+$/;
        return regex.test(input.value.trim());
    }

    function validateMotivo(input) {
        const regex = /^[a-zA-Z\s]{8,70}$/;
        return regex.test(input.value.trim());
    }

    function updateErrorMessage(id, isValid, message) {
        const errorSpan = document.getElementById(id);
        errorSpan.textContent = isValid ? '' : message;
    }

    function validateForm() {
        const nombreInput = document.querySelector('input[name="NombreVenta"]');
        const productoInput = document.querySelector('select[name="productos"]');
        const idVentaInput = document.querySelector('input[name="IdVenta"]');
        const motivoInput = document.querySelector('textarea[name="Motivo"]');
    
        const isValidNombre = validateNombreVenta(nombreInput); // Corregir aquí
        const isValidProducto = productoInput.value !== "";
        const isValidIdVenta = validateIdVenta(idVentaInput);
        const isValidMotivo = validateMotivo(motivoInput);
    
        updateErrorMessage('nombre-error', isValidNombre, 'Solo se permiten letras y espacios en el nombre');
        updateErrorMessage('producto-error', isValidProducto, 'Seleccione un producto');
        updateErrorMessage('IdVenta-error', isValidIdVenta, 'Ingrese un ID de venta válido');
        updateErrorMessage('Motivo-error', isValidMotivo, 'Ingrese un motivo válido');
    
        if (isValidNombre && isValidProducto && isValidIdVenta && isValidMotivo) {
            alert('Formulario válido. Guardar información.');
        } else {
            alert('El formulario no es válido. Por favor, revisa los campos.');
        }
    }

    const guardarButton = document.querySelector('button[name="Guardar"]');
    if (guardarButton) {
        guardarButton.addEventListener("click", validateForm);
    }
});


const urlDevolucionVentas = 'http://localhost:3000/api/devolucionventas';
const urlProductosVenta = 'http://localhost:3000/api/ventasproducto';

const precargarDatosVentaEnFormulario = async () => {
    var urlParams = new URLSearchParams(window.location.search);
    var ventaId = urlParams.get('id');
    console.log(ventaId);

    try {
        const response = await fetch(`${urlDevolucionVentas}/${ventaId}`, {
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
        document.getElementById('FechaVenta').value = devolucion.FechaVenta;
        document.getElementById('NumeroVenta').value = devolucion.IdVenta;
        document.getElementById('ValorDevolucion').value = devolucion.Total;

    } catch (error) {
        console.error('Error:', error);
    }
};

const precargarDatosProductosEnFormulario = async () => {
    var urlParams = new URLSearchParams(window.location.search);
    var ventaId = urlParams.get('id');
    console.log(ventaId);
    
    try {
        const response = await fetch(`${urlProductosVenta}/${ventaId}`, {
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
            spanValor.textContent = 'Valor: ';
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

async function enviarDevolucionVenta() {
    const now = new Date();
    const FechaDevolucion = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    var urlParams = new URLSearchParams(window.location.search);
    var ventaId = urlParams.get('id');
    console.log(ventaId);
    const Motivo = document.getElementById("MotivoDevolucion").value;
    const ValorDevolucion = document.getElementById("ValorDevolucion").value;

    if (Motivo === "" || ValorDevolucion === "") {
        Swal.fire({
            icon: 'warning',
            title: 'Error',
            text: 'Llene todos los campos',
            confirmButtonText: 'Aceptar'
        });
        return;
    }

    const devVenta = {
        Motivo,
        ValorDevolucionVenta: ValorDevolucion,
        EstadoDevolucion: 1,
        IdVenta: ventaId,
        FechaDevolucion
    };

    try {
        const responseDevVenta = await fetch(urlDevolucionVentas, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(devVenta)
        });

        if (!responseDevVenta.ok) {
            throw new Error(`Error en la venta: ${responseDevVenta.status} - ${responseDevVenta.statusText}`);
        }

        const devVentaData = await responseDevVenta.json();
        const IdDevolucionesVenta = devVentaData.id;

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
                    PrecioUnitario: container.querySelector('span').textContent
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
                window.location.href = 'listarDevolucionesVentas.html';
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
