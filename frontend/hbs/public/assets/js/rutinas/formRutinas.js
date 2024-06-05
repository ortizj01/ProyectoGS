$(document).ready(function() {
    const urlParams = new URLSearchParams(window.location.search);
    const rutinaId = urlParams.get('rutinaId');

    // Función para obtener ejercicios
    function fetchEjercicios(rutinaId, getAll = true) {
        let url = 'http://localhost:3000/api/ejercicios';
        if (rutinaId && !getAll) {
            url = `http://localhost:3000/api/rutinas/${rutinaId}/detallada`;
        }
        return fetch(url)
            .then(response => response.json())
            .catch(error => console.error('Error al obtener ejercicios:', error));
    }

    // Función para obtener usuarios
    function fetchUsuarios() {
        return fetch('http://localhost:3000/api/usuarios')
            .then(response => response.json())
            .catch(error => console.error('Error al obtener usuarios:', error));
    }

    // Poblar el select de usuarios
    function populateUsuarios() {
        fetchUsuarios().then(usuarios => {
            const usuarioSelect = $('#idUsuario');
            usuarios.forEach(usuario => {
                usuarioSelect.append(`<option value="${usuario.IdUsuario}">${usuario.Nombres}</option>`);
            });
        });
    }

    // Llamar a la función para poblar el select de usuarios al cargar la página
    populateUsuarios();

    // Manejo del evento de clic en los botones de día
    $('.day-button').on('click', function() {
        const day = $(this).data('day');
        renderExerciseForm(day);
    });

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
        $('.day-form').hide();

        let form = $(`#form-${day}`);
        if (form.length === 0) {
            const exerciseFormHTML = `
                <form id="form-${day}" class="day-form">
                    <h3 class="text-center">Rutina del ${day.charAt(0).toUpperCase() + day.slice(1)}</h3>
                    <div class="exercise-list"></div>
                    <button type="button" class="btn btn-secondary add-exercise" data-day="${day}">Agregar Ejercicio</button>
                </form>
            `;
            $('.form-container').append(exerciseFormHTML);
        }

        $(`#form-${day}`).show();
    }

    // Manejo del evento de clic en el botón "Agregar Ejercicio"
    $(document).on('click', '.add-exercise', async function() {
        const day = $(this).data('day');
        const exerciseList = $(`#form-${day} .exercise-list`);
        const exerciseCount = exerciseList.children('.exercise-form').length;

        const ejercicios = await fetchEjercicios();

        const newExerciseForm = `
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

        exerciseList.append(newExerciseForm);
    });

    // Manejo del evento de clic en el botón "+" para agregar más campos de ejercicio
    $(document).on('click', '.add-field', function() {
        const day = $(this).data('day');
        const exerciseList = $(`#form-${day} .exercise-list`);
        const exerciseCount = exerciseList.children('.exercise-form').length;

        const lastExerciseForm = exerciseList.children('.exercise-form').last();
        const newExerciseForm = lastExerciseForm.clone();
        const newExerciseFormId = `exercise-${day}-${exerciseCount}`;
        newExerciseForm.find('select').attr('id', newExerciseFormId).val('');

        exerciseList.append(newExerciseForm);
    });

    // Manejo del evento de clic en el botón "-" para quitar campos de ejercicio
    $(document).on('click', '.remove-field', function() {
        $(this).closest('.exercise-form').remove();
    });

    // Cargar datos de la rutina para editar
    function loadRoutineData(rutinaId) {
        fetch(`http://localhost:3000/api/rutinas/${rutinaId}`)
            .then(response => response.json())
            .then(async data => {
                console.log('Datos de la rutina recibidos:', data);

                $('input[name="nombreRutina"]').val(data.NombreRutina);
                $('select[name="idUsuario"]').val(data.IdUsuario);

                // Mostrar el campo de estado solo en la edición
                $('#estadoRutinaContainer').show();
                $('select[name="estadoRutina"]').val(data.EstadoRutina);

                const ejercicios = await fetchEjercicios();

                if (data.Ejercicios !== undefined) {
                    data.Ejercicios.forEach(ejercicio => {
                        const day = Object.keys(diasSemana).find(key => diasSemana[key] === ejercicio.DiaSemana);
                        renderExerciseForm(day);

                        const exerciseList = $(`#form-${day} .exercise-list`);
                        const exerciseCount = exerciseList.children('.exercise-form').length;

                        const optionsHTML = ejercicios.map(e => `<option value="${e.IdEjercicio}" ${e.IdEjercicio === ejercicio.IdEjercicio ? 'selected' : ''}>${e.NombreEjercicio}</option>`).join('');

                        const newExerciseForm = `
                            <div class="exercise-form">
                                <div class="form-group row">
                                    <div class="col">
                                        <label for="exercise-${day}-${exerciseCount}">Ejercicio</label>
                                        <select class="form-control" id="exercise-${day}-${exerciseCount}">
                                            <option value="">Seleccione un ejercicio</option>
                                            ${optionsHTML}
                                        </select>
                                    </div>
                                    <div class="col-auto mt-4">
                                        <button type="button" class="btn btn-success btn-sm add-field" data-day="${day}">+</button>
                                        <button type="button" class="btn btn-danger btn-sm remove-field">-</button>
                                    </div>
                                </div>
                            </div>
                        `;

                        exerciseList.append(newExerciseForm);
                    });
                }
            })
            .catch(error => console.error('Error al obtener la rutina:', error));
    }

    if (rutinaId) {
        loadRoutineData(rutinaId);
    }

    // Manejo del envío del formulario
$('#formularioRegistro').on('submit', function(e) {
    e.preventDefault();

    const nombreRutina = $('input[name="nombreRutina"]').val();
    const idUsuario = $('select[name="idUsuario"]').val();

    const rutinaData = {
        NombreRutina: nombreRutina,
        EstadoRutina: 1,
        IdUsuario: idUsuario
    };

    const method = rutinaId ? 'PUT' : 'POST';
    const endpoint = rutinaId ? `http://localhost:3000/api/rutinas/${rutinaId}` : 'http://localhost:3000/api/rutinas';

     // Solo agregar el estado de la rutina si se está editando
     if (rutinaId) {
        const estadoRutina = $('select[name="estadoRutina"]').val();
        rutinaData['EstadoRutina'] = estadoRutina;
    }

    fetch(endpoint, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(rutinaData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        const newRutinaId = data.id || rutinaId;
        const promises = [];

        const addedExercises = {};

        Object.keys(diasSemana).forEach(day => {
            const dayNumber = diasSemana[day];
            const exerciseList = $(`#form-${day} .exercise-form`);

            exerciseList.each(function() {
                const ejercicioId = $(this).find('select').val();
                if (ejercicioId) {
                    if (!addedExercises[dayNumber]) {
                        addedExercises[dayNumber] = new Set();
                    }
                    if (!addedExercises[dayNumber].has(ejercicioId)) {
                        const promise = fetch(`http://localhost:3000/api/rutinas/${newRutinaId}/ejercicios`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ IdEjercicio: ejercicioId })
                        })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error(`HTTP error! status: ${response.status}`);
                            }
                            return response.json();
                        })
                        .then(data => {
                            const detallePromise = fetch(`http://localhost:3000/api/rutinas/${newRutinaId}/ejercicios/${data.id}/detalles`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({ DiaSemana: dayNumber })
                            });

                            promises.push(detallePromise);
                            addedExercises[dayNumber].add(ejercicioId);
                        });

                        promises.push(promise);
                    }
                }
            });
        });

        return Promise.all(promises);
    })
    .then(() => {
        alert('Rutina guardada exitosamente.');
        window.location.href = '/rutinas'; // Redirigir a la página de rutinas
    })
    .catch(error => {
        console.error('Error al guardar la rutina:', error);
        alert('Ocurrió un error al guardar la rutina.');
    });
});

    
});
