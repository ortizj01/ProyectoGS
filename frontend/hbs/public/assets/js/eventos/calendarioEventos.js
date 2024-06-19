document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar1');

    if (calendarEl) {
        var calendar = new FullCalendar.Calendar(calendarEl, {
            locale: 'es',
            initialView: 'dayGridMonth',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
            },
            timeZone: 'local',
            eventTimeFormat: {
                hour: '2-digit',
                minute: '2-digit',
                meridiem: false
            },
            events: function(fetchInfo, successCallback, failureCallback) {
                // Cargar eventos desde la API
                fetch('http://localhost:3000/api/eventos')
                    .then(response => response.json())
                    .then(data => {
                        var eventos = data.map(evento => ({
                            id: evento.id,
                            title: evento.title,
                            start: evento.start,
                            end: evento.end,
                            description: evento.description,
                            serviceId: evento.serviceId,
                            employeeId: evento.employeeId,
                            isActive: evento.isActive
                        }));
                        successCallback(eventos);
                    })
                    .catch(error => {
                        console.error('Error al cargar los eventos:', error);
                        failureCallback(error);
                    });
            },
            dateClick: function(info) {
                // Mostrar modal para crear un nuevo evento
                var modal = new bootstrap.Modal(document.getElementById('eventModal'));
                document.getElementById('eventId').value = ''; // Limpiar ID del evento (nuevo evento)
                document.getElementById('serviceSelect').value = ''; // Limpiar servicio seleccionado
                document.getElementById('employeeSelect').value = ''; // Limpiar empleado seleccionado
                document.getElementById('startDate').value = info.dateStr; // Asignar fecha seleccionada
                document.getElementById('endDate').value = info.dateStr; // Asignar fecha seleccionada
                document.getElementById('startTime').value = ''; // Limpiar hora de inicio
                document.getElementById('endTime').value = ''; // Limpiar hora de fin
                document.getElementById('description').value = ''; // Limpiar descripción
                document.getElementById('isActive').checked = false; // Desmarcar isActive
                document.getElementById('isActive').style.display = 'none'; // Ocultar campo EstadoAgenda
                loadSelectOptionsAndShowModal(modal); // Cargar opciones de select y luego mostrar el modal
            },
            eventClick: function(info) {
                // Mostrar modal para editar un evento existente
                var modal = new bootstrap.Modal(document.getElementById('eventModal'));
                document.getElementById('eventId').value = info.event.id;
                document.getElementById('startDate').value = info.event.startStr.slice(0, 10); // Asignar fecha (YYYY-MM-DD)
                document.getElementById('endDate').value = info.event.endStr.slice(0, 10); // Asignar fecha (YYYY-MM-DD)
                document.getElementById('startTime').value = info.event.startStr.slice(11, 16); // Asignar hora (HH:mm)
                document.getElementById('endTime').value = info.event.endStr.slice(11, 16); // Asignar hora (HH:mm)
                document.getElementById('description').value = info.event.extendedProps.description;
                document.getElementById('isActive').checked = info.event.extendedProps.isActive; // Usar checkbox para isActive
                document.getElementById('isActive').style.display = 'block'; // Mostrar campo EstadoAgenda
                loadSelectOptionsAndShowModal(modal, info); // Cargar opciones de select y luego mostrar el modal
            },
            datesSet: function() {
                console.log('Calendario completamente renderizado. Puedes interactuar con los eventos.');
            }
        });

        calendar.render();

        // Lógica para guardar un evento (nuevo o editado)
        document.getElementById('saveEventButton').addEventListener('click', function() {
            var eventId = document.getElementById('eventId').value;
            var title = document.getElementById('serviceSelect').value;
            var employee = document.getElementById('employeeSelect').value;
            var startDate = document.getElementById('startDate').value;
            var endDate = document.getElementById('endDate').value;
            var startTime = document.getElementById('startTime').value;
            var endTime = document.getElementById('endTime').value;
            var description = document.getElementById('description').value;
            var isActive = document.getElementById('isActive').checked; // Usar checked para obtener el estado

            // Validación básica
            if (!title) {
                alert('Por favor seleccione un servicio.');
                return;
            }

            if (!employee) {
                alert('Por favor seleccione un empleado.');
                return;
            }

            // Formato ISO 8601 para FechaInicio y FechaFin combinado con HoraInicio y HoraFin
            var startDateTime = startDate ? new Date(`${startDate}T${startTime}`) : null;
            var endDateTime = endDate ? new Date(`${endDate}T${endTime}`) : null;

            var eventData = {
                IdServicio: parseInt(title),
                IdUsuario: parseInt(employee),
                FechaInicio: startDateTime ? startDateTime.toISOString().slice(0, 19).replace('T', ' ') : null, // Formato YYYY-MM-DD HH:mm:ss
                FechaFin: endDateTime ? endDateTime.toISOString().slice(0, 19).replace('T', ' ') : null,     // Formato YYYY-MM-DD HH:mm:ss
                HoraInicio: startTime,
                HoraFin: endTime,
                DescripcionEvento: description,
                EstadoAgenda: isActive ? 1 : 0
            };

            var url = eventId ? `http://localhost:3000/api/eventos/${eventId}` : 'http://localhost:3000/api/eventos';
            var method = eventId ? 'PUT' : 'POST';

            // Enviar solicitud al servidor
            fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(eventData)
            })
            .then(response => response.json())
            .then(data => {
                console.log('Respuesta del servidor:', data);

                if (eventId) {
                    // Actualizar evento existente en el calendario
                    var existingEvent = calendar.getEventById(eventId);
                    if (existingEvent) {
                        existingEvent.setProp('title', data.title);
                        existingEvent.setStart(new Date(data.FechaInicio));
                        existingEvent.setEnd(new Date(data.FechaFin));
                        existingEvent.setExtendedProp('description', data.DescripcionEvento);
                        existingEvent.setExtendedProp('isActive', data.EstadoAgenda === 1 ? true : false);
                        existingEvent.setExtendedProp('serviceId', data.IdServicio);
                        existingEvent.setExtendedProp('employeeId', data.IdUsuario);
                    }
                } else {
                    // Agregar nuevo evento al calendario
                    calendar.addEvent({
                        id: data.id,
                        title: data.title,
                        start: new Date(data.FechaInicio),
                        end: new Date(data.FechaFin),
                        description: data.DescripcionEvento,
                        isActive: data.EstadoAgenda === 1 ? true : false,
                        serviceId: data.IdServicio,
                        employeeId: data.IdUsuario
                    });
                }

                var modal = bootstrap.Modal.getInstance(document.getElementById('eventModal'));
                modal.hide();
            })
            .catch(error => {
                console.error('Error al guardar el evento:', error);
            });
        });

        // Función para cargar opciones del select y luego mostrar el modal
        function loadSelectOptionsAndShowModal(modal, info) {
            loadSelectOptions().then(() => {
                if (info) {
                    document.getElementById('serviceSelect').value = info.event.extendedProps.serviceId;
                    document.getElementById('employeeSelect').value = info.event.extendedProps.employeeId;
                }
                modal.show();
            });
        }

        // Cargar opciones del select para servicios y empleados
        function loadSelectOptions() {
            return Promise.all([
                fetch('http://localhost:3000/api/servicios').then(response => response.json()),
                fetch('http://localhost:3000/api/entrenadores').then(response => response.json())
            ]).then(([servicios, empleados]) => {
                var serviceSelect = document.getElementById('serviceSelect');
                serviceSelect.innerHTML = '<option value="">Seleccione un servicio</option>';
                servicios.forEach(service => {
                    var option = document.createElement('option');
                    option.value = service.IdServicio;
                    option.text = service.NombreClase;
                    serviceSelect.appendChild(option);
                });

                var employeeSelect = document.getElementById('employeeSelect');
                employeeSelect.innerHTML = '<option value="">Seleccione un empleado</option>';
                empleados.forEach(employee => {
                    var option = document.createElement('option');
                    option.value = employee.IdUsuario;
                    option.text = employee.Nombres;
                    employeeSelect.appendChild(option);
                });
            }).catch(error => {
                console.error('Error al cargar opciones de select:', error);
            });
        }
        
    } else {
        console.error('Elemento con ID "calendar1" no encontrado.');
    }
});
