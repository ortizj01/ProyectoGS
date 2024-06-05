const url1 = 'http://localhost:3000/api/compras'
const url2 = 'http://localhost:3000/api/comprasproducto'

function agregarProducto() {
    var nuevoProductoContainer = document.createElement("div");
    nuevoProductoContainer.className ="productoContainer"

    var nuevoSelect = document.createElement("select");
    nuevoSelect.name = "productos[]";

    var opciones = document.getElementById("selectProducto").innerHTML;
    nuevoSelect.innerHTML = opciones;
    nuevoSelect.style.width = "300px"   

    var labelCantidad = document.createElement("label");
    labelCantidad.innerHTML = "Cantidad: ";
    labelCantidad.style.marginLeft = "50px"

    var labelValor = document.createElement("label");
    labelValor.innerHTML = "Valor: ";
    labelValor.style.marginLeft = "50px"

    var labelValorP = document.createElement("label");
    labelValorP.innerHTML = "$ 23.000 ";



    var nuevaCantidad = document.createElement("input");
    nuevaCantidad.type = "number";
    nuevaCantidad.style.width = "90px "
    nuevaCantidad.value = "1";  
    nuevaCantidad.min = "1";
    

    var btnEliminar = document.createElement("button");
    btnEliminar.type = "button";
    btnEliminar.className = "btn btn-soft-danger mt-2"; // Agrega la clase deseada
    btnEliminar.innerHTML = '<i class="fa-solid fa-minus fa-lg"></i>';
    btnEliminar.style.marginLeft = "50px"
    btnEliminar.onclick = function () {
        document.getElementById("productosAgregados").removeChild(nuevoProductoContainer);
        document.getElementById("productosAgregados").removeChild(btnEliminar);
        document.getElementById("productosAgregados").removeChild(brElement);

        
    };

    var brElement = document.createElement("div");
    brElement.innerHTML = '&nbsp;'; // Espacio en blanco
    
    

    nuevoProductoContainer.appendChild(nuevoSelect);
    nuevoProductoContainer.appendChild(labelCantidad);
    nuevoProductoContainer.appendChild(nuevaCantidad);
    nuevoProductoContainer.appendChild(labelValor);
    nuevoProductoContainer.appendChild(labelValorP);
    nuevoProductoContainer.appendChild(btnEliminar);  // Mover el botón eliminar aquí


    document.getElementById("productosAgregados").appendChild(nuevoProductoContainer);

}

const listarCompras = async () => {
    let ObjectId = document.getElementById('contenidoCompras'); // obj donde se mostrara la info
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
            if (compra.FechaCompra && compra.ValorCompra && compra.FechaRegistroCompra && compra.NumeroReciboCompra && compra.EstadoCompra && compra.IdProveedores !== undefined) {
                contenido += `
                    <tr>
                        <td>${compra.NumeroReciboCompra}</td>
                        <td>${compra.FechaCompra}</td>
                        <td>${compra.ValorCompra}</td>
                        <td>${compra.FechaRegistroCompra}</td>
                        <td>${compra.EstadoCompra}</td>
                        <td>${compra.IdProveedores}</td>
                        <td style="text-align: center;">
                            <div class="centered-container">
                            <a href="../ProveedoresEditar?id=${compra.IdCompra}">
                                <i class="fa-regular fa-pen-to-square fa-xl me-2"></i>
                            </a>
                                <i class="fa-regular fa-eye fa-xl me-2"></i>
                        </td>
                    </tr>
                `;
            } else {
                console.error('Formato de datos incorrecto', compra);
            }
        });

        ObjectId.innerHTML = contenido;

    } catch (error) {
        console.error('Error:', error);
    }
};   


async function enviarCompra() {
    const now = new Date();
    const FechaRegistroCompra = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    
    const FechaCompra = document.getElementById("fechaCompra").value;
    const ValorCompra = document.getElementById("valorCompra").value;
    const NumeroReciboCompra = document.getElementById("numeroReciboCompra").value;
    const IdProveedores = document.getElementById("idProveedores").value;

    const compra = {
        FechaCompra,
        ValorCompra,
        FechaRegistroCompra,
        NumeroReciboCompra,
        EstadoCompra: 1,
        IdProveedores
    };

    try {
        const responseCompra = await fetch(url1, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(compra)
        });

        if (!responseCompra.ok) {
            throw new Error(`Error en la compra: ${responseCompra.status} - ${responseCompra.statusText}`);
        }

        const compraData = await responseCompra.json();
        const IdCompra = compraData.id;

        const productosContainers = document.querySelectorAll('.productoContainer');

        const productoPromises = Array.from(productosContainers).map(async (container) => {
            const productoSelect = container.querySelector('select[name="productos[]"]');
            const cantidadInput = container.querySelector('input[type="number"]');

            if (productoSelect && cantidadInput) {
                const IdProducto = productoSelect.value;
                const CantidadProducto = cantidadInput.value;

                const productoCompra = {
                    IdCompra,
                    IdProducto,
                    CantidadProducto
                };

                const responseProducto = await fetch(url2, {
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
                return null; // Puedes retornar null u otro valor para manejar esto según tu lógica
            }
        });

        await Promise.all(productoPromises);

        alert('Compra realizada con éxito');
    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un problema al realizar la compra');
    }
}




