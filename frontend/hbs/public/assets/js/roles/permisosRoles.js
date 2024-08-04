const mostrarModulos = () => {
    const permisos = JSON.parse(localStorage.getItem('permisos'));

    if (!permisos) {
        return;
    }

    // Configuración
    if (permisos.includes('GESTION_ROLES')) {
        document.getElementById('sidebar-configuracion').style.display = 'block';
    } else {
        document.getElementById('sidebar-configuracion').style.display = 'none';
    }

    // Usuarios
    if (permisos.includes('GESTION_USUARIOS')) {
        document.getElementById('sidebar-usuario').style.display = 'block';
    } else {
        document.getElementById('sidebar-usuario').style.display = 'none';
    }

    // Servicios
    if (permisos.includes('GESTION_SERVICIOS')) {
        document.getElementById('sidebar-servicios').style.display = 'block';
    } else {
        document.getElementById('sidebar-servicios').style.display = 'none';
    }

    // Compras
    if (permisos.includes('GESTION_COMPRAS')) {
        document.getElementById('sidebar-compras').style.display = 'block';
    } else {
        document.getElementById('sidebar-compras').style.display = 'none';
    }
};

document.addEventListener('DOMContentLoaded', mostrarModulos);
