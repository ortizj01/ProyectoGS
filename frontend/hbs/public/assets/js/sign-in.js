const apiUrl = 'http://localhost:3000/api/auth/login';

function handleLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    console.log('Datos enviados:', { Correo: email, Contrasena: password });

    // Limpiar mensajes de error anteriores
    document.getElementById('emailError').innerText = '';
    document.getElementById('passwordError').innerText = '';
    document.getElementById('loginError').innerText = '';

    // Validaciones básicas
    if (!email) {
        document.getElementById('emailError').innerText = 'El correo es requerido';
        return;
    }
    if (!password) {
        document.getElementById('passwordError').innerText = 'La contraseña es requerida';
        return;
    }

    // Realizar la solicitud de inicio de sesión a la API
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ Correo: email, Contrasena: password })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la solicitud');
        }
        return response.json();
    })
    .then(data => {
        console.log('Respuesta del servidor:', data);
        if (data.token) {

            localStorage.setItem('token', data.token); // Guardar el token en localStorage
            window.location.href = '/dashboard'; // Redirigir al dashboard
        } else {
            document.getElementById('loginError').innerText = data.msg || 'Error al iniciar sesión';
        }
    })
    .catch(error => {
        console.error('Error al conectar con el servidor:', error);
        document.getElementById('loginError').innerText = 'Error al conectar con el servidor';
    });
}

// Función para cargar eventos protegidos
function cargarEventosProtegidos() {
    // Recuperar el token del localStorage
    const token = localStorage.getItem('authToken');

    if (token) {
        fetch('http://localhost:8086/eventos', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la solicitud');
            }
            return response.json();
        })
        .then(data => {
            console.log('Respuesta del servidor:', data);
            // Aquí puedes manejar la respuesta como sea necesario
        })
        .catch(error => console.error('Error:', error));
    } else {
        console.log('No hay token disponible');
        // Aquí puedes manejar el caso de que no haya token disponible, por ejemplo, redirigir a la página de inicio de sesión
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const togglePassword = document.getElementById('togglePassword');
    const password = document.getElementById('password');

    togglePassword.addEventListener('click', function() {
        // Alternar el tipo de entrada entre 'password' y 'text'
        const type = password.type === 'password' ? 'text' : 'password';
        password.type = type;

        // Alternar el ícono entre 'eye' y 'eye-slash'
        this.classList.toggle('fa-eye');
        this.classList.toggle('fa-eye-slash');
    });
});

