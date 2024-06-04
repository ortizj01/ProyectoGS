const url = 'http://localhost:3000/api/roles';

// Función para listar roles
const listarRoles = async () => {
    try {
        const response = await fetch(url);
        const roles = await response.json();

        const contenidoRoles = document.getElementById('contenidoRoles');
        contenidoRoles.innerHTML = '';

        roles.forEach(rol => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${rol.IdRol}</td>
                <td>${rol.NombreRol}</td>
                <td>${rol.EstadoRol ? 'Activo' : 'Inactivo'}</td>
                <td>
                    <div class="centered-container">
                        <i class="fa-regular fa-pen-to-square fa-xl me-2" 
                            data-bs-toggle="modal" 
                            data-bs-target="#editarRolModal" 
                            onclick="cargarDatosEditar(${rol.IdRol})">
                        </i>
                    <i class="fa-solid fa-trash fa-xl me-2 trash-icon"
                        data-bs-toggle="modal" data-bs-target="#confirmDeleteModal"></i>
                </td>
            `;
            contenidoRoles.appendChild(row);
        });
        

        // Agregar eventos para los modales
        const editarModalEl = document.getElementById('editarRolModal');
        const eliminarModalEl = document.getElementById('eliminarRolModal');

        editarModalEl.addEventListener('show.bs.modal', async (event) => {
            const idRol = event.relatedTarget.getAttribute('data-bs-id');
            await cargarDatosEditar(idRol);
        });

        eliminarModalEl.addEventListener('show.bs.modal', async (event) => {
            const idRol = event.relatedTarget.getAttribute('data-bs-id');
            await cargarDatosEliminar(idRol);
        });
    } catch (error) {
        console.error('Error:', error);
    }
};

// Función para cargar datos en el modal de edición
const cargarDatosEditar = async (idRol) => {
    try {
        const response = await fetch(`${url}/${idRol}`);
        const rol = await response.json();

        document.getElementById('idRol').value = rol.IdRol;
        document.getElementById('nombreRol').value = rol.NombreRol;
        document.getElementById('estadoRol').value = rol.EstadoRol;
    } catch (error) {
        console.error('Error:', error);
    }
};

// Función para cargar datos en el modal de eliminación
const cargarDatosEliminar = async (idRol) => {
    try {
        const response = await fetch(`${url}/${idRol}`);
        const rol = await response.json();

        document.getElementById('idRolEliminar').value = rol.IdRol;
        document.getElementById('nombreRolEliminar').value = rol.NombreRol;
    } catch (error) {
        console.error('Error:', error);
    }
};

// Función para registrar un rol
const registrarRol = async (event) => {
    event.preventDefault();
    const rol = {
        NombreRol: document.getElementById('nombreRol').value,
        EstadoRol: document.getElementById('estadoRol').value
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(rol)
        });

        if (!response.ok) {
            throw new Error('Error al registrar el rol');
        }

        listarRoles();
        $('#editarRolModal').modal('hide');
    } catch (error) {
        console.error('Error:', error);
    }
};

// Función para actualizar un rol
const actualizarRol = async (event) => {
    event.preventDefault();
    const rol = {
        IdRol: document.getElementById('idRol').value,
        NombreRol: document.getElementById('nombreRol').value,
        EstadoRol: document.getElementById('estadoRol').value
    };

    try {
        const response = await fetch(`${url}/${rol.IdRol}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(rol)
        });

        if (!response.ok) {
            throw new Error('Error al actualizar el rol');
        }

        listarRoles();
        $('#editarRolModal').modal('hide');
    } catch (error) {
        console.error('Error:', error);
    }
};

// Función para eliminar un rol
const eliminarRol = async (event) => {
    event.preventDefault();
    const idRol = document.getElementById('idRolEliminar').value;

    try {
        const response = await fetch(`${url}/${idRol}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error al eliminar el rol');
        }

        listarRoles();
        $('#eliminarRolModal').modal('hide');
    } catch (error) {
        console.error('Error:', error);
    }
};

// Eventos
document.addEventListener('DOMContentLoaded', listarRoles);
document.getElementById('btnActualizarRol').addEventListener('click', actualizarRol);
document.getElementById('btnEliminarRol').addEventListener('click', eliminarRol);