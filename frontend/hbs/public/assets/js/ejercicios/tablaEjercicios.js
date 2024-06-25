const url = 'http://localhost:3000/api/ejercicios';
let editingMode = false; // Variable para controlar si se está editando o creando

// Función para listar ejercicios en la tabla
const listarEjercicios = async () => {
    let ObjectId = document.getElementById('contenidoEjercicios'); // Cambio aquí
    let contenido = '';

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
        data.forEach(ejercicio => {
            if (ejercicio.NombreEjercicio && ejercicio.DescripcionEjercicio && ejercicio.RepeticionesEjercicio !== undefined) {
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
            } else {
                console.error('Formato de datos incorrecto', ejercicio);
            }
        });

        ObjectId.innerHTML = contenido;

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

// Función para abrir el modal para editar un ejercicio existente
const editarEjercicio = async (ejercicioId) => {
    try {
        const response = await fetch(`${url}/${ejercicioId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error en la solicitud: ' + response.statusText);
        }

        const ejercicio = await response.json();

        // Llenar los campos del formulario con los datos del ejercicio
        document.querySelector('[name="nombreEjercicio"]').value = ejercicio.NombreEjercicio || '';
        document.querySelector('[name="descripcionEjercicio"]').value = ejercicio.DescripcionEjercicio || '';
        document.querySelector('[name="repeticiones"]').value = ejercicio.RepeticionesEjercicio || '';
        document.querySelector('[name="estado"]').value = ejercicio.EstadoEjercicio || '';

        // Mostrar el modal en modo edición
        const modalTitle = document.getElementById('modalTitle');
        modalTitle.textContent = 'Editar Ejercicio';
        document.getElementById('ejercicioId').value = ejercicio.IdEjercicio;
        editingMode = true;

        // Asegura que el campo Estado esté visible al editar
        document.querySelector('[name="estado"]').parentNode.parentNode.style.display = 'block';

        $('#registroModal').modal('show');

    } catch (error) {
        console.error('Error:', error);
    }
};

// Función para manejar el envío del formulario para crear/editar ejercicios
const enviarFormulario = async (event) => {
    event.preventDefault();

    const nombreEjercicio = document.querySelector('[name="nombreEjercicio"]').value;
    const descripcionEjercicio = document.querySelector('[name="descripcionEjercicio"]').value;
    const repeticiones = document.querySelector('[name="repeticiones"]').value;
    const estado = document.querySelector('[name="estado"]').value;

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

// Evento cuando el DOM se carga completamente
document.addEventListener('DOMContentLoaded', () => {
    listarEjercicios();

    // Evento para abrir el modal de creación de ejercicio
    document.getElementById('crearEjercicioBtn').addEventListener('click', abrirModalCrearEjercicio);

    // Evento para enviar el formulario de registro/edición
    document.getElementById('formularioRegistro').addEventListener('submit', enviarFormulario);
});

