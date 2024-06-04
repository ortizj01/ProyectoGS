const url = 'http://localhost:3000/api/ejercicios';

const listarEjercicios = async () => {
    let ObjectId = document.getElementById('contenidoEjercicios');
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
                                <i class="fa-regular fa-pen-to-square fa-xl me-2"
                                    data-bs-toggle="modal"
                                    data-bs-target="#editarClienteModal"></i>
                                <i class="fa-regular fa-eye fa-xl me-2"></i>
                            <div class="wrap-toggle" style="margin-top:10px;">
                                <input type="checkbox" id="toggle3" class="offscreen" />
                                    <label for="toggle3" class="switch"></label>
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

// Asegúrate de llamar a listarEjercicios cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', listarEjercicios);

// Función para manejar el envío del formulario
const enviarFormulario = async (event) => {
    event.preventDefault();

    const nombreEjercicio = document.querySelector('[name="nombreEjercicio"]').value;
    const descripcionEjercicio = document.querySelector('[name="descripcionEjercicio"]').value;
    const repeticiones = document.querySelector('[name="repeticiones"]').value;

    const nuevoEjercicio = {
        NombreEjercicio: nombreEjercicio,
        DescripcionEjercicio: descripcionEjercicio,
        RepeticionesEjercicio: repeticiones,
        EstadoEjercicio: 1
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            mode: 'cors',
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            },
            body: JSON.stringify(nuevoEjercicio)
        });

        if (!response.ok) {
            throw new Error('Error en la solicitud: ' + response.statusText);
        }

        const result = await response.text();
        console.log('Resultado:', result);

        // Recargar la lista de ejercicios después de agregar uno nuevo
        listarEjercicios();

    } catch (error) {
        console.error('Error:', error);
    }
};

// Añadir el evento al formulario
const formulario = document.getElementById('formularioRegistro');
formulario.addEventListener('submit', enviarFormulario);
