const url = 'http://localhost:3000/api/roles';

document.addEventListener('DOMContentLoaded', () => {
    cargarRoles();

    const formularioRol = document.getElementById('FormularioRol');
    if (formularioRol) {
        formularioRol.addEventListener('submit', async (event) => {
            event.preventDefault();
            const nombreRol = document.getElementById('nombreRol').value;
            const estadoRol = document.getElementById('estado').value;

            const rol = {
                NombreRol: nombreRol,
                EstadoRol: parseInt(estadoRol)
            };

            await crearRol(rol);
            cargarRoles();
        });
    }

    const editRolForm = document.getElementById('editRolForm');
    if (editRolForm) {
        editRolForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const nombreRol = document.getElementById('editNombreRol').value;
            const estadoRol = document.getElementById('editEstado').value;
            const rolId = document.getElementById('editIdRol').value;

            const rol = {
                NombreRol: nombreRol,
                EstadoRol: parseInt(estadoRol)
            };

            await editarRol(rolId, rol);
            $('#editarRolModal').modal('hide');
            cargarRoles();
        });
    }
});

async function cargarRoles() {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Error en la solicitud: ' + response.statusText);

        const roles = await response.json();
        const contenidoRoles = document.getElementById('contenidoRoles');
        if (contenidoRoles) {
            contenidoRoles.innerHTML = '';
            roles.forEach(rol => {
                contenidoRoles.innerHTML += `
                    <tr>
                        <td>${rol.IdRol}</td>
                        <td>${rol.NombreRol}</td>
                        <td>${rol.EstadoRol === 1 ? 'Activo' : 'Inactivo'}</td>
                        <td>
                            <div class="centered-container">
                                <i class="fa-regular fa-pen-to-square fa-xl me-2" 
                                    data-bs-toggle="modal" 
                                    data-bs-target="#editarRolModal" 
                                    onclick="cargarDatosEditar(${rol.IdRol})">
                                </i>
                                <i class="fa-solid fa-trash fa-xl me-2 trash-icon"
                                    onclick="eliminarRol(${rol.IdRol})"></i>
                            </div>
                        </td>
                    </tr>
                `;
            });
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function crearRol(rol) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(rol)
        });
        if (!response.ok) throw new Error('Error en la solicitud: ' + response.statusText);
    } catch (error) {
        console.error('Error:', error);
    }
}

async function cargarDatosEditar(id) {
    try {
        const response = await fetch(`${url}/${id}`);
        if (!response.ok) throw new Error('Error en la solicitud: ' + response.statusText);

        const rol = await response.json();
        document.getElementById('editIdRol').value = rol.IdRol;
        document.getElementById('editNombreRol').value = rol.NombreRol;
        document.getElementById('editEstado').value = rol.EstadoRol;
        $('#editarRolModal').modal('show');
        document.getElementById('editarRolModalLabel').innerText = 'Editar Rol';
    } catch (error) {
        console.error('Error fetching or parsing data:', error);
    }
}

async function editarRol(id, rol) {
    try {
        const response = await fetch(`${url}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(rol)
        });
        if (!response.ok) throw new Error('Error en la solicitud: ' + response.statusText);
    } catch (error) {
        console.error('Error:', error);
    }
}

async function eliminarRol(id) {
    if (confirm('¿Estás seguro de que quieres eliminar este rol?')) {
        try {
            const response = await fetch(`${url}/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Error en la solicitud: ' + response.statusText);
            cargarRoles();
        } catch (error) {
            console.error('Error:', error);
        }
    }
}
