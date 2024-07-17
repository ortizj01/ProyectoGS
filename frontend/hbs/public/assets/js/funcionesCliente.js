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
            const estadoTexto = cliente.Estado === 0 ? 'Activo' : 'Inactivo';
            contenido += `<tr>` +
                `<td>${cliente.Documento}</td>` +
                `<td>${cliente.Nombres}</td>` +
                `<td>${cliente.Telefono}</td>` +
                `<td>${cliente.Correo}</td>` +
                `<td>${estadoTexto}</td>` +
                `<td style="text-align: center;">
                    <div class="centered-container">
                        <a href="editarCliente?id=${cliente.IdUsuario}"><i class="fa-regular fa-pen-to-square fa-xl me-2"></i></a>
                        <a href="detalleCliente?id=${cliente.IdUsuario}"><i class="fa-regular fa-eye fa-xl me-2"></i></a>
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

        // Inicializar DataTables solo si aún no ha sido inicializado
        if (!$.fn.DataTable.isDataTable('#dataTable')) {
            $('#dataTable').DataTable({
                language: {
                    url: '//cdn.datatables.net/plug-ins/1.10.20/i18n/Spanish.json'
                },
                pageLength: 5,
                lengthChange: false
            });
        }

    } catch (error) {
        console.error('Error:', error.message);
        // Manejar el error en caso necesario
    }
};

document.addEventListener('DOMContentLoaded', listarClientes);

// REGISTRAR CLIENTE

// Mostrar/ocultar formulario de valoración médica según el valor de beneficiario
document.getElementById('beneficiario').addEventListener('change', function() {
    const valoracionMedica = document.getElementById('valoracionMedica');
    if (this.value === '1') {
        valoracionMedica.style.display = 'block';
    } else {
        valoracionMedica.style.display = 'none';
    }
});

function calcularIMC() {
    const peso = parseFloat(document.getElementById('Peso').value);
    const altura = parseFloat(document.getElementById('Altura').value);
    if (peso && altura) {
        const imc = (peso / (altura * altura)).toFixed(2);
        document.getElementById('IMC').value = imc;
    }
}

// Escuchar cambios en los campos de peso y altura
document.getElementById('Peso').addEventListener('input', calcularIMC);
document.getElementById('Altura').addEventListener('input', calcularIMC);


async function registrarCliente() {
    const form = document.getElementById('formularioRegistro');

    // Verificar si se seleccionó "Sí" en el campo beneficiario
    const beneficiario = document.getElementById('beneficiario').value;
    if (beneficiario === '1') {
        // Validar los campos de valoración médica
        const valoracionCampos = document.querySelectorAll('#valoracionMedica input, #valoracionMedica select');
        for (const campo of valoracionCampos) {
            if (!campo.value) {
                Swal.fire({
                    icon: "error",
                    title: "¡Oops...",
                    text: "Todos los campos de valoración médica son obligatorios."
                });
                return;
            }
        }
    }

    // Obtener los valores del formulario
    const formData = new FormData(form);
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

            // Asignar rol de cliente (rol 3)
            const rolesAsignados = [];
            rolesAsignados.push({ IdRol: 3 }); // Rol de cliente siempre se asigna

            // Verificar si se debe asignar el rol de beneficiario (rol 4)
            if (data.beneficiario === '1') {
                rolesAsignados.push({ IdRol: 4 }); // Rol de beneficiario
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
                // Si es beneficiario, registrar la valoración médica
                if (data.beneficiario === '1') {
                    const valoracionMedica = {
                        IdUsuario: usuarioId,
                        TieneCondicionCronica: data.TieneCondicionCronica,
                        CirugiaPrevia: data.CirugiaPrevia,
                        AlergiasConocidas: data.AlergiasConocidas,
                        MedicamentosActuales: data.MedicamentosActuales,
                        LesionesMusculoesqueleticas: data.LesionesMusculoesqueleticas,
                        EnfermedadCardiacaVascular: data.EnfermedadCardiacaVascular,
                        AntecedentesFamiliares: data.AntecedentesFamiliares,
                        TipoAfiliacion: data.TipoAfiliacion,
                        Peso: data.Peso,
                        Altura: data.Altura,
                        IMC: data.IMC
                    };

                    const valoracionResponse = await fetch('http://localhost:3000/api/valoracionesMedicas', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(valoracionMedica)
                    });

                    if (!valoracionResponse.ok) {
                        throw new Error('Error al registrar la valoración médica');
                    }
                }

                Swal.fire({
                    title: "¡Excelente!",
                    text: "Cliente Registrado Correctamente!",
                    icon: "success"
                }).then(() => {
                    location.reload();
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "¡Oops...",
                    text: "Error al asignar roles al usuario"
                });
            }
        } else {
            Swal.fire({
                icon: "error",
                title: "¡Oops...",
                text: result.message
            });
        }
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "¡Oops...",
            text: "Ocurrió un error al registrar el usuario"
        });
    }
}

// EDITAR CLIENTE
// Mostrar/ocultar formulario de valoración médica según el valor de beneficiario
document.getElementById('beneficiario').addEventListener('change', function() {
    const valoracionMedica = document.getElementById('valoracionMedica');
    const editarValoracionMedicaBtn = document.getElementById('editarValoracionMedicaBtn');
    if (this.value === '1') {
        valoracionMedica.style.display = 'block';
        editarValoracionMedicaBtn.style.display = 'none'; // Ocultar el botón de editar valoración médica
    } else {
        valoracionMedica.style.display = 'none';
        editarValoracionMedicaBtn.style.display = 'none'; // Ocultar el botón de editar valoración médica
    }
});

async function cargarDatosEditarCliente() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const usuarioId = urlParams.get('id');

        if (!usuarioId) {
            console.error('ID del usuario no encontrado en la URL');
            return;
        }

        const response = await fetch(`http://localhost:3000/api/usuarios/${usuarioId}`);
        if (!response.ok) {
            throw new Error('Error al obtener datos del cliente: ' + response.statusText);
        }
        const cliente = await response.json();

        const fechaNacimiento = new Date(cliente.FechaDeNacimiento);
        const formattedFechaNacimiento = fechaNacimiento.toISOString().split('T')[0];

        document.getElementById('clienteId').value = cliente.IdUsuario;
        document.getElementById('documento').value = cliente.Documento;
        document.getElementById('tipoDocumento').value = cliente.TipoDocumento;
        document.getElementById('nombres').value = cliente.Nombres;
        document.getElementById('apellidos').value = cliente.Apellidos;
        document.getElementById('correo').value = cliente.Correo;
        document.getElementById('telefono').value = cliente.Telefono;
        document.getElementById('fechaDeNacimiento').value = formattedFechaNacimiento;
        document.getElementById('direccion').value = cliente.Direccion;
        document.getElementById('genero').value = cliente.Genero;
        document.getElementById('estado').value = cliente.Estado;

        // Obtener roles actuales del usuario
        const rolesResponse = await fetch(`http://localhost:3000/api/usuariosRol/${usuarioId}/roles`);
        if (!rolesResponse.ok) {
            throw new Error('Error al obtener roles del cliente: ' + rolesResponse.statusText);
        }
        const roles = await rolesResponse.json();
        const tieneRolBeneficiario = Array.isArray(roles) && roles.some(rol => rol.IdRol === 4);
        document.getElementById('beneficiario').value = tieneRolBeneficiario ? "1" : "0";

        if (tieneRolBeneficiario) {
            document.getElementById('editarValoracionMedicaBtn').style.display = 'block';
        }

        document.getElementById('beneficiario').addEventListener('change', function() {
            const valoracionMedica = document.getElementById('valoracionMedica');
            if (this.value === '1') {
                valoracionMedica.style.display = 'block';
            } else {
                valoracionMedica.style.display = 'none';
            }
        });
    } catch (error) {
        console.error('Error al cargar datos del cliente:', error);
    }
}

// Función para redirigir a la página de edición de valoración médica
function redirigirValoracionMedica() {
    const usuarioId = document.getElementById('clienteId').value;
    window.location.href = `editarValoracionMedica?id=${usuarioId}`;
}

// Función para redirigir a la página de edición de valoración médica
function redirigirValoracionMedica() {
    const usuarioId = document.getElementById('clienteId').value;
    window.location.href = `editarValoracionMedica?id=${usuarioId}`;
}

async function actualizarCliente() {
    try {
        const form = document.getElementById('formularioEditar');
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        const id = data.id;

        const getResponse = await fetch(`http://localhost:3000/api/usuarios/${id}`);
        if (!getResponse.ok) {
            throw new Error('Error al obtener datos del cliente: ' + getResponse.statusText);
        }
        const currentData = await getResponse.json();

        const updatedData = {
            Documento: data.documento || currentData.Documento,
            TipoDocumento: data.tipoDocumento || currentData.TipoDocumento,
            Nombres: data.nombres || currentData.Nombres,
            Apellidos: data.apellidos || currentData.Apellidos,
            Correo: data.correo || currentData.Correo,
            Telefono: data.telefono || currentData.Telefono,
            FechaDeNacimiento: data.fechaDeNacimiento || currentData.FechaDeNacimiento,
            Direccion: data.direccion || currentData.Direccion,
            Genero: data.genero || currentData.Genero,
            Contrasena: currentData.Contrasena,
            Estado: data.estado,
            Beneficiario: null // Siempre enviar Beneficiario como null
        };

        const putResponse = await fetch(`http://localhost:3000/api/usuarios/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        });

        if (!putResponse.ok) {
            throw new Error('Error en la solicitud: ' + putResponse.statusText);
        }

        // Obtener roles actuales del usuario
        const rolesResponse = await fetch(`http://localhost:3000/api/usuariosRol/${id}/roles`);
        if (!rolesResponse.ok) {
            throw new Error('Error al obtener roles del cliente: ' + rolesResponse.statusText);
        }
        const roles = await rolesResponse.json();

        const beneficiarioSelect = document.getElementById('beneficiario');
        const tieneRolBeneficiario = Array.isArray(roles) && roles.some(rol => rol.IdRol === 4);

        if (beneficiarioSelect.value === "1" && !tieneRolBeneficiario) {
            // Asignar el rol de beneficiario
            const rolResponse = await fetch(`http://localhost:3000/api/usuariosRol/${id}/roles`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ IdRol: 4 }) // IdRol 4 es el rol de beneficiario
            });

            if (!rolResponse.ok) {
                throw new Error('Error al asignar el rol de beneficiario: ' + rolResponse.statusText);
            }

            // Registrar valoración médica si se ha cambiado a beneficiario y los campos están llenos
            if (document.getElementById('valoracionMedica').style.display === 'block') {
                const valoracionMedica = {
                    IdUsuario: id,
                    TieneCondicionCronica: data.TieneCondicionCronica,
                    CirugiaPrevia: data.CirugiaPrevia,
                    AlergiasConocidas: data.AlergiasConocidas,
                    MedicamentosActuales: data.MedicamentosActuales,
                    LesionesMusculoesqueleticas: data.LesionesMusculoesqueleticas,
                    EnfermedadCardiacaVascular: data.EnfermedadCardiacaVascular,
                    AntecedentesFamiliares: data.AntecedentesFamiliares,
                    TipoAfiliacion: data.TipoAfiliacion,
                    Peso: data.Peso,
                    Altura: data.Altura,
                    IMC: data.IMC
                };

                const valoracionResponse = await fetch(`http://localhost:3000/api/valoracionesMedicas`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(valoracionMedica)
                });

                if (!valoracionResponse.ok) {
                    throw new Error('Error al registrar la valoración médica');
                }
            }

        } else if (beneficiarioSelect.value === "0" && tieneRolBeneficiario) {
            // Eliminar el rol de beneficiario y la valoración médica
            const rolUsuario = roles.find(rol => rol.IdRol === 4);
            if (rolUsuario) {
                const eliminarRolResponse = await fetch(`http://localhost:3000/api/usuariosRol/roles/${rolUsuario.IdRolUsuario}`, {
                    method: 'DELETE'
                });

                if (!eliminarRolResponse.ok) {
                    throw new Error('Error al eliminar el rol de beneficiario: ' + eliminarRolResponse.statusText);
                }

                const eliminarValoracionResponse = await fetch(`http://localhost:3000/api/valoracionesMedicas/${id}`, {
                    method: 'DELETE'
                });

                if (!eliminarValoracionResponse.ok) {
                    throw new Error('Error al eliminar la valoración médica: ' + eliminarValoracionResponse.statusText);
                }
            }
        }

        Swal.fire({
            title: "¡Excelente!",
            text: "Cliente Actualizado Correctamente!",
            icon: "success",
        }).then(() => {
            window.location.href = '/clientes';
        });

        document.querySelectorAll('.formularioEditar__grupo-correcto').forEach((icono) => {
            icono.classList.remove('formularioEditar__grupo-correcto');
        });
        
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "¡Oops...",
            text: "Error al actualizar los datos del cliente: " + error.message
        });
    }
}



//VER DETALLE CLIENTE
async function cargarDatosCliente() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (id) {
        try {
            const response = await fetch(`http://localhost:3000/api/usuarios/${id}`, {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Error al obtener los detalles del cliente');
            }

            const cliente = await response.json();

            // Convertir el estado a texto
            const estadoTexto = cliente.Estado === 0 ? 'Activo' : 'Inactivo';

            // Formatear la fecha de nacimiento
            const fecha = new Date(cliente.FechaDeNacimiento);
            const dia = String(fecha.getDate()).padStart(2, '0');
            const mes = String(fecha.getMonth() + 1).padStart(2, '0');
            const anio = fecha.getFullYear();
            const fechaFormateada = `${dia}/${mes}/${anio}`;

            document.getElementById('documentoCliente').value = cliente.Documento;
            document.getElementById('nombreCliente').value = cliente.Nombres;
            document.getElementById('emailCliente').value = cliente.Correo;
            document.getElementById('TelefonoCliente').value = cliente.Telefono;
            document.getElementById('direccionCliente').value = cliente.Direccion;
            document.getElementById('apellidosCliente').value = cliente.Apellidos;
            document.getElementById('tipoDocumentoCliente').value = cliente.TipoDocumento;
            document.getElementById('fechaNacimientoCliente').value = fechaFormateada;
            document.getElementById('estadoCliente').value = estadoTexto;
            document.getElementById('generoCliente').value = cliente.Genero;
        } catch (error) {
            console.error('Error:', error.message);
            // Manejar el error en caso necesario
        }
    }
}

document.addEventListener('DOMContentLoaded', cargarDatosCliente);
