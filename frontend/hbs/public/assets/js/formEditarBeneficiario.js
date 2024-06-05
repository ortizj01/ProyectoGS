const formularioActualizacion = document.getElementById('formularioActualizacion')
const inputs = document.querySelectorAll('#formularioActualizacion input')

const expresiones = {
	nombreBeneficiario: /^[a-zA-ZÀ-ÿ\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
    documentoBeneficiario: /^[0-9]{7,10}$/,
	correoBeneficiario: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
    direccionBeneficiario: /^[A-Za-z0-9\s#áéíóúÁÉÍÓÚüÜ.,-]+$/,
	telefonoBeneficiario: /^[0-9]{7,10}$/,
  
}

const campos = {
    nombreBeneficiario: false, 
    documentoBeneficiario: false, 
    correoBeneficiario: false, 
    telefonoBeneficiario: false, 
    direccionBeneficiario: false,
    estadoBeneficiario: true,
  
}

const validarCamposModal = () => {
    // Obtén los valores de los campos del modal
    const nombreBeneficiario = document.getElementById('nombreBeneficiario').value;
    const documentoBeneficiario = document.getElementById('documentoBeneficiario').value;
    const correoBeneficiario = document.getElementById('correoBeneficiario').value;
    const telefonoBeneficiario = document.getElementById('telefonoBeneficiario').value;
    const direccionBeneficiario = document.getElementById('direccionBeneficiario').value;
    const estadoBeneficiario = document.getElementById('estadoBeneficiario').value;

    // Realiza la validación de cada campo como lo haces en la función validarCampo
    validarCampo(expresiones.nombreBeneficiario, { value: nombreBeneficiario }, 'nombreBeneficiario');
    validarCampo(expresiones.documentoBeneficiario, { value: documentoBeneficiario }, 'documentoBeneficiario');
    validarCampo(expresiones.correoBeneficiario, { value: correoBeneficiario }, 'correoBeneficiario');
    validarCampo(expresiones.telefonoBeneficiario, { value: telefonoBeneficiario }, 'telefonoBeneficiario');
    validarCampo(expresiones.direccionBeneficiario, { value: direccionBeneficiario }, 'direccionBeneficiario');

};

const validarFormulario = (e) => {
    switch (e.target.name) {
        case "nombreBeneficiario":
            validarCampo(expresiones.nombreBeneficiario, e.target, 'nombreBeneficiario')
        break
        case "documentoBeneficiario":break
            validarCampo(expresiones.documentoBeneficiario, e.target, 'documentoBeneficiario')
        break
        case "correoBeneficiario":
            validarCampo(expresiones.correoBeneficiario, e.target, 'correoBeneficiario')
        break
        case "telefonoBeneficiario":
            validarCampo(expresiones.telefonoBeneficiario, e.target, 'telefonoBeneficiario')
        break
        case "direccionBeneficiario":
            validarCampo(expresiones.direccionBeneficiario, e.target, 'direccionBeneficiario')
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

    if (campos.documentoBeneficiario && campos.nombreBeneficiario && campos.correoBeneficiario && campos.telefonoBeneficiario && 
        campos.direccionBeneficiario) {
            formularioActualizacion.reset()

        Swal.fire({
            title: "Excelente!",
            text: "Beneficiario Actualizado Correctamente!",
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

