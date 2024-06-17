// LISTAR BENEFICIARIOS
const listarBeneficiarios = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/beneficiarios', {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener los beneficiarios');
        }

        const listarBeneficiarios = await response.json();

        let contenido = '';

        listarBeneficiarios.forEach(beneficiario => {
            // Convertir el estado a texto
            const estadoTexto = beneficiario.Estado === 0 ? 'Activo' : 'Inactivo';

            contenido += `<tr>` +
                `<td>${beneficiario.Documento}</td>` +
                `<td>${beneficiario.Nombres}</td>` +
                `<td>${beneficiario.Telefono}</td>` +
                `<td>${beneficiario.Correo}</td>` +
                `<td>${estadoTexto}</td>` +
                `<td style="text-align: center;">
                    <div class="centered-container">
                        <a href="editarBeneficiario?id=${beneficiario.IdUsuario}"><i class="fa-regular fa-pen-to-square fa-xl me-2"></i></a>
                        <a href="detalleBeneficiario?id=${beneficiario.IdUsuario}"><i class="fa-regular fa-eye fa-xl me-2"></i></a>
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

document.addEventListener('DOMContentLoaded', listarBeneficiarios);



//REGISTRAR BENEFICIARIOS

async function inicializarBusquedaBeneficiario() {
    document.getElementById('buscarBeneficiario').addEventListener('input', async function(event) {
        const documento = event.target.value;
        const resultadosBusqueda = document.getElementById('resultadosBusqueda');
        resultadosBusqueda.innerHTML = ''; // Limpiar resultados anteriores

        if (documento.length >= 3) { // Realizar la búsqueda si hay al menos 3 caracteres
            const usuarios = await buscarUsuariosPorDocumento(documento);

            if (usuarios && usuarios.length > 0) {
                usuarios.forEach(usuario => {
                    const item = document.createElement('a');
                    item.classList.add('list-group-item', 'list-group-item-action');
                    item.textContent = `${usuario.Documento} - ${usuario.Nombres} ${usuario.Apellidos}`;
                    item.addEventListener('click', () => {
                        document.getElementById('beneficiario').value = usuario.IdUsuario;
                        document.getElementById('buscarBeneficiario').value = usuario.Documento;
                        resultadosBusqueda.innerHTML = '';
                        document.getElementById('beneficiarioHelp').textContent = `Usuario seleccionado: ${usuario.Nombres} ${usuario.Apellidos}`;
                    });
                    resultadosBusqueda.appendChild(item);
                });
            } else {
                const item = document.createElement('div');
                item.classList.add('list-group-item');
                item.textContent = 'No se encontraron coincidencias';
                resultadosBusqueda.appendChild(item);
            }
        }
    });

    // Función de búsqueda de usuarios por documento (excluyendo beneficiarios)
    const buscarUsuariosPorDocumento = async (documento) => {
        try {
            const response = await fetch(`http://localhost:3000/api/usuarios/buscar/${documento}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('No se encontraron coincidencias');
            }

            const usuarios = await response.json();
            return usuarios;

        } catch (error) {
            console.error('Error:', error.message);
        }
    };
}

// Funciones de registro combinadas
async function registrar() {
    const formBeneficiario = document.getElementById('formularioRegistro');

    // Obtener los valores del formulario de beneficiario
    const formDataBeneficiario = new FormData(formBeneficiario);
    const dataBeneficiario = Object.fromEntries(formDataBeneficiario.entries());

    // Estructura de los datos para la API
    const usuario = {
        Documento: dataBeneficiario.documento,
        TipoDocumento: dataBeneficiario.tipoDocumento,
        Nombres: dataBeneficiario.nombres,
        Apellidos: dataBeneficiario.apellidos,
        Correo: dataBeneficiario.correo,
        Telefono: dataBeneficiario.telefono,
        FechaDeNacimiento: dataBeneficiario.fechaDeNacimiento,
        Direccion: dataBeneficiario.direccion,
        Genero: dataBeneficiario.genero,
        Contrasena: dataBeneficiario.contrasena,
        Estado: dataBeneficiario.estado,
        Beneficiario: dataBeneficiario.beneficiario
    };

    console.log(usuario);

    // Estructura de los datos para la API de valoración médica
    const valoracionMedica = {
        TieneCondicionCronica: dataBeneficiario.TieneCondicionCronica,
        CirugiaPrevia: dataBeneficiario.CirugiaPrevia,
        AlergiasConocidas: dataBeneficiario.AlergiasConocidas,
        MedicamentosActuales: dataBeneficiario.MedicamentosActuales,
        LesionesMusculoesqueleticas: dataBeneficiario.LesionesMusculoesqueleticas,
        EnfermedadCardiacaVascular: dataBeneficiario.EnfermedadCardiacaVascular,
        AntecedentesFamiliares: dataBeneficiario.AntecedentesFamiliares,
        TipoAfiliacion: dataBeneficiario.TipoAfiliacion,
        IMC: dataBeneficiario.IMC
    };

    // Verificar que todos los campos obligatorios están llenos
    for (const [key, value] of Object.entries(usuario)) {
        if (!value) {
            console.error(`El campo ${key} está vacío`);
            Swal.fire({
                icon: "error",
                title: "¡Oops...",
                text: `Por favor, complete el campo ${key}`
            });
            return;
        }
    }

    for (const [key, value] of Object.entries(valoracionMedica)) {
        if (!value) {
            console.error(`El campo ${key} está vacío`);
            Swal.fire({
                icon: "error",
                title: "¡Oops...",
                text: `Por favor, complete el campo ${key}`
            });
            return;
        }
    }

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

            // Verificar si se debe asignar el rol de beneficiario (rol 4)
            const rolesAsignados = [{ IdRol: 4 }]; // Rol de beneficiario

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

                valoracionMedica.IdUsuario = usuarioId;

                try {
                    // Registrar valoración médica
                    const valoracionResponse = await fetch('http://localhost:3000/api/valoracionesMedicas', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(valoracionMedica)
                    });

                    const valoracionResult = await valoracionResponse.json();

                    if (valoracionResponse.ok) {
                        Swal.fire({
                            title: "¡Excelente!",
                            text: "Beneficiario y Valoración Médica Registrados Correctamente!",
                            icon: "success"
                        }).then(() => {
                            location.reload();
                        });
                    } else {
                        console.log('Error al registrar la valoración médica: ' + valoracionResult.message);
                        Swal.fire({
                            icon: "error",
                            title: "¡Oops...",
                            text: "Ocurrió un error al registrar la valoración médica"
                        });
                    }
                } catch (error) {
                    console.error('Error:', error);
                    Swal.fire({
                        icon: "error",
                        title: "¡Oops...",
                        text: "Ocurrió un error al registrar la valoración médica"
                    });
                }
            } else {
                Swal.fire({
                    icon: "error",
                    title: "¡Oops...",
                    text: "Ingresa los datos correctos"
                });
                console.log('Error al asignar roles al usuario');
            }
        } else {
            console.log('Error al registrar el usuario: ' + result.message);
            Swal.fire({
                icon: "error",
                title: "¡Oops...",
                text: result.message
            });
        }
    } catch (error) {
        console.error('Error:', error);
        console.log('Ocurrió un error al registrar el usuario');
        Swal.fire({
            icon: "error",
            title: "¡Oops...",
            text: "Ocurrió un error al registrar el usuario"
        });
    }
}

// EDITAR BENEFICIARIO
async function inicializarDatosEditarBeneficiario() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');

        if (!id) {
            console.error('ID del cliente no encontrado en la URL');
            Swal.fire({
                icon: "error",
                title: "¡Oops...",
                text: "ID del cliente no encontrado en la URL"
            });
            return;
        }

        // Obtener los datos del cliente
        const response = await fetch(`http://localhost:3000/api/usuarios/${id}`);
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

        // Obtener el beneficiario actual y buscar sus datos
        if (cliente.Beneficiario) {
            const beneficiarioResponse = await fetch(`http://localhost:3000/api/usuarios/${cliente.Beneficiario}`);
            if (beneficiarioResponse.ok) {
                const beneficiario = await beneficiarioResponse.json();
                document.getElementById('beneficiario').value = beneficiario.IdUsuario;
                document.getElementById('buscarBeneficiario').value = beneficiario.Documento;
                document.getElementById('beneficiarioHelp').textContent = `Usuario seleccionado: ${beneficiario.Nombres} ${beneficiario.Apellidos}`;
            }
        }

        // Añadir event listener para la búsqueda del beneficiario
        document.getElementById('buscarBeneficiario').addEventListener('input', async function(event) {
            const documento = event.target.value;
            const resultadosBusqueda = document.getElementById('resultadosBusqueda');
            resultadosBusqueda.innerHTML = ''; // Limpiar resultados anteriores

            if (documento.length >= 3) { // Realizar la búsqueda si hay al menos 3 caracteres
                const usuarios = await buscarUsuariosPorDocumento(documento);

                if (usuarios && usuarios.length > 0) {
                    usuarios.forEach(usuario => {
                        const item = document.createElement('a');
                        item.classList.add('list-group-item', 'list-group-item-action');
                        item.textContent = `${usuario.Documento} - ${usuario.Nombres} ${usuario.Apellidos}`;
                        item.addEventListener('click', () => {
                            document.getElementById('beneficiario').value = usuario.IdUsuario;
                            document.getElementById('buscarBeneficiario').value = usuario.Documento;
                            resultadosBusqueda.innerHTML = '';
                            document.getElementById('beneficiarioHelp').textContent = `Usuario seleccionado: ${usuario.Nombres} ${usuario.Apellidos}`;
                        });
                        resultadosBusqueda.appendChild(item);
                    });
                } else {
                    const item = document.createElement('div');
                    item.classList.add('list-group-item');
                    item.textContent = 'No se encontraron coincidencias';
                    resultadosBusqueda.appendChild(item);
                }
            }
        });

    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            icon: "error",
            title: "¡Oops...",
            text: "Ocurrió un error al inicializar los datos del beneficiario"
        });
    }
}

const buscarUsuariosPorDocumento = async (documento) => {
    try {
        const response = await fetch(`http://localhost:3000/api/usuarios/buscar/${documento}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('No se encontraron coincidencias');
        }

        const usuarios = await response.json();
        return usuarios;

    } catch (error) {
        console.error('Error:', error.message);
        Swal.fire({
            icon: "error",
            title: "¡Oops...",
            text: "Ocurrió un error al buscar usuarios"
        });
    }
};

// Función para redirigir a la página de edición de valoración médica
function redirigirValoracionMedica() {
    const usuarioId = document.getElementById('clienteId').value;
    window.location.href = `editarValoracionMedica?id=${usuarioId}`;
}

// Función para calcular el IMC
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

async function editarBeneficiario() {
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
            Beneficiario: data.beneficiario || currentData.Beneficiario // Actualizar beneficiario
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

        console.log('Datos del cliente actualizados correctamente');
        Swal.fire({
            title: "¡Excelente!",
            text: "Beneficiario Actualizado Correctamente!",
            icon: "success",
        }).then(() => {
            window.location.href = '/beneficiarios';
        });

        document.querySelectorAll('.formularioEditar__grupo-correcto').forEach((icono) => {
            icono.classList.remove('formularioEditar__grupo-correcto');
        });
        
    } catch (error) {
        console.error('Error:', error);
        console.log('Error al actualizar los datos del cliente');
        Swal.fire({
            icon: "error",
            title: "¡Oops...",
            text: "Ingresa los datos correctos"
        });
    }
}


//VER DETALLE BENEFICIARIOS
async function cargarDatosBeneficiario() {
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

            const estadoTexto = cliente.Estado === 0 ? 'Activo' : 'Inactivo';
            const fechaNacimiento = new Date(cliente.FechaDeNacimiento);
            const formattedFechaNacimiento = `${fechaNacimiento.getDate().toString().padStart(2, '0')}/${(fechaNacimiento.getMonth() + 1).toString().padStart(2, '0')}/${fechaNacimiento.getFullYear()}`;

            document.getElementById('documentoCliente').value = cliente.Documento;
            document.getElementById('nombreCliente').value = cliente.Nombres;
            document.getElementById('emailCliente').value = cliente.Correo;
            document.getElementById('TelefonoCliente').value = cliente.Telefono;
            document.getElementById('direccionCliente').value = cliente.Direccion;
            document.getElementById('apellidosCliente').value = cliente.Apellidos;
            document.getElementById('tipoDocumentoCliente').value = cliente.TipoDocumento;
            document.getElementById('fechaNacimientoCliente').value = formattedFechaNacimiento;
            document.getElementById('estadoCliente').value = estadoTexto;
            document.getElementById('generoCliente').value = cliente.Genero;

            // Obtener los datos de la valoración médica por ID de usuario
            const valoracionResponse = await fetch(`http://localhost:3000/api/valoracionesMedicas/usuario/${id}`, {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!valoracionResponse.ok) {
                throw new Error('Error al obtener los detalles de la valoración médica');
            }

            const valoraciones = await valoracionResponse.json();

            if (valoraciones.length > 0) {
                const valoracion = valoraciones[0]; // Suponiendo que solo hay una valoración por usuario
                document.getElementById('TieneCondicionCronica').value = valoracion.TieneCondicionCronica;
                document.getElementById('CirugiaPrevia').value = valoracion.CirugiaPrevia;
                document.getElementById('AlergiasConocidas').value = valoracion.AlergiasConocidas;
                document.getElementById('MedicamentosActuales').value = valoracion.MedicamentosActuales;
                document.getElementById('LesionesMusculoesqueleticas').value = valoracion.LesionesMusculoesqueleticas;
                document.getElementById('EnfermedadCardiacaVascular').value = valoracion.EnfermedadCardiacaVascular;
                document.getElementById('AntecedentesFamiliares').value = valoracion.AntecedentesFamiliares;
                document.getElementById('TipoAfiliacion').value = valoracion.TipoAfiliacion;
                document.getElementById('Peso').value = valoracion.Peso;
                document.getElementById('Altura').value = valoracion.Altura;
                document.getElementById('IMC').value = valoracion.IMC;
            } else {
                console.error('No se encontró una valoración médica para el usuario con ID:', id);
            }

            // Verificar si el usuario tiene un beneficiario asociado
            if (cliente.Beneficiario) {
                const beneficiarioResponse = await fetch(`http://localhost:3000/api/usuarios/${cliente.Beneficiario}`, {
                    method: 'GET',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!beneficiarioResponse.ok) {
                    throw new Error('Error al obtener los detalles del cliente asociado');
                }

                const beneficiario = await beneficiarioResponse.json();

                const estadoAsociadoTexto = beneficiario.Estado === 0 ? 'Activo' : 'Inactivo';
                const fechaNacimientoAsociado = new Date(beneficiario.FechaDeNacimiento);
                const formattedFechaNacimientoAsociado = `${fechaNacimientoAsociado.getDate().toString().padStart(2, '0')}/${(fechaNacimientoAsociado.getMonth() + 1).toString().padStart(2, '0')}/${fechaNacimientoAsociado.getFullYear()}`;

                document.getElementById('acordeonCliente').style.display = 'block';
                document.getElementById('documentoAsociado').value = beneficiario.Documento;
                document.getElementById('nombreAsociado').value = beneficiario.Nombres;
                document.getElementById('emailAsociado').value = beneficiario.Correo;
                document.getElementById('TelefonoAsociado').value = beneficiario.Telefono;
                document.getElementById('direccionAsociado').value = beneficiario.Direccion;
                document.getElementById('apellidosAsociado').value = beneficiario.Apellidos;
                document.getElementById('tipoDocumentoAsociado').value = beneficiario.TipoDocumento;
                document.getElementById('fechaNacimientoAsociado').value = formattedFechaNacimientoAsociado;
                document.getElementById('estadoAsociado').value = estadoAsociadoTexto;
                document.getElementById('generoAsociado').value = beneficiario.Genero;
            }
        } catch (error) {
            console.error('Error:', error.message);
            // Manejar el error en caso necesario
        }
    }
}

document.addEventListener('DOMContentLoaded', cargarDatosBeneficiario);
