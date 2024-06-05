document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('formularioUsuarios');
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Evita el envío del formulario por defecto

        // Obtener los datos del formulario
        const formData = new FormData(form);

        // Convertir FormData a objeto JSON
        const jsonObject = {};
        formData.forEach(function(value, key) {
            jsonObject[key] = value;
        });

        // Enviar los datos a tu API
        fetch('http://localhost:3000/api/Usuarioss', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jsonObject)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Hubo un problema al enviar los datos.');
            }
            return response.json();
        })
        .then(data => {
            // Aquí puedes manejar la respuesta de tu API
            console.log(data);
            alert('Los datos se han enviado correctamente.');
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Hubo un problema al enviar los datos. Por favor, inténtalo de nuevo.');
        });
    });
});
// Obtener el ID del usuario de la URL (si lo pasaste como parámetro)
const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('id');

// Hacer una solicitud al servidor para obtener los detalles del usuario