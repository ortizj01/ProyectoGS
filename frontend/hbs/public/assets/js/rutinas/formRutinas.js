$(document).ready(function() {
    // Obtener y poblar los ejercicios en el select
    function fetchEjercicios() {
        // Realiza una solicitud GET a la API para obtener la lista de ejercicios
        return fetch('http://localhost:3000/api/ejercicios')
            .then(response => response.json())
            .then(data => data)
            .catch(error => console.error('Error al obtener ejercicios:', error));
    }

    // Obtener y poblar los usuarios en el select
    function fetchUsuarios() {
        // Realiza una solicitud GET a la API para obtener la lista de usuarios
        return fetch('http://localhost:3000/api/usuarios')
            .then(response => response.json())
            .then(data => data)
            .catch(error => console.error('Error al obtener usuarios:', error));
    }

    // Poblar el select de usuarios
    function populateUsuarios() {
        // Llama a fetchUsuarios y llena el select de usuarios con los datos obtenidos
        fetchUsuarios().then(usuarios => {
            var usuarioSelect = $('#idUsuario');
            usuarios.forEach(usuario => {
                usuarioSelect.append(`<option value="${usuario.IdUsuario}">${usuario.Nombres}</option>`);
            });
        });
    }

    // Llamar a la función para poblar el select de usuarios al cargar la página
    populateUsuarios();

    // Manejo del evento de clic en los botones de día
    $('.day-button').on('click', function() {
        var day = $(this).data('day');
        renderExerciseForm(day);
    });

    // Mapeo de los días de la semana a sus respectivos números
    const diasSemana = {
        lunes: 1,
        martes: 2,
        miercoles: 3,
        jueves: 4,
        viernes: 5,
        sabado: 6,
        domingo: 7
    };

    // Función para renderizar el formulario de ejercicios
    function renderExerciseForm(day) {
        // Oculta todos los formularios de días
        $('.day-form').hide();

        // Verifica si el formulario para el día especificado ya existe
        var form = $('#form-' + day);
        if (form.length === 0) {
            // Si no existe, crea el formulario para el día especificado
            var exerciseFormHTML = `
                <form id="form-${day}" class="day-form">
                    <h3 class="text-center">Rutina del ${day.charAt(0).toUpperCase() + day.slice(1)}</h3>
                    <div class="exercise-list"></div>
                    <button type="button" class="btn btn-secondary add-exercise" data-day="${day}">Agregar Ejercicio</button>
                </form>
            `;
            $('.form-container').append(exerciseFormHTML);
        }

        // Muestra el formulario para el día especificado
        $('#form-' + day).show();
    }

    // Manejo del evento de clic en el botón "Agregar Ejercicio"
    $(document).on('click', '.add-exercise', async function() {
        var day = $(this).data('day');
        var exerciseList = $('#form-' + day + ' .exercise-list');
        var exerciseCount = exerciseList.children('.exercise-form').length;

        // Obtiene la lista de ejercicios
        var ejercicios = await fetchEjercicios();

        // Crea un nuevo formulario de ejercicio con los ejercicios disponibles
        var newExerciseForm = `
            <div class="exercise-form">
                <div class="form-group row">
                    <div class="col">
                        <label for="exercise-${day}-${exerciseCount}">Ejercicio</label>
                        <select class="form-control" id="exercise-${day}-${exerciseCount}">
                            <option value="">Seleccione un ejercicio</option>
                            ${ejercicios.map(ejercicio => `<option value="${ejercicio.IdEjercicio}">${ejercicio.NombreEjercicio}</option>`).join('')}
                        </select>
                    </div>
                    <div class="col-auto mt-4">
                        <button type="button" class="btn btn-success btn-sm add-field" data-day="${day}">+</button>
                        <button type="button" class="btn btn-danger btn-sm remove-field">-</button>
                    </div>
                </div>
            </div>
        `;

        // Añade el nuevo formulario de ejercicio a la lista de ejercicios del día
        exerciseList.append(newExerciseForm);
    });

    // Manejo del evento de clic en el botón "+" para agregar más campos de ejercicio
    $(document).on('click', '.add-field', function() {
        var day = $(this).data('day');
        var exerciseList = $('#form-' + day + ' .exercise-list');
        var exerciseCount = exerciseList.children('.exercise-form').length;

        // Clona el último formulario de ejercicio y lo añade a la lista
        var lastExerciseForm = exerciseList.children('.exercise-form').last();
        var newExerciseForm = lastExerciseForm.clone();
        var newExerciseFormId = 'exercise-' + day + '-' + exerciseCount;
        newExerciseForm.find('select').attr('id', newExerciseFormId);
        newExerciseForm.find('select').val('');

        // Añade el nuevo formulario clonado a la lista de ejercicios del día
        exerciseList.append(newExerciseForm);
    });

    // Manejo del evento de clic en el botón "-" para quitar campos de ejercicio
    $(document).on('click', '.remove-field', function() {
        var exerciseForm = $(this).closest('.exercise-form');
        exerciseForm.remove();
    });

    // Manejo del envío del formulario
    $('#formularioRegistro').on('submit', function(e) {
        e.preventDefault();

        // Obtiene los datos del formulario principal
        var nombreRutina = $('input[name="nombreRutina"]').val();
        var idUsuario = $('select[name="idUsuario"]').val();

        var rutinaData = {
            NombreRutina: nombreRutina,
            EstadoRutina: 1,
            IdUsuario: idUsuario
        };

        // Envía una solicitud POST para crear una nueva rutina
        fetch('http://localhost:3000/api/rutinas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(rutinaData)
        })
        .then(response => response.json())
        .then(data => {
            var newRutinaId = data.id;

            var promises = [];
            // Recorre cada formulario de día para agregar los ejercicios
            $('.day-form').each(function() {
                var day = $(this).attr('id').split('-')[1];
                var dayNumber = diasSemana[day];
                var exerciseForms = $(this).find('.exercise-form');

                // Recorre cada formulario de ejercicio y lo añade a la rutina
                exerciseForms.each(function() {
                    var ejercicioId = $(this).find('select').val();
                    if (ejercicioId) {
                        var promise = fetch(`http://localhost:3000/api/rutinas/${newRutinaId}/ejercicios`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ IdEjercicio: ejercicioId })
                        })
                        .then(response => response.json())
                        .then(data => {
                            // Añade el ejercicio a un día específico de la semana
                            return fetch(`http://localhost:3000/api/rutinas/${newRutinaId}/ejercicios/${data.id}/detalles`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({ DiaSemana: dayNumber })
                            });
                        });
                        promises.push(promise);
                    }
                });
            });

            // Espera a que todas las promesas se resuelvan
            return Promise.all(promises);
        })
        .then(() => {
            alert('Rutina creada exitosamente');
            $('#formularioRegistro')[0].reset();
            $('.day-form').remove();

            window.location.href = '/rutinas';

        })
        .catch(error => console.error('Error:', error));
    });
});
