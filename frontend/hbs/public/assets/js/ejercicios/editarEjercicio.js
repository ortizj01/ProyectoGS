const url = 'http://localhost:3000/api/ejercicios';

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const ejercicioId = urlParams.get('id');

    if (ejercicioId) {
        try {
            const response = await fetch(`${url}/${ejercicioId}`, {
                method: 'GET',
                mode: 'cors',
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            });

            if (!response.ok) {
                throw new Error('Error en la solicitud: ' + response.statusText);
            }

            const ejercicio = await response.json();

            // Establecer los valores de los campos del formulario
            document.querySelector('[name="nombreEjercicio"]').value = ejercicio.NombreEjercicio;
            document.querySelector('[name="descripcionEjercicio"]').value = ejercicio.DescripcionEjercicio;
            document.querySelector('[name="repeticiones"]').value = ejercicio.RepeticionesEjercicio;
            document.getElementById('ejercicioId').value = ejercicio.IdEjercicio;
            document.querySelector('[name="estado"]').value = ejercicio.EstadoEjercicio; // Esto establece el estado actual del ejercicio en el campo de selección de estado

        } catch (error) {
            console.error('Error:', error);
        }
    }

    const formulario = document.getElementById('formularioRegistro');
    formulario.addEventListener('submit', async (event) => {
        event.preventDefault();

        const nombreEjercicio = document.querySelector('[name="nombreEjercicio"]').value;
        const descripcionEjercicio = document.querySelector('[name="descripcionEjercicio"]').value;
        const repeticiones = document.querySelector('[name="repeticiones"]').value;
        const ejercicioId = document.getElementById('ejercicioId').value;
        const estado = document.querySelector('[name="estado"]').value; // Aquí obtienes el valor seleccionado del campo de selección de estado

        const ejercicioActualizado = {
            NombreEjercicio: nombreEjercicio,
            DescripcionEjercicio: descripcionEjercicio,
            RepeticionesEjercicio: repeticiones,
            EstadoEjercicio: estado // Aquí asignas el valor seleccionado del campo de selección de estado al objeto ejercicioActualizado
        };

        try {
            const response = await fetch(`${url}/${ejercicioId}`, {
                method: 'PUT',
                mode: 'cors',
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                },
                body: JSON.stringify(ejercicioActualizado)
            });

            if (!response.ok) {
                throw new Error('Error en la solicitud: ' + response.statusText);
            }

            const result = await response.text();
            console.log('Resultado:', result);

            // Redirigir a la lista de ejercicios después de actualizar
            window.location.href = 'ejercicios';

        } catch (error) {
            console.error('Error:', error);
        }
    });
});
