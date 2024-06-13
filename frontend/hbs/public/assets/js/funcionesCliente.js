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
                        <a href="editarCliente?id=${cliente.IdUsuario}"><i class="fa-regular fa-pen-to-square fa-xl me-2"></i></a>
                        <a href="detalleCliente?id=${cliente.IdUsuario}"><i class="fa-regular fa-eye fa-xl me-2"></i></a>
                        <i class="fa-solid fa-trash fa-xl me-2 trash-icon" onclick="abrirModalEliminar('${cliente.IdUsuario}')"></i>
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
document.getElementById('formularioRegistro').addEventListener('submit', async function(event) {
    event.preventDefault();

    // Obtener los valores del formulario
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    // Estructura de los datos para la API
    const usuario = {
        Documento: data.documento,
        TipoDocumento: data.tipoDocumento,
        Nombres: data.nombres,
        Apellidos: data.apellidos,
        Correo: data.correo,
        Telefono: data.telefono,
        FechaDeNacimiento: data.fechaDeNacimiento,
        Direccion: data.direccion,
        Genero: data.genero,
        Contrasena: data.contrasena,
        Estado: data.estado,
        Beneficiario: null
    };

    try {
        // Registrar usuario
        const response = await fetch('http://localhost:3000/api/usuarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(usuario)
        });

        const result = await response.json();

        if (response.ok) {
            const usuarioId = result.IdUsuario;

            // Asignar rol de cliente (rol 4)
            const rolesAsignados = [];
            rolesAsignados.push({ IdRol: 4 }); // Rol de cliente siempre se asigna

            // Verificar si se debe asignar el rol de beneficiario (rol 5)
            if (data.beneficiario === '1') {
                rolesAsignados.push({ IdRol: 5 }); // Rol de beneficiario
            }

            // Asignar roles
            const asignacionRolesPromises = rolesAsignados.map(async (rol) => {
                const rolResponse = await fetch(`http://localhost:3000/api/usuariosRol/${usuarioId}/roles`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(rol)
                });
                return rolResponse.ok;
            });

            // Esperar a que se completen todas las asignaciones de roles
            const asignacionesCompletadas = await Promise.all(asignacionRolesPromises);

            // Verificar el resultado de todas las asignaciones
            if (asignacionesCompletadas.every(ok => ok)) {
                console.log('Usuario registrado y roles asignados exitosamente');
            } else {
                console.log('Error al asignar roles al usuario');
            }
        } else {
            console.log('Error al registrar el usuario: ' + result.message);
        }
    } catch (error) {
        console.error('Error:', error);
        console.log('Ocurrió un error al registrar el usuario');
    }
});



