const url = 'http://localhost:3000/api/ejercicios';
let editingMode = false;

// Función para listar ejercicios en la tabla
const listarEjercicios = async () => {
    try {
        const response = await fetch(url, {
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
        let contenido = '';

        data.forEach(ejercicio => {
            contenido += `
                <tr>
                    <td>${ejercicio.NombreEjercicio}</td>
                    <td>${ejercicio.DescripcionEjercicio}</td>
                    <td>${ejercicio.RepeticionesEjercicio}</td>
                    <td style="text-align: center;">
                        <div class="centered-container">
                            <div class="edit-icon" onclick="editarEjercicio(${ejercicio.IdEjercicio})">
                                <i class="fa-regular fa-pen-to-square fa-xl me-2"></i>
                            </div>
                        </div>
                    </td>
                </tr>
            `;
        });

        document.getElementById('contenidoEjercicios').innerHTML = contenido;

    } catch (error) {
        console.error('Error:', error);
    }
};

// Función para abrir el modal para editar un ejercicio existente
const editarEjercicio = async (ejercicioId) => {
    try {
        const response = await fetch(`${url}/${ejercicioId}`);

        if (!response.ok) {
            throw new Error('Error en la solicitud: ' + response.statusText);
        }

        const ejercicio = await response.json();
        console.log('Datos del ejercicio:', ejercicio); // Verificar la estructura de datos recibida

        // Llenar los campos del formulario con los datos del ejercicio
        document.querySelector('[name="nombreEjercicio"]').value = ejercicio.ejercicio.NombreEjercicio || '';
        document.querySelector('[name="descripcionEjercicio"]').value = ejercicio.ejercicio.DescripcionEjercicio || '';
        document.querySelector('[name="repeticiones"]').value = ejercicio.ejercicio.RepeticionesEjercicio || '';
        document.querySelector('[name="estado"]').value = ejercicio.ejercicio.EstadoEjercicio || '';

        console.log('Nombre Ejercicio:', ejercicio.ejercicio.NombreEjercicio);
        console.log('Descripción Ejercicio:', ejercicio.ejercicio.DescripcionEjercicio);
        console.log('Repeticiones Ejercicio:', ejercicio.ejercicio.RepeticionesEjercicio);
        console.log('Estado Ejercicio:', ejercicio.ejercicio.EstadoEjercicio);

        // Mostrar el modal en modo edición
        const modalTitle = document.getElementById('modalTitle');
        modalTitle.textContent = 'Editar Ejercicio';
        document.getElementById('ejercicioId').value = ejercicio.ejercicio.IdEjercicio;
        editingMode = true;

        // Asegura que el campo Estado esté visible al editar
        document.querySelector('[name="estado"]').parentNode.parentNode.style.display = 'block';

        // Mostrar el modal
        $('#registroModal').modal('show');

    } catch (error) {
        console.error('Error:', error);
    }
};


// Función para abrir el modal para crear un nuevo ejercicio
const abrirModalCrearEjercicio = () => {
    const modalTitle = document.getElementById('modalTitle');
    modalTitle.textContent = 'Crear Ejercicio';
    document.getElementById('formularioRegistro').reset();
    editingMode = false;

    // Asegura que el campo Estado esté oculto al crear un nuevo ejercicio
    document.querySelector('[name="estado"]').parentNode.parentNode.style.display = 'none';

    $('#registroModal').modal('show');
};

const enviarFormulario = async (event) => {
    event.preventDefault();

    const nombreEjercicio = document.querySelector('[name="nombreEjercicio"]').value;
    const descripcionEjercicio = document.querySelector('[name="descripcionEjercicio"]').value;
    const repeticiones = parseInt(document.querySelector('[name="repeticiones"]').value.trim(), 10); // Convertir a número entero
    const estado = document.querySelector('[name="estado"]').value;

    // Validar que las repeticiones sean un número válido
    if (isNaN(repeticiones)) {
        console.error('Ingrese un número válido para las repeticiones.');
        return; // Salir de la función si las repeticiones no son válidas
    }

    const ejercicioData = {
        NombreEjercicio: nombreEjercicio,
        DescripcionEjercicio: descripcionEjercicio,
        RepeticionesEjercicio: repeticiones,
        EstadoEjercicio: estado
    };

    try {
        let response;
        if (editingMode) {
            const ejercicioId = document.getElementById('ejercicioId').value;
            response = await fetch(`${url}/${ejercicioId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(ejercicioData)
            });
        } else {
            response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(ejercicioData)
            });
        }

        if (!response.ok) {
            throw new Error('Error en la solicitud: ' + response.statusText);
        }

        const result = await response.json();
        console.log('Resultado:', result);

        // Cerrar el modal después de enviar el formulario
        $('#registroModal').modal('hide');

        // Actualizar la lista de ejercicios
        listarEjercicios();

    } catch (error) {
        console.error('Error:', error);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    listarEjercicios();

    // Evento para abrir el modal de creación de ejercicio
    const crearEjercicioBtn = document.querySelector('[data-bs-target="#registroModal"]');
    crearEjercicioBtn.addEventListener('click', abrirModalCrearEjercicio);

    // Evento para enviar el formulario de registro/edición
    document.getElementById('formularioRegistro').addEventListener('submit', enviarFormulario);
});
