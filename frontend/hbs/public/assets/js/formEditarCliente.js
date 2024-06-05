const formularioActualizacion = document.getElementById('formularioActualizacion')
const inputs = document.querySelectorAll('#formularioActualizacion input')

const expresiones = {
	nombreCliente: /^[a-zA-ZÀ-ÿ\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
    documentoCliente: /^[0-9]{7,10}$/,
	correoCliente: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
    direccionCliente: /^[A-Za-z0-9\s#áéíóúÁÉÍÓÚüÜ.,-]+$/,
	telefonoCliente: /^[0-9]{7,10}$/,
  
}

const campos = {
    nombreCliente: false, 
    documentoCliente: false, 
    correoCliente: false, 
    telefonoCliente: false, 
    direccionCliente: false,
    estadoCliente: true,
  
}

const validarCamposModal = () => {
    // Obtén los valores de los campos del modal
    const nombreCliente = document.getElementById('nombreCliente').value;
    const documentoCliente = document.getElementById('documentoCliente').value;
    const correoCliente = document.getElementById('correoCliente').value;
    const telefonoCliente = document.getElementById('telefonoCliente').value;
    const direccionCliente = document.getElementById('direccionCliente').value;
    const estadoCliente = document.getElementById('estadoCliente').value;

    // Realiza la validación de cada campo como lo haces en la función validarCampo
    validarCampo(expresiones.nombreCliente, { value: nombreCliente }, 'nombreCliente');
    validarCampo(expresiones.documentoCliente, { value: documentoCliente }, 'documentoCliente');
    validarCampo(expresiones.correoCliente, { value: correoCliente }, 'correoCliente');
    validarCampo(expresiones.telefonoCliente, { value: telefonoCliente }, 'telefonoCliente');
    validarCampo(expresiones.direccionCliente, { value: direccionCliente }, 'direccionCliente');

};

const validarFormulario = (e) => {
    switch (e.target.name) {
        case "nombreCliente":
            validarCampo(expresiones.nombreCliente, e.target, 'nombreCliente')
        break
        case "documentoCliente":
            validarCampo(expresiones.documentoCliente, e.target, 'documentoCliente')
        break
        case "correoCliente":
            validarCampo(expresiones.correoCliente, e.target, 'correoCliente')
        break
        case "telefonoCliente":
            validarCampo(expresiones.telefonoCliente, e.target, 'telefonoCliente')
        break
        case "direccionCliente":
            validarCampo(expresiones.direccionCliente, e.target, 'direccionCliente')
        break
    }
}

const validarCampo = (expresion, input, campo) => {
    if (expresion.test(input.value)) {
        document.getElementById(`grupo__${campo}`).classList.remove('formularioActualizacion__grupo-incorrecto')
        document.getElementById(`grupo__${campo}`).classList.add('formularioActualizacion__grupo-correcto')
        document.querySelector(`#grupo__${campo} i`).classList.add('fa-check-circle')
        document.querySelector(`#grupo__${campo} i`).classList.remove('fa-times-circle')
        document.querySelector(`#grupo__${campo} .formularioActualizacion__input-error`).classList.remove('formularioActualizacion__input-error-activo')
        campos[campo] = true
    } else {
        document.getElementById(`grupo__${campo}`).classList.add('formularioActualizacion__grupo-incorrecto')
        document.getElementById(`grupo__${campo}`).classList.remove('formularioActualizacion__grupo-correcto')
        document.querySelector(`#grupo__${campo} i`).classList.remove('fa-check-circle')
        document.querySelector(`#grupo__${campo} i`).classList.add('fa-times-circle')
        document.querySelector(`#grupo__${campo} .formularioActualizacion__input-error`).classList.add('formularioActualizacion__input-error-activo')
        campos[campo] = false; // Corregir el error aquí
    }
}



inputs.forEach((input) => {
    input.addEventListener('keyup', validarFormulario)
    input.addEventListener('blur', validarFormulario)
})

formularioActualizacion.addEventListener('submit', (e) =>{
    e.preventDefault();

    if (campos.documentoCliente && campos.nombreCliente && campos.correoCliente && campos.telefonoCliente && 
        campos.direccionCliente) {
            formularioActualizacion.reset()

        Swal.fire({
            title: "Excelente!",
            text: "Cliente Actualizado Correctamente!",
            icon: "success"
          })
          .then(() => {

            location.reload()
    
          })

          document.querySelectorAll('.formularioActualizacion__grupo-correcto').forEach((icono) => {
            icono.classList.remove('formularioActualizacion__grupo-correcto')
        })

    } else {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Ingresa los datos correctos",
          });
    }
});

