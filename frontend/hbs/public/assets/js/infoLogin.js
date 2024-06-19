// Función para obtener y mostrar información del usuario
function mostrarInformacionUsuario() {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('No token found in localStorage');
        return;
    }

    fetch('http://localhost:3000/api/auth/usuario-autenticado', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-token': token
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Hubo un problema al obtener la información del usuario.');
        }
        return response.json();
    })
    .then(data => {
        console.log('Datos del usuario recibidos:', data); // Verificar los datos recibidos

        // Actualizar el nombre y el rol del usuario en la topbar (como se hace actualmente)
        if (document.getElementById('userName')) {
            document.getElementById('userName').textContent = data.Nombres || '';
        }
        if (document.getElementById('userRole')) {
            document.getElementById('userRole').textContent = data.Rol || '';
        }

        // Llenar el formulario con los datos del usuario
        llenarFormularioUsuario(data);
    })
    .catch(error => {
        console.error('Error al obtener información del usuario:', error);
    });
}

// Función para llenar el formulario con la información del usuario
function llenarFormularioUsuario(data) {
    console.log('Llenando el formulario con los siguientes datos:', data);

    // Llenar los campos del formulario con los datos del usuario
    if (document.getElementById('Nombres')) {
        document.getElementById('Nombres').value = data.Nombres || '';
    }
    if (document.getElementById('Apellidos')) {
        document.getElementById('Apellidos').value = data.Apellidos || '';
    }
    if (document.getElementById('Correo')) {
        document.getElementById('Correo').value = data.Correo || '';
    }
    if (document.getElementById('Telefono')) {
        document.getElementById('Telefono').value = data.Telefono || '';
    }
    if (document.getElementById('Documento')) {
        document.getElementById('Documento').value = data.Documento || ''; // Asegúrate de que esta clave coincide con los datos devueltos
    }

    // Manejo especial para la fecha de nacimiento (si se tiene disponible en el formato correcto)
    if (data.FechaDeNacimiento) {
        const fechaNacimiento = new Date(data.FechaDeNacimiento);
        const fechaFormateada = fechaNacimiento.toISOString().split('T')[0];
        if (document.getElementById('FechaDeNacimiento')) {
            document.getElementById('FechaDeNacimiento').value = fechaFormateada;
        }
    }

    if (document.getElementById('Direccion')) {
        document.getElementById('Direccion').value = data.Direccion || '';
    }

    // Seleccionar el género en el formulario
    if (data.Genero && document.getElementById('Genero')) {
        document.getElementById('Genero').value = data.Genero;
    }
}

// Llamar a la función al cargar el DOM
document.addEventListener('DOMContentLoaded', function() {
    mostrarInformacionUsuario();
});

// Función para cerrar sesión
async function cerrarSesion() {
    const token = localStorage.getItem('token'); // Asumiendo que el token está almacenado en localStorage
    if (!token) {
        console.error('No token found');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/auth/logout', { 
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Logout successful:', data);
        localStorage.removeItem('token'); // Elimina el token del almacenamiento local

        window.location.href = '/ingresar';
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
    }
}

if (document.getElementById('logoutButton')) {
    document.getElementById('logoutButton').addEventListener('click', cerrarSesion);
}
