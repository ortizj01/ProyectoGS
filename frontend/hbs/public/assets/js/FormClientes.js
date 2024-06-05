const formularioRegistro = document.getElementById('formularioRegistro');
const inputs = document.querySelectorAll('#formularioRegistro input, #formularioRegistro select');

document.getElementById('togglePassword').addEventListener('click', function() {
    togglePasswordVisibility('password');
});

document.getElementById('toggleConfirmPassword').addEventListener('click', function() {
    togglePasswordVisibility('confirmarPassword');
});

function togglePasswordVisibility(inputId) {
    var passwordInput = document.getElementById(inputId);
    var buttonText = document.getElementById('toggle' + inputId.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase());

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        buttonText.textContent = 'Ocultar';
    } else {
        passwordInput.type = 'password';
        buttonText.textContent = 'Mostrar';
    }
}

const expresiones = {
    nombreCliente: /^[a-zA-ZÀ-ÿ\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
    apellidosCliente: /^[a-zA-ZÀ-ÿ\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
    documentoCliente: /^[a-zA-Z0-9]{7,10}$/,
    correoCliente: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
    direccionCliente: /^[A-Za-z0-9\s#áéíóúÁÉÍÓÚüÜ.,-]+$/,
    telefonoCliente: /^[0-9]{7,10}$/,
    password: /^(?=.*[A-Z])(?=.*\d).{4,12}$/ // Mínimo 4 y máximo 12 caracteres, al menos una letra mayúscula y un número.
};

const campos = {
    nombreCliente: false,
    apellidosCliente: false,
    documentoCliente: false,
    correoCliente: false,
    telefonoCliente: false,
    direccionCliente: false,
    generoCliente: false,
    estadoCliente: false,
    password: false
};

const validarFormulario = (e) => {
    switch (e.target.name) {
        case "nombreCliente":
            validarCampo(expresiones.nombreCliente, e.target, 'nombreCliente');
            break;
        case "apellidosCliente":
            validarCampo(expresiones.apellidosCliente, e.target, 'apellidosCliente');
            break;
        case "documentoCliente":
            validarCampo(expresiones.documentoCliente, e.target, 'documentoCliente');
            break;
        case "correoCliente":
            validarCampo(expresiones.correoCliente, e.target, 'correoCliente');
            break;
        case "telefonoCliente":
            validarCampo(expresiones.telefonoCliente, e.target, 'telefonoCliente');
            break;
        case "direccionCliente":
            validarCampo(expresiones.direccionCliente, e.target, 'direccionCliente');
            break;
        case "generoCliente":
            validarSelect(e.target, 'generoCliente');
            break;
        case "estadoCliente":
            validarSelect(e.target, 'estadoCliente');
            break;
        case "password":
            validarCampo(expresiones.password, e.target, 'password');
            validarPassword2();
            break;
        case "confirmarPassword":
            validarPassword2();
            break;
    }
};

const validarCampo = (expresion, input, campo) => {
    if (expresion.test(input.value)) {
        document.getElementById(`grupo__${campo}`).classList.remove('formularioRegistro__grupo-incorrecto');
        document.getElementById(`grupo__${campo}`).classList.add('formularioRegistro__grupo-correcto');
        document.querySelector(`#grupo__${campo} i`).classList.add('fa-check-circle');
        document.querySelector(`#grupo__${campo} i`).classList.remove('fa-times-circle');
        document.querySelector(`#grupo__${campo} .formularioRegistro__input-error`).classList.remove('formularioRegistro__input-error-activo');
        campos[campo] = true;
    } else {
        document.getElementById(`grupo__${campo}`).classList.add('formularioRegistro__grupo-incorrecto');
        document.getElementById(`grupo__${campo}`).classList.remove('formularioRegistro__grupo-correcto');
        document.querySelector(`#grupo__${campo} i`).classList.remove('fa-check-circle');
        document.querySelector(`#grupo__${campo} i`).classList.add('fa-times-circle');
        document.querySelector(`#grupo__${campo} .formularioRegistro__input-error`).classList.add('formularioRegistro__input-error-activo');
        campos[campo] = false;
    }
};

const validarSelect = (select, campo) => {
    if (select.value !== "") {
        document.getElementById(`grupo__${campo}`).classList.remove('formularioRegistro__grupo-incorrecto');
        document.getElementById(`grupo__${campo}`).classList.add('formularioRegistro__grupo-correcto');
    } else {
        document.getElementById(`grupo__${campo}`).classList.add('formularioRegistro__grupo-incorrecto');
        document.getElementById(`grupo__${campo}`).classList.remove('formularioRegistro__grupo-correcto');
    }
};

const validarPassword2 = () => {
    const inputPassword1 = document.getElementById('password');
    const inputPassword2 = document.getElementById('confirmarPassword');

    if (inputPassword1.value !== inputPassword2.value || inputPassword2.value === '') {
        document.getElementById(`grupo__confirmarPassword`).classList.add('formularioRegistro__grupo-incorrecto');
        document.getElementById(`grupo__confirmarPassword`).classList.remove('formularioRegistro__grupo-correcto');
        document.querySelector(`#grupo__confirmarPassword i`).classList.remove('fa-check-circle');
        document.querySelector(`#grupo__confirmarPassword i`).classList.add('fa-times-circle');
        document.querySelector(`#grupo__confirmarPassword .formularioRegistro__input-error`).classList.add('formularioRegistro__input-error-activo');
        campos['password'] = false;
    } else {
        document.getElementById(`grupo__confirmarPassword`).classList.remove('formularioRegistro__grupo-incorrecto');
        document.getElementById(`grupo__confirmarPassword`).classList.add('formularioRegistro__grupo-correcto');
        document.querySelector(`#grupo__confirmarPassword i`).classList.add('fa-check-circle');
        document.querySelector(`#grupo__confirmarPassword i`).classList.remove('fa-times-circle');
        document.querySelector(`#grupo__confirmarPassword .formularioRegistro__input-error`).classList.remove('formularioRegistro__input-error-activo');
        campos['password'] = true;
    }
};

// Event listeners para validar en cada cambio o blur
inputs.forEach((input) => {
    if (input.type !== 'checkbox') { // Excluir checkboxes que no necesitan validación específica
        input.addEventListener('change', validarFormulario);
        input.addEventListener('keyup', validarFormulario);
        input.addEventListener('blur', validarFormulario);
    }
});

formularioRegistro.addEventListener('submit', (e) => {
    e.preventDefault();

    if (campos.documentoCliente && campos.nombreCliente && campos.apellidosCliente && campos.correoCliente &&
        campos.telefonoCliente && campos.direccionCliente && campos.password ) {
        
        formularioRegistro.reset();

        // Aquí podrías añadir la lógica para enviar los datos por POST

        Swal.fire({
            title: "¡Excelente!",
            text: "Cliente Registrado Correctamente!",
            icon: "success"
        }).then(() => {
            location.reload();
        });

        document.querySelectorAll('.formularioRegistro__grupo-correcto').forEach((icono) => {
            icono.classList.remove('formularioRegistro__grupo-correcto');
        });

    } else {
        Swal.fire({
            icon: "error",
            title: "¡Oops...",
            text: "Ingresa los datos correctos"
        });
    }
});
