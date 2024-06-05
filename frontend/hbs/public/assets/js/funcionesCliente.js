// LISTAR CLIENTES

const listarClientes = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/clientes', {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener los clientes');
        }

        const listarClientes = await response.json();

        let contenido = '';

        listarClientes.forEach(cliente => {
            contenido += `<tr>` +
                `<td>${cliente.Documento}</td>` +
                `<td>${cliente.Nombres}</td>` +
                `<td>${cliente.Telefono}</td>` +
                `<td>${cliente.Correo}</td>` +
                `<td>${cliente.Estado}</td>` +
                `<td style="text-align: center;">
                    <div class="centered-container">
                        <i class="fa-regular fa-pen-to-square fa-xl me-2" onclick="abrirModalEditar('${cliente}')"></i>
                        <a href="detalleCliente"><i class="fa-regular fa-eye fa-xl me-2"></i></a>
                        <i class="fa-solid fa-trash fa-xl me-2 trash-icon" onclick="abrirModalEliminar('${cliente}')"></i>
                    </div>
                </td>` +
                `</tr>`;
        });

        const objectId = document.getElementById('contenido');
        if (objectId) {
            objectId.innerHTML = contenido;
        } else {
            console.error('No se encontró el elemento con id "contenido"');
        }

    } catch (error) {
        console.error('Error:', error.message);
        // Manejar el error en caso necesario
    }
};

//REGISTRAR CLIENTES
const registrarCliente = () => {
    // Obtener valores de los campos del formulario
    const documentoCliente = document.getElementById('documento').value;
    const tipoDocumento = document.getElementById('tipoDocumento').value;
    const nombres = document.getElementById('nombres').value;
    const apellidos = document.getElementById('apellidos').value;
    const correo = document.getElementById('correo').value;
    const telefono = document.getElementById('telefono').value;
    const fechaDeNacimiento = document.getElementById('fechaDeNacimiento').value;
    const direccion = document.getElementById('direccion').value;
    const genero = document.getElementById('genero').value;
    const contrasena = document.getElementById('contrasena').value;
    const estado = document.getElementById('estadoCliente').value;
    const beneficiario = document.getElementById('beneficiario').value;

    // Crear el objeto cliente con los datos recolectados
    let cliente = {
        Documento: documentoCliente,
        TipoDocumento: tipoDocumento,
        Nombres: nombres,
        Apellidos: apellidos,
        Correo: correo,
        Telefono: telefono,
        FechaDeNacimiento: fechaDeNacimiento,
        Direccion: direccion,
        Genero: genero,
        Contrasena: contrasena,
        Estado: parseInt(estado), // Aseguramos que estado sea un número entero
        Beneficiario: parseInt(beneficiario) // Aseguramos que beneficiario sea un número entero
    };

    // Validaciones (opcional, dependiendo de los requisitos de tu aplicación)

    // Realizar la solicitud POST usando fetch
    fetch('http://localhost:3000/api/clientes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(cliente)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Respuesta del servidor:', data);
        // Aquí podrías manejar la respuesta del servidor como necesites
        alert('Cliente registrado exitosamente');
        // Limpiar los campos del formulario después del registro exitoso
        document.getElementById('formularioRegistro').reset();
    })
    .catch(error => {
        console.error('Error al registrar cliente:', error);
        alert('Ocurrió un error al registrar el cliente');
    });
};

// Capturar el evento de envío del formulario y llamar a registrarCliente()
document.getElementById('formularioRegistro').addEventListener('submit', function(event) {
    event.preventDefault(); // Evitar el envío automático del formulario
    registrarCliente(); // Llamar a la función de registro de cliente
});



//ACTUALIZAR CLIENTE

const actualizarCliente = async (cliente) => {
    try {
        const response = await fetch(url + `/${cliente.IdUsuario}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(cliente),
        });

        if (!response.ok) {
            throw new Error('Error en la solicitud PUT');
        }

        const data = await response.json();
        console.log('Success:', data);

        Swal.fire({
            title: "¡Excelente!",
            text: "Cliente actualizado correctamente!",
            icon: "success"
        }).then(() => {
            location.reload();
        });

    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            icon: "error",
            title: "¡Oops...",
            text: "Hubo un problema al actualizar al cliente"
        });
    }
};

const abrirModalEditar = (cliente) => {
    // Llena los campos del formulario con la información del cliente
    document.getElementById('documentoCliente').value = cliente.Documento;
    document.getElementById('nombreCliente').value = cliente.Nombres;
    document.getElementById('correoCliente').value = cliente.Correo;
    document.getElementById('telefonoCliente').value = cliente.Telefono;
    document.getElementById('direccionCliente').value = cliente.Direccion;
    document.getElementById('estadoCliente').value = cliente.Estado;

    validarCamposModal();

    // Abre el modal
    $('#editarClienteModal').modal('show');
};

const formularioEdicion = document.getElementById('formularioEdicion');

formularioEdicion.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formValido = validarFormulario();

    if (formValido) {
        const cliente = {
            IdUsuario: document.getElementById('idCliente').value.trim(), // Asegúrate de tener el ID del cliente en un campo oculto en tu formulario de edición
            Documento: document.getElementById('documentoCliente').value.trim(),
            Nombres: document.getElementById('nombreCliente').value.trim(),
            Correo: document.getElementById('correoCliente').value.trim(),
            Telefono: parseInt(document.getElementById('telefonoCliente').value.trim()),
            Direccion: document.getElementById('direccionCliente').value.trim(),
            Estado: parseInt(document.getElementById('estadoCliente').value.trim())
        };

        console.log('Datos actualizados del cliente:', cliente); // Verificar en la consola los datos capturados

        await actualizarCliente(cliente);

    } else {
        Swal.fire({
            icon: "error",
            title: "¡Oops...",
            text: "Ingresa los datos correctos"
        });
    }
});


//ELIMINAR CLIENTE

const eliminarCliente = async (idCliente) => {
    try {
        const response = await fetch(url + `/${idCliente}`, {
            method: 'DELETE',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Error en la solicitud DELETE');
        }

        Swal.fire({
            title: "¡Eliminado!",
            text: "Cliente eliminado correctamente!",
            icon: "success"
        }).then(() => {
            location.reload();
        });

    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            icon: "error",
            title: "¡Oops...",
            text: "Hubo un problema al eliminar al cliente"
        });
    }
};

const abrirModalEliminar = (cliente) => {
    // Abre el modal de confirmación de eliminación
    $('#eliminarClienteModal').modal('show');

    // Llena los campos del formulario de eliminación con la información del cliente
    document.getElementById('documentoClienteEliminar').value = cliente.Documento;
    document.getElementById('nombreClienteEliminar').value = cliente.Nombres;
    document.getElementById('correoClienteEliminar').value = cliente.Correo;
    document.getElementById('telefonoClienteEliminar').value = cliente.Telefono;
    document.getElementById('direccionClienteEliminar').value = cliente.Direccion;
    document.getElementById('estadoClienteEliminar').value = cliente.Estado;
};

const formularioEliminacion = document.getElementById('formularioEliminacion');

formularioEliminacion.addEventListener('submit', async (e) => {
    e.preventDefault();

    const idCliente = document.getElementById('idClienteEliminar').value.trim(); // Asegúrate de tener el ID del cliente en un campo oculto en tu formulario de eliminación

    await eliminarCliente(idCliente);
});

