const formularioRegistro = document.getElementById('formularioRegistro')
const inputs = document.querySelectorAll('#formularioRegistro input')


const expresiones = {
	nombreRutina: /^[a-zA-Z0-9]{3,}$/,
    tipoEjercicio: /^[a-zA-Z0-9]{3,}$/,
    repeticiones: /^(?:[1-9]|10)$/
}

const campos = {
    nombreRutina: false,
}

const validarFormulario = (e) => {
    switch (e.target.name) {
        case "nombreRutina":
            validarCampo(expresiones.nombreRutina, e.target, 'nombreRutina')
        break
        case "tipoEjercicio":
            validarCampo(expresiones.tipoEjercicio, e.target, 'tipoEjercicio')
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

    if (campos.nombreRutina && campos.tipoEjercicio && campos.repeticiones) {
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