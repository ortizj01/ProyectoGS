document.addEventListener('DOMContentLoaded', () => {
    const url = 'http://localhost:3000/Api/Servicios';

    // Realizar la solicitud GET utilizando fetch
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json(); // Parsear la respuesta a JSON
        })
        .then(data => {
            const tableBody = document.getElementById('dataTableBody');
            tableBody.innerHTML = '';

            data.forEach(servicio => {
                const estado = servicio.Estado === 1 ? 'Activo' : 'Inactivo';

                const row = document.createElement('tr');
                row.innerHTML = `
        <td>${servicio.NombreClase}</td>
        <td>${servicio.Instructor}</td>
        <td>${servicio.CostoVenta}</td>
        <td>${estado}</td>
        <td>
            <div class="centered-container">
                <a href="detalleServicio?id=${servicio.IdServicio}"><i class="fa-regular fa-eye fa-xl me-2"></i></a>
                <a href="formServiciosModal"><i class="fa-regular fa-pen-to-square fa-xl me-2"></i></a>
                <i class="fa-solid fa-trash fa-xl me-2" data-bs-toggle="modal" data-bs-target="#eliminarServicioModal" data-id="${servicio.IdServicio}"></i>
            </div>
        </td>
                `;
                tableBody.appendChild(row);

                // Agregar evento al botón de eliminar para mostrar modal de confirmación
                const eliminarBtn = row.querySelector('.fa-trash');
                eliminarBtn.addEventListener('click', () => {
                    const servicioId = eliminarBtn.getAttribute('data-id');
                    console.log('Eliminar servicio con ID:', servicioId);
                    // Asignar el ID del servicio al formulario de confirmación
                    document.getElementById('eliminarServicioForm').setAttribute('data-id', servicioId);
                });
            });
        })
        .catch(error => {
            console.error('Error al obtener los datos:', error);
        });

    // Manejar la confirmación de eliminar
    const eliminarServicioForm = document.getElementById('eliminarServicioForm');
    eliminarServicioForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const servicioId = eliminarServicioForm.getAttribute('data-id');
        console.log('Confirmar eliminar servicio con ID:', servicioId);

        // Enviar la solicitud DELETE al servidor
        fetch(`http://localhost:3000/Api/Servicios/${servicioId}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            // Eliminar la fila correspondiente de la tabla
            const rowToDelete = document.querySelector(`.fa-trash[data-id='${servicioId}']`).closest('tr');
            rowToDelete.remove();

            // Cerrar el modal de confirmación
            const modal = document.getElementById('eliminarServicioModal');
            const bsModal = bootstrap.Modal.getInstance(modal);
            bsModal.hide();
        })
        .catch(error => {
            console.error('Error al eliminar el servicio:', error);
        });
    });
});

function obtenerDetallesServicio() {
    // Obtener el ID del servicio de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const servicioId = urlParams.get('id');

    // Hacer una solicitud GET para obtener los detalles del servicio
    fetch(`http://localhost:3000/Api/Servicios/${servicioId}`)
        .then(response => response.json())
        .then(data => {
            // Rellenar los campos de la tabla con los datos del servicio
            document.getElementById('nombreClase').innerText = data.NombreClase;
            document.getElementById('instructor').innerText = data.Instructor;
            document.getElementById('cantidad').innerText = data.Cantidad;
            document.getElementById('costoTotal').innerText = data.CostoTotal;
            document.getElementById('costoVenta').innerText = data.CostoVenta;
            
            // Convertir el estado de 1 o 0 a "Activo" o "Inactivo"
            const estado = data.Estado === 1 ? 'Activo' : 'Inactivo';
            document.getElementById('estado').innerText = estado;
        })
        .catch(error => console.error('Error al obtener los detalles del servicio:', error));
}

// Función para obtener los detalles del servicio
function obtenerDetallesServicio() {
    // Obtener el ID del servicio de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const servicioId = urlParams.get('id');

    // Hacer una solicitud GET para obtener los detalles del servicio
    fetch(`http://localhost:3000/Api/Servicios/${servicioId}`)
        .then(response => response.json())
        .then(data => {
            // Rellenar los campos de la tabla con los datos del servicio
            document.getElementById('nombreClase').innerText = data.NombreClase;
            document.getElementById('instructor').innerText = data.Instructor;
            document.getElementById('cantidad').innerText = data.Cantidad;
            document.getElementById('costoTotal').innerText = data.CostoTotal;
            document.getElementById('costoVenta').innerText = data.CostoVenta;
            
            // Convertir el estado de 1 o 0 a "Activo" o "Inactivo"
            const estado = data.Estado === 1 ? 'Activo' : 'Inactivo';
            document.getElementById('estado').innerText = estado;
        })
        .catch(error => console.error('Error al obtener los detalles del servicio:', error));
}

// Llamar a la función cuando la página se cargue
window.addEventListener('DOMContentLoaded', obtenerDetallesServicio);
