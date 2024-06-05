formularioEliminar.addEventListener('submit', (e) => {
    e.preventDefault();

    // Obtener los valores de los campos del formulario
    const documentoCliente = document.getElementById('documentoClienteEliminar').value;
    const nombreCliente = document.getElementById('nombreClienteEliminar').value;
    const correoCliente = document.getElementById('correoClienteEliminar').value;
    const telefonoCliente = document.getElementById('telefonoClienteEliminar').value;
    const direccionCliente = document.getElementById('direccionClienteEliminar').value;

    // Realizar la validación de los campos
    if (documentoCliente && nombreCliente && correoCliente && telefonoCliente && direccionCliente) {
        // Los campos son válidos, realizar la eliminación
        EliminarCliente();

        Swal.fire({
            title: "Excelente!",
            text: "Cliente Eliminado Correctamente!",
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
            text: "No fue posible eliminar al cliente",
        });
    }
});