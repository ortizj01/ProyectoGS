const formularioRegistro = document.getElementById('formularioRegistro')
const inputs = document.querySelectorAll('#formularioRegistro input')


const expresiones = {
	nombreEjercicio: /^[a-zA-Z0-9]{3,}$/,
    descripcionEjercicio: /^[a-zA-Z0-9]{3,}$/,
    repeticiones: /^(?:[1-9]|10)$/
}

const campos = {
    nombreEjercicio: false,
    descripcionEjercicio: false,
    repeticiones: false
}

const validarFormulario = (e) => {
    switch (e.target.name) {
        case "nombreEjercicio":
            validarCampo(expresiones.nombreEjercicio, e.target, 'nombreEjercicio')
        break
        case "descripcionEjercicio":
            validarCampo(expresiones.descripcionEjercicio, e.target, 'descripcionEjercicio')
        break
        case "repeticiones":
            validarCampo(expresiones.repeticiones, e.target, 'repeticiones')
        break
        // case "correo":
        //     validarCampo(expresiones.correo, e.target, 'correo')
        // break
        // case "telefono":
        //     validarCampo(expresiones.telefono, e.target, 'telefono')
        // break
        // case "edad":
        //     validarCampo(expresiones.edad, e.target, 'edad')
        // break
        // case "direccion":
        //     validarCampo(expresiones.direccion, e.target, 'direccion')
        // break
        // case "password":
        //     validarCampo(expresiones.password, e.target, 'password')
        //     validarPassword2()  
        // break
        // case "confirmarPassword":
        //     validarPassword2()
        // break
    }
}

const validarCampo = (expresion, input, campo) => {
    if (expresion.test(input.value)) {
        document.getElementById(`grupo__${campo}`).classList.remove('formularioRegistro__grupo-incorrecto')
        document.getElementById(`grupo__${campo}`).classList.add('formularioRegistro__grupo-correcto')
        document.querySelector(`#grupo__${campo} i`).classList.add('fa-check-circle')
        document.querySelector(`#grupo__${campo} i`).classList.remove('fa-times-circle')
        document.querySelector(`#grupo__${campo} .formularioRegistro__input-error`).classList.remove('formularioRegistro__input-error-activo')
        campos[campo] = true
    }else {
        document.getElementById(`grupo__${campo}`).classList.add('formularioRegistro__grupo-incorrecto')
        document.getElementById(`grupo__${campo}`).classList.remove('formularioRegistro__grupo-correcto')
        document.querySelector(`#grupo__${campo} i`).classList.remove('fa-check-circle')
        document.querySelector(`#grupo__${campo} i`).classList.add('fa-times-circle')
        document.querySelector(`#grupo__${campo} .formularioRegistro__input-error`).classList.add('formularioRegistro__input-error-activo')
        campo[false]
    }
}


inputs.forEach((input) => {
    input.addEventListener('keyup', validarFormulario)
    input.addEventListener('blur', validarFormulario)
})

formularioRegistro.addEventListener('submit', (e) =>{
    e.preventDefault();

    if (campos.nombreEjercicio && campos.descripcionEjercicio && campos.repeticiones) {
        formularioRegistro.reset()

        Swal.fire({
            title: "Excelente!",
            text: "La rutina se guardo con exito!",
            icon: "success"
          });

          document.querySelectorAll('.formularioRegistro__grupo-correcto').forEach((icono) => {
            icono.classList.remove('formularioRegistro__grupo-correcto')
        })

    } else {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Ingresa los datos correctos",
          });
    }

})