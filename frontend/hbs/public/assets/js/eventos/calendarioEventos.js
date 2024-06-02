document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar1');
    if (calendarEl) {
        var calendar = new FullCalendar.Calendar(calendarEl, {
            locale: 'es', // Configura el idioma a español
            initialView: 'dayGridMonth',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
            },
            events: [
                // Aquí puedes agregar tus eventos
                {
                    title: 'Evento 1',
                    start: '2024-05-20'
                },
                {
                    title: 'Evento 2',
                    start: '2024-05-22',
                    end: '2024-05-24'
                }
            ]
        });
        calendar.render();
    } else {
        console.error('Elemento con ID "calendar1" no encontrado.');
    }
});
