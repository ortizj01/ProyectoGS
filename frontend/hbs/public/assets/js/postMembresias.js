document.addEventListener('DOMContentLoaded', () => {
    // URL del endpoint de membresías en tu servidor
    const url = 'http://localhost:3000/Api/Membresias';

    // Realizar la solicitud GET utilizando fetch
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json(); // Parsear la respuesta a JSON
        })
        .then(data => {
            // Aquí puedes procesar los datos recibidos y mostrarlos en tu página HTML
            console.log('Datos recibidos:', data);

            // Obtener el cuerpo de la tabla donde se mostrarán las membresías
            const tableBody = document.getElementById('membresiasTableBody');

            // Limpiar el contenido actual de la tabla si es necesario
            tableBody.innerHTML = '';

            // Iterar sobre los datos y crear filas de tabla para cada membresía
            data.forEach(membresia => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${membresia.NombreMembresia}</td>
                    <td>${membresia.Frecuencia}</td>
                    <td>${membresia.Precio}</td>
                    <td>${membresia.Estado}</td>
                    <td>
                        <div class="centered-container">
                            <a href="detalleMembresia"><i class="fa-regular fa-eye fa-xl me-2"></i></a>
                            <a href="formMembresiaModal"><i class="fa-regular fa-pen-to-square fa-xl me-2"></i></a>
                            <i class="fa-solid fa-trash fa-xl me-2" data-bs-toggle="modal" data-bs-target="#eliminarMembresiaModal" data-id="${membresia.id}"></i>
                        </div>
                    </td>
                `;
                tableBody.appendChild(row);

                // Agregar evento al botón de eliminar para mostrar modal de confirmación
                const eliminarBtn = row.querySelector('.fa-trash');
                eliminarBtn.addEventListener('click', () => {
                    const membresiaId = eliminarBtn.getAttribute('data-id');
                    console.log('Eliminar membresía con ID:', membresiaId);
                    // Asignar el ID de la membresía al formulario de confirmación
                    document.getElementById('eliminarMembresiaForm').setAttribute('data-id', membresiaId);
                });
            });
        })
        .catch(error => {
            console.error('Error al obtener los datos:', error);
        });

    // Manejar la confirmación de eliminar
    const eliminarMembresiaForm = document.getElementById('eliminarMembresiaForm');
    eliminarMembresiaForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const membresiaId = eliminarMembresiaForm.getAttribute('data-id');
        console.log('Confirmar eliminar membresía con ID:', membresiaId);
        // Aquí puedes agregar lógica para enviar la solicitud DELETE al servidor
        // por ejemplo, utilizando fetch o axios
        // Una vez eliminada, puedes recargar la tabla o actualizar los datos según sea necesario
        // Por ahora, simplemente cierro el modal
        const modal = document.getElementById('eliminarMembresiaModal');
        const bsModal = bootstrap.Modal.getInstance(modal);
        bsModal.hide(); // Cerrar el modal de confirmación
    });
});
