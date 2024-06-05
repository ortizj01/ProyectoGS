const formularioRegistro = document.getElementById('formularioRegistro')
const inputs = document.querySelectorAll('#formularioRegistro input')

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

const validarFormulario = (e) => {
    switch (e.target.name) {
        case "nombreBeneficiario":
            validarCampo(expresiones.nombreBeneficiario, e.target, 'nombreBeneficiario')
        break
        case "documentoBeneficiario":
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

    if (campos.documentoBeneficiario && campos.nombreBeneficiario && campos.correoBeneficiario && campos.telefonoBeneficiario && 
        campos.direccionBeneficiario ) {
        formularioRegistro.reset()

        Swal.fire({
            title: "Excelente!",
            text: "Beneficiario Registrado Correctamente!",
            icon: "success"
          })
          .then(() => {

            location.reload()
    
          })

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
});

