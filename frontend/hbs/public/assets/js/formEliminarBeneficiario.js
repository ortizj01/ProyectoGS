formularioEliminar.addEventListener('submit', (e) => {
    e.preventDefault();

    // Obtener los valores de los campos del formulario
    const documentoBeneficiario = document.getElementById('documentoBeneficiarioEliminar').value;
    const nombreBeneficiario = document.getElementById('nombreBeneficiarioEliminar').value;
    const correoBeneficiario = document.getElementById('correoBeneficiarioEliminar').value;
    const telefonoBeneficiario = document.getElementById('telefonoBeneficiarioEliminar').value;
    const direccionBeneficiario = document.getElementById('direccionBeneficiarioEliminar').value;

    // Realizar la validación de los campos
    if (documentoBeneficiario && nombreBeneficiario && correoBeneficiario && telefonoBeneficiario && direccionBeneficiario) {
        // Los campos son válidos, realizar la eliminación
        EliminarBeneficiario();

        Swal.fire({
            title: "Excelente!",
            text: "Beneficiario Eliminado Correctamente!",
            icon: "success",
            didClose: () => {
                location.reload();
            }
        });
    } else {
        // Mostrar mensaje de error
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "No fue posible eliminar al Beneficiario",
        });
    }
});