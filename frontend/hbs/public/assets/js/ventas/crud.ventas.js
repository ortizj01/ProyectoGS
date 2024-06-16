const urlVentas = 'http://localhost:3000/api/ventas';
const urlProductos = 'http://localhost:3000/api/productos';
const urlMembresias = 'http://localhost:3000/api/membresias';
const urlUsuarios = 'http://localhost:3000/api/usuarios';

document.addEventListener('DOMContentLoaded', () => {
    cargarUsuarios();
    cargarProductos();
    cargarMembresias();
});

async function cargarUsuarios() {
    try {
        const response = await fetch(urlUsuarios);
        const usuarios = await response.json();
        const selectUsuarios = document.getElementById('idUsuarios');
        usuarios.forEach(usuario => {
            const option = document.createElement('option');
            option.value = usuario.IdUsuario;
            option.textContent = `${usuario.Nombres} ${usuario.Apellidos}`;
            selectUsuarios.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar los usuarios:', error);
    }
}

async function cargarProductos() {
    try {
        const response = await fetch(urlProductos);
        const productos = await response.json();
        const selectProducto = document.getElementById('selectProducto');
        productos.forEach(producto => {
            const option = document.createElement('option');
            option.value = producto.IdProducto;
            option.textContent = producto.NombreProducto;
            selectProducto.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar los productos:', error);
    }
}

async function cargarMembresias() {
    try {
        const response = await fetch(urlMembresias);
        const membresias = await response.json();
        const selectMembresia = document.getElementById('selectMembresia');
        membresias.forEach(membresia => {
            const option = document.createElement('option');
            option.value = membresia.IdMembresia;
            option.textContent = membresia.NombreMembresia;
            selectMembresia.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar las membresías:', error);
    }
}

function agregarProducto() {
    const container = document.createElement('div');
    container.classList.add('productoContainer', 'd-flex', 'align-items-center', 'mb-2');
    container.innerHTML = `
        <select name="productos[]" class="form-select" style="width:300px" onchange="actualizarValorProducto(this)">
            <option selected="" disabled="">Agregar producto a la venta</option>
        </select>
        <label for="cantidad" style="margin-left:20px">Cantidad:</label>
        <input style="width:90px" type="number" name="cantidades[]" value="1" min="1" class="form-control d-inline-block" required>
        <label for="Valor" style="margin-left:20px">Valor:</label>
        <label for="Valor">$0</label>
        <button type="button" class="btn btn-soft-danger mt-2" onclick="eliminarProducto(this)" style="margin-left:20px"><i class="fa-solid fa-minus fa-lg"></i></button>
    `;
    document.getElementById('productosAgregados').appendChild(container);
    cargarProductos(); // Volvemos a cargar productos para el nuevo select
}

function eliminarProducto(button) {
    button.parentElement.remove();
    calcularTotal();
}

function agregarMembresia() {
    const container = document.createElement('div');
    container.classList.add('membresiaContainer', 'd-flex', 'align-items-center', 'mb-2');
    container.innerHTML = `
        <select name="membresias[]" class="form-select" style="width:300px" onchange="actualizarValorMembresia(this)">
            <option selected="" disabled="">Agregar membresía a la venta</option>
        </select>
        <label for="cantidadMembresia" style="margin-left:20px">Cantidad:</label>
        <input style="width:90px" type="number" name="cantidadesMembresia[]" value="1" min="1" class="form-control d-inline-block" required>
        <label for="Valor" style="margin-left:20px">Valor:</label>
        <label for="Valor">$0</label>
        <button type="button" class="btn btn-soft-danger mt-2" onclick="eliminarMembresia(this)" style="margin-left:20px"><i class="fa-solid fa-minus fa-lg"></i></button>
    `;
    document.getElementById('membresiasAgregadas').appendChild(container);
    cargarMembresias(); // Volvemos a cargar membresías para el nuevo select
}

function eliminarMembresia(button) {
    button.parentElement.remove();
    calcularTotal();
}

function actualizarValorProducto(select) {
    const idProducto = select.value;
    if (idProducto) {
        fetch(`http://localhost:3000/api/productos/${idProducto}`)
            .then(response => response.json())
            .then(data => {
                select.parentElement.querySelector('label[for="Valor"]').textContent = `$${data.PrecioProducto}`;
                calcularTotal();
            })
            .catch(error => console.error('Error al obtener el valor del producto:', error));
    }
}

function actualizarValorMembresia(select) {
    const idMembresia = select.value;
    if (idMembresia) {
        fetch(`http://localhost:3000/api/membresias/${idMembresia}`)
            .then(response => response.json())
            .then(data => {
                select.parentElement.querySelector('label[for="Valor"]').textContent = `$${data.PrecioMembresia}`;
                calcularTotal();
            })
            .catch(error => console.error('Error al obtener el valor de la membresía:', error));
    }
}

function calcularTotal() {
    const productos = document.querySelectorAll('select[name="productos[]"]');
    const cantidades = document.querySelectorAll('input[name="cantidades[]"]');
    const membresias = document.querySelectorAll('select[name="membresias[]"]');
    const cantidadesMembresia = document.querySelectorAll('input[name="cantidadesMembresia[]"]');
    let total = 0;

    productos.forEach((select, index) => {
        if (select.value) {
            const precioProducto = select.options[select.selectedIndex].text.split('- $')[1];
            total += parseFloat(precioProducto) * parseInt(cantidades[index].value);
        }
    });

    membresias.forEach((select, index) => {
        if (select.value) {
            const precioMembresia = select.options[select.selectedIndex].text.split('- $')[1];
            total += parseFloat(precioMembresia) * parseInt(cantidadesMembresia[index].value);
        }
    });

    document.getElementById('total').value = total.toFixed(2);
}

async function enviarVenta() {
    const fechaVenta = document.getElementById('fechaVenta').value;
    const pagoNeto = document.getElementById('pagoNeto').value;
    const iva = document.getElementById('iva').value;
    const total = document.getElementById('total').value;
    const idUsuario = document.getElementById('idUsuarios').value;

    const productos = Array.from(document.querySelectorAll('select[name="productos[]"]')).map((select, index) => ({
        IdProducto: select.value,
        Cantidad: document.querySelectorAll('input[name="cantidades[]"]')[index].value
    }));

    const membresias = Array.from(document.querySelectorAll('select[name="membresias[]"]')).map((select, index) => ({
        IdMembresia: select.value,
        Cantidad: document.querySelectorAll('input[name="cantidadesMembresia[]"]')[index].value
    }));

    if (!fechaVenta || !pagoNeto || !iva || !total || !idUsuario || productos.length === 0 || membresias.length === 0) {
        alert('Por favor, complete todos los campos obligatorios y agregue al menos un producto y una membresía.');
        return;
    }

    const venta = {
        IdUsuario: idUsuario,
        FechaVenta: fechaVenta,
        PagoNeto: parseFloat(pagoNeto),
        Iva: parseFloat(iva),
        Total: parseFloat(total),
        EstadoVenta: 1,
        productos: productos,
        membresias: membresias
    };

    try {
        const response = await fetch(urlVentas, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(venta)
        });
        if (!response.ok) throw new Error('Error al crear la venta');
        alert('Venta creada exitosamente');
        location.reload();
    } catch (error) {
        console.error('Error:', error);
        alert('Error al crear la venta');
    }
}
