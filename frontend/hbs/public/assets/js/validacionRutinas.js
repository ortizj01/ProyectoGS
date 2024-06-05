const formularioRegistro = document.getElementById('formularioRegistro');
const inputs = document.querySelectorAll('#formularioRegistro input');

const expresiones = {
    nombreRutina: /^[a-zA-Z0-9\s-_]{3,}$/
};

const campos = {
    nombreRutina: false,
    idUsuario: false // Agrega el campo idUsuario al objeto campos
};

const validarFormulario = (e) => {
    switch (e.target.name) {
        case "nombreRutina":
            validarCampo(expresiones.nombreRutina, e.target, 'nombreRutina');
            break;
        case "idUsuario":
            validarSeleccionUsuario(e.target.value, 'idUsuario'); // Llama a la función para validar idUsuario
            break;
        // Puedes agregar más casos para otras validaciones si es necesario
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

const validarSeleccionUsuario = (value, campo) => {
    if (value !== "0") {
        campos[campo] = true;
    } else {
        campos[campo] = false;
    }
};

inputs.forEach((input) => {
    input.addEventListener('keyup', validarFormulario);
    input.addEventListener('blur', validarFormulario);
});

formularioRegistro.addEventListener('submit', (e) => {
    e.preventDefault();

    if (campos.nombreRutina && campos.idUsuario) {
        formularioRegistro.reset();

        Swal.fire({
            title: "¡Excelente!",
            text: "¡La rutina se guardó con éxito!",
            icon: "success"
        });

        document.querySelectorAll('.formularioRegistro__grupo-correcto').forEach((icono) => {
            icono.classList.remove('formularioRegistro__grupo-correcto');
        });

    } else {
        Swal.fire({
            icon: "error",
            title: "¡Oops...",
            text: "¡Por favor, selecciona un usuario y asegúrate de ingresar los datos correctos!",
        });
    }
});
