
if (formulario) {
    formulario.addEventListener("submit", function (event) {
        event.preventDefault();
        validateForm();
    });
}

document.addEventListener("DOMContentLoaded", function () {
    function validateNombre(input) {
        const regex = /^[a-zA-Z\s]*$/;
        return regex.test(input.value);
    }

    function validateDocumento(input) {
        const regex = /^\d{10}$/;
        return regex.test(input.value);
    }

    function validateCorreo(input) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(input.value);
    }

    function validateDireccion(input) {
        const regex = /^[a-zA-Z0-9\s]*$/;
        return regex.test(input.value);
    }

    function validateContacto(input) {
        const regex = /^[a-zA-Z\s]*$/;
        return regex.test(input.value);
    }

    function updateErrorMessage(id, isValid, message) {
        const errorSpan = document.getElementById(id);
        errorSpan.textContent = isValid ? '' : message;
    }

    function validateForm() {
        const nombreInput = document.querySelector('input[name="Nombrebeneficiario"]');
        const tipoDocumentoInput = document.querySelector('select[name="tipoDocumento"]');
        const documentoInput = document.querySelector('input[name="Documentobeneficiario"]');
        const correoInput = document.querySelector('input[name="correobeneficiario"]');
        const direccionInput = document.querySelector('input[name="direccionbeneficiario"]');
        const contactoInput = document.querySelector('input[name="contactobeneficiario"]');

        const isValidNombre = validateNombre(nombreInput);
        const isValidTipoDocumento = tipoDocumentoInput.value !== "";
        const isValidDocumento = validateDocumento(documentoInput);
        const isValidCorreo = validateCorreo(correoInput);
        const isValidDireccion = validateDireccion(direccionInput);
        const isValidContacto = validateContacto(contactoInput);

        updateErrorMessage('nombre-error', isValidNombre, 'Solo se permiten letras y espacios en el nombre');
        updateErrorMessage('tipoDocumento-error', isValidTipoDocumento, 'Seleccione un tipo de documento');
        updateErrorMessage('Documentobeneficiario-error', isValidDocumento, 'Ingrese un número de documento válido (10 dígitos)');
        updateErrorMessage('correo-error', isValidCorreo, 'Ingrese una dirección de correo electrónico válida');
        updateErrorMessage('direccion-error', isValidDireccion, 'Solo se permiten letras, números y espacios en la dirección');
        updateErrorMessage('contacto-error', isValidContacto, 'Solo se permiten letras y espacios en el contacto');

        if (isValidNombre && isValidTipoDocumento && isValidDocumento && isValidCorreo && isValidDireccion && isValidContacto) {
            alert('Formulario válido. Guardar información.');
        } else {
            alert('El formulario no es válido. Por favor, revisa los campos.');
        }
    }

    const guardarButton = document.querySelector('button[name="Guardar"]');
    if (guardarButton) {
        guardarButton.addEventListener("click", validateForm);
    }
});