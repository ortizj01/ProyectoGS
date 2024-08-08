const url1 = 'http://localhost:3000/api/devolucionventas';
const url2 = 'http://localhost:3000/api/ventasproducto';
const url3 = 'http://localhost:3000/api/ventas';

const cargarVentasEnSelect = async () => {
    try {
        const response = await fetch(url3, {
            method: 'GET',
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });

        if (!response.ok) {
            throw new Error('Error en la solicitud: ' + response.statusText);
        }

        const ventas = await response.json();
        const selectVenta = document.getElementById('idVenta');
        selectVenta.innerHTML = '<option selected disabled>Selecciona la Venta</option>'; // Resetea el select

        ventas.forEach(venta => {
            const option = document.createElement('option');
            option.value = venta.IdVenta;
            option.textContent = `Venta ID: ${venta.IdVenta}, Fecha: ${venta.FechaVenta}, Total: $${venta.Total}`;
            selectVenta.appendChild(option);
        });
    } catch (error) {
        console.error('Error:', error);
    }
};

// Llama a la función para cargar las ventas cuando se cargue la página
document.addEventListener('DOMContentLoaded', cargarVentasEnSelect);

const cargarProductosDeVenta = async (ventaId) => {
    try {
        const response = await fetch(`${url2}/${ventaId}`, {
            method: 'GET',
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });

        if (!response.ok) {
            throw new Error('Error en la solicitud: ' + response.statusText);
        }

        const productos = await response.json();
        const productosContainer = document.getElementById('productosDeVentaContainer');
        productosContainer.innerHTML = '';

        productos.forEach(producto => {
            const tr = document.createElement('tr');
            tr.classList.add('productoRow');

            const tdProducto = document.createElement('td');
            const selectNombre = document.createElement('select');
            selectNombre.style.width = '300px';
            selectNombre.disabled = true;
            selectNombre.name = 'productos[]';

            const optionNombre = document.createElement('option');
            optionNombre.value = producto.IdProducto;
            optionNombre.textContent = producto.NombreProducto;
            selectNombre.appendChild(optionNombre);

            tdProducto.appendChild(selectNombre);
            tr.appendChild(tdProducto);

            const tdValor = document.createElement('td');
            tdValor.classList.add('valorProducto');
            tdValor.textContent = `$${producto.PrecioProducto}`;
            tr.appendChild(tdValor);

            const tdCantidad = document.createElement('td');
            const inputCantidad = document.createElement('input');
            inputCantidad.type = 'number';
            inputCantidad.style.width = '50px';
            inputCantidad.min = 0;
            inputCantidad.max = producto.CantidadProducto;
            inputCantidad.value = producto.CantidadProducto;
            inputCantidad.name = 'cantidades[]';

            tdCantidad.appendChild(inputCantidad);
            tr.appendChild(tdCantidad);

            const tdValorTotal = document.createElement('td');
            const valorTotalText = document.createElement('span');
            valorTotalText.classList.add('valortotal');
            valorTotalText.textContent = `$${(producto.PrecioProducto * producto.CantidadProducto).toFixed(2)}`;
            tdValorTotal.appendChild(valorTotalText);
            tr.appendChild(tdValorTotal);

            inputCantidad.addEventListener('input', () => {
                calcularValorTotal(tr);
            });

            const tdAcciones = document.createElement('td');
            const btnEliminar = document.createElement('button');
            btnEliminar.type = 'button';
            btnEliminar.className = 'btn btn-soft-danger';
            btnEliminar.textContent = 'Eliminar';
            btnEliminar.onclick = function() {
                tr.remove();
                calcularValorTotal();
            };

            tdAcciones.appendChild(btnEliminar);
            tr.appendChild(tdAcciones);

            productosContainer.appendChild(tr);
        });

        calcularValorTotal();

    } catch (error) {
        console.error('Error:', error);
    }
};

const precargarDatosVentaEnFormulario = async () => {
    var urlParams = new URLSearchParams(window.location.search);
    var ventaId = urlParams.get('id');

    try {
        const response = await fetch(`${url3}/${ventaId}`, {
            method: 'GET',
            mode: 'cors',
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });

        if (!response.ok) {
            throw new Error('Error en la solicitud: ' + response.statusText);
        }

        const venta = await response.json();
        document.getElementById('FechaVenta').value = venta.FechaVenta;
        document.getElementById('NumeroReciboVenta').value = venta.NumeroReciboVenta;
        document.getElementById('ValorDev').value = venta.Total;

    } catch (error) {
        console.error('Error:', error);
    }
};

async function enviarDevVenta() {
    const now = new Date();
    const FechaDevolucion = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    const urlParams = new URLSearchParams(window.location.search);
    const ventaId = urlParams.get('id');
    const Motivo = document.getElementById("MDevolucion").value;
    const ValorDevolucion = document.getElementById("ValorDev").value;

    if (Motivo === "" || ValorDevolucion === "") {
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
        ValorDevolucion,
        EstadoDevolucion: 1,
        IdVenta: ventaId,
        FechaDevolucion
    };

    try {
        const responsedevventa = await fetch(url1, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(devventa)
        });

        if (!responsedevventa.ok) {
            throw new Error(`Error en la venta: ${responsedevventa.status} - ${responsedevventa.statusText}`);
        }

        const devventaData = await responsedevventa.json();
        const IdDevolucionesVenta = devventaData.id;

        const productosRows = document.querySelectorAll('.productoRow');

        const productoPromises = Array.from(productosRows).map(async (row) => {
            const productoSelect = row.querySelector('select[name="productos[]"]');
            const cantidadInput = row.querySelector('input[name="cantidades[]"]');
        
            if (productoSelect && cantidadInput) {
                const IdProducto = productoSelect.value;
                const CantidadProducto = cantidadInput.value;
        
                const productoVenta = {
                    IdDevolucionesVenta,
                    IdProducto,
                    CantidadProducto,
                    IdVenta: ventaId,
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
                window.location.href = '../Devolucionven';
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

function calcularValorTotal() {
    let sumaTotal = 0;

    document.querySelectorAll('.productoRow').forEach(container => {
        let valorProductoText = container.querySelector('.valorProducto').textContent.trim();
        let valorProducto = parseFloat(valorProductoText.replace('$', '').replace(',', '').trim());
        
        let cantidad = parseInt(container.querySelector('input[name="cantidades[]"]').value);
        
        let valorTotal = valorProducto * cantidad;
        
        container.querySelector('.valortotal').textContent = `$${valorTotal.toFixed(2)}`;
        
        sumaTotal += valorTotal;
    });

    document.getElementById('ValorDev').value = sumaTotal.toFixed(2);
}
