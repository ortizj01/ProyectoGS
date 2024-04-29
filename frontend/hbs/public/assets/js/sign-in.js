const validarDatos = () => {
    let user = document.querySelector('#email').value;
    let password = document.querySelector('#password').value;

    let usuario = "juanortiz@gmail.com";
    let contrasena = "12345678";
    let encontrado = false;

    if (user === usuario && password === contrasena) {
        encontrado = true;
    }

    return new Promise((resolve, reject) => {
        if (encontrado) {
            resolve('Bienvenido al sistema');
        } else {
            reject('Datos incorrectos');
        }
    });
};

document.querySelector('#btnEnviarDatos').addEventListener('click', () => {
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const emailInput = document.querySelector('#email');
    const passwordInput = document.querySelector('#password');

    const user = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const usuario = "juanortiz@gmail.com";
    const contrasena = "12345678";

    if (user === '' || password === '') {
        if (user === '') {
            emailError.textContent = 'Ingrese un correo';
        } else {
            emailError.textContent = '';
        }

        if (password === '') {
            passwordError.textContent = 'Ingrese una contraseña';
        } else {
            passwordError.textContent = '';
        }
    } else {
        validarDatos()
            .then(mensaje => {
                emailError.textContent = '';
                passwordError.textContent = '';

                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Your work has been saved",
                    showConfirmButton: false,
                    timer: 1500
                  });
                window.location.href = '/'; // Redirige al usuario al inicio de la página
                
            })
            .catch(error => {
                if (error === 'Datos incorrectos') {
                    if (user === usuario && password !== contrasena) {
                        passwordError.textContent = 'Contraseña incorrecta';
                        emailError.textContent = '';
                    } else if (user !== usuario) {
                        emailError.textContent = 'Correo incorrecto';
                        passwordError.textContent = '';
                    }
                } else {
                    emailError.textContent = '';
                    passwordError.textContent = '';
                }
            });
    }
});




