// Función para obtener el rol del usuario loggeado

function obtenerRol(data) {
    if (data && data.Rol) {
        console.log('Rol del usuario loggeado:', data.Rol);
        return data.Rol;
    } else {
        console.error('No se pudo obtener el rol del usuario. Datos recibidos:', data);
        return null;
    }
}

// Función para obtener y mostrar información del usuario
function mostrarInformacionUsuario() {
    const url3 = "http://localhost:3000/api/permisoRolesDetallePrincipal";
    const token = localStorage.getItem('token');

    if (!token) {
        console.error('No token found in localStorage');
        return;
    }

    fetch('http://localhost:3000/api/auth/usuario-autenticado', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-token': token
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Hubo un problema al obtener la información del usuario.');
        }
        return response.json();
    })
    
    .then(data => {
        console.log('Datos del usuario recibidos:', data); // Verificar los datos recibidos
            // Actualizar el nombre y el rol del usuario en la topbar
            if (document.getElementById('userName')) {
                document.getElementById('userName').textContent = data.Nombres || '';
            }
            if (document.getElementById('userRole')) {
                document.getElementById('userRole').textContent = data.Rol || ''; // Asegúrate de que esta clave coincide con los datos devueltos
            }

            // Llenar el formulario con los datos del usuario
            llenarFormularioUsuario(data);


        fetch(`${url3}/${data.IdRol}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-token': token // Añadido el token a la segunda solicitud
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Hubo un problema al obtener los datos del rol.');
            }
            return response.json();
        })
        .then(roleDataArray => {
            console.log('Datos del rol recibidos:', roleDataArray);

            //Buscar permisos
            const permisoProveedores = roleDataArray.find(permiso => permiso.NombrePermiso === "Proveedores");
            const permisoCategoriaProductos = roleDataArray.find(permiso => permiso.NombrePermiso === "CategoriaProductos");
            const permisoProductos = roleDataArray.find(permiso => permiso.NombrePermiso === "Productos");
            const permisoCompras = roleDataArray.find(permiso => permiso.NombrePermiso === "Compras");
            const permisoDevolucionCompra = roleDataArray.find(permiso => permiso.NombrePermiso === "DevolucionCompra");
            const permisoRutinas = roleDataArray.find(permiso => permiso.NombrePermiso === "Rutinas");
            const permisoEventos = roleDataArray.find(permiso => permiso.NombrePermiso === "Eventos");
            const permisoEjercicios = roleDataArray.find(permiso => permiso.NombrePermiso === "Ejercicios");
            // const permisoGestionVentas = roleDataArray.find(permiso => permiso.NombrePermiso === "GestionVentas");
            // const permisoDevolucionesVentas = roleDataArray.find(permiso => permiso.NombrePermiso === "DevolucionesVentas");
            // const permisoClientes = roleDataArray.find(permiso => permiso.NombrePermiso === "Clientes");
            // const permisoBeneficiarios = roleDataArray.find(permiso => permiso.NombrePermiso === "Beneficiarios");
            // const permisoPedidos = roleDataArray.find(permiso => permiso.NombrePermiso === "Pedidos");
            // const permisoCarrito = roleDataArray.find(permiso => permiso.NombrePermiso === "Carrito");
            // const permisoServicios = roleDataArray.find(permiso => permiso.NombrePermiso === "Servicios");
            // const permisoUsuarios = roleDataArray.find(permiso => permiso.NombrePermiso === "Usuarios");
            // const permisoMembresias = roleDataArray.find(permiso => permiso.NombrePermiso === "Membresias");


            // Elementos del sidebar
            const permisoElementoComprasPadre = document.getElementById("PadreCompra");
            const permisoElementoProveedores = document.getElementById("PermisoProveedores");
            const permisoElementoCategoriaProductos = document.getElementById("PermisoCategoriaProductos");
            const permisoElementoProductos = document.getElementById("PermisoProductos");
            const permisoElementoCompras = document.getElementById("PermisoCompras");
            const permisoElementoDevolucionCompra = document.getElementById("PermisoDevolucionCompra");

            const permisoElementoRutinas = document.getElementById("PermisoRutinas");
            const permisoElementoRutinasPadre = document.getElementById("ServicioPadre");
            const permisoElementoEventos = document.getElementById("PermisoEventos");
            const permisoElementoEventosCliente = document.getElementById("PermisoEventosCliente");
            const permisoElementoEjercicios = document.getElementById("PermisoEjercicios");

            // const permisoElementoGestionVentas = document.getElementById("PermisoGestionVentas");
            // const permisoElementoDevolucionesVentas = document.getElementById("PermisoDevolucionesVentas");
            // const permisoElementoClientes = document.getElementById("PermisoClientes");
            // const permisoElementoBeneficiarios = document.getElementById("PermisoBeneficiarios");
            // const permisoElementoPedidos = document.getElementById("PermisoPedidos");
            // const permisoElementoCarrito = document.getElementById("PermisoCarrito");
            // const permisoElementoServicios = document.getElementById("PermisoServicios");
            // const permisoElementoUsuarios = document.getElementById("PermisoUsuarios");
            // const permisoElementoMembresias = document.getElementById("PermisoMembresias");

            
            

            //botones crear
            const permisoBottonCrearEjercicio=document.getElementById("EjercicioBtnPermiso");
            const permisoBottonCrearRutina=document.getElementById("RutinaBtnPermiso");
            const permisoBottonCrearProveedor=document.getElementById("ProveedorBtnPermiso");
            const permisoBottonCrearCategoriaProducto=document.getElementById("CategoriaProductoBtnPermiso");
            const permisoBottonCrearProducto=document.getElementById("ProductoBtnPermiso");
            //const permisoBottonCrearCompra=document.getElementById("CompraBtnPermiso"); 
            const permisoBottonCrearEvento=document.getElementById("eventModal");
            

            //Permisos Editar
                //Ejercicios
            const permisoBottonheaderCrearEjercicio = document.getElementById("PermisoHeaderEjericios");
            const permisoBottnCrearEjercicio = document.querySelectorAll(".column-to-hide-ejercicio");

                //Cate Productos
            const permisoBottonheaderCrearCategoriaProducto = document.getElementById("PermisoHeaderCategoriaProducto");
            const permisoBottnCrearCrearCategoriaProducto = document.querySelectorAll(".column-to-hide-categoriaProducto");  

                //Proveedores
            const permisoBottonheaderCrearProveedor = document.getElementById("PermisoHeaderProveedor");
            const permisoBottnCrearProveedor = document.querySelectorAll(".column-to-hide-proveedor");  

                //Productos
            const permisoBottonheaderCrearProducto = document.getElementById("PermisoHeaderProducto");
            const permisoBottnCrearProducto = document.querySelectorAll(".column-to-hide-producto");     
            
            
            
            //Permisos SERVICIOS    
            if (permisoRutinas.NombrePermiso === "Rutinas" && permisoRutinas.Visualizar === 0 
                && permisoEjercicios.NombrePermiso === "Ejercicios" 
                && permisoEjercicios.Visualizar === 0
                && permisoEventos.Visualizar === 0) {
                    permisoElementoRutinasPadre.style.display = "none";
                        
                        }else{

                            //Permisos Eventos
                            if (permisoEventos.NombrePermiso === "Eventos" && permisoEventos.Visualizar === 0) {
                                permisoElementoEventos.style.display = "none";
                                permisoElementoEventosCliente.style.display = "none";
                            }else{
                                if (data.IdRol === 3) {
                                    permisoElementoEventos.style.display = "none";
                                }else{
                                    permisoElementoEventosCliente.style.display = "none";
                                }
                                
                        }

                            //Permisos Rutinas
                            if (permisoRutinas.NombrePermiso === "Rutinas" && permisoRutinas.Visualizar === 0) {
                                permisoElementoRutinas.style.display = "none";
                            } else {

                                if (permisoBottonCrearRutina != null) {
                                    if (permisoRutinas.Crear === 0) {
                                        console.log("dandole1 Ejercicio");
                                        permisoBottonCrearRutina.style.display = "none";
                                    }
                                }

                                if (permisoRutinas.Editar === 0) {
                                    console.log("dandole2 Ejercicio");
                                }
                        }
            

                //Permisos Ejercicios
                if (permisoEjercicios.NombrePermiso === "Ejercicios" && permisoEjercicios.Visualizar === 0) {
                    
                        permisoElementoEjercicios.style.display = "none";
                    
                } else {
                    if (permisoBottonCrearEjercicio != null) {
                        if (permisoEjercicios.Crear === 0) {
                            console.log("dandole1 Ejercicio");
                            permisoBottonCrearEjercicio.style.display = "none";
                        }
                    }

                    if (permisoEjercicios.Editar === 0) {
                        console.log("dandole2 Ejercicio");
                        if (permisoBottonheaderCrearEjercicio != null) {
                            permisoBottonheaderCrearEjercicio.style.display = "none";
                        }
                        
                        if (permisoBottnCrearEjercicio != null) {
                            permisoBottnCrearEjercicio.forEach(element => {
                                element.style.display = "none";
                            });
                            }
                        }
                    }
                }
                
                // Permisos COMPRAS
                if (permisoProveedores.NombrePermiso === "Proveedores" && permisoProveedores.Visualizar === 0 
                    && permisoCategoriaProductos.NombrePermiso === "CategoriaProductos" 
                    && permisoCategoriaProductos.Visualizar === 0
                    && permisoProductos.NombrePermiso === "Productos" 
                    && permisoProductos.Visualizar === 0
                    && permisoCompras.NombrePermiso === "Compras" 
                    && permisoCompras.Visualizar === 0
                    && permisoDevolucionCompra.NombrePermiso === "DevolucionCompra" 
                    && permisoDevolucionCompra.Visualizar === 0) {
                        permisoElementoComprasPadre.style.display = "none";
                            
                }else{
                //Permisos Proveedores
                if (permisoProveedores.NombrePermiso === "Proveedores" && permisoProveedores.Visualizar === 0) {
                    if (permisoElementoProveedores != null) {
                        permisoElementoProveedores.style.display = "none";
                    }
                } else {
                    if (permisoBottonCrearProveedor != null) {
                        if (permisoProveedores.Crear === 0) {
                            permisoBottonCrearProveedor.style.display = "none";
                        }
                    }

                    if (permisoProveedores.Editar === 0) {
                        if (permisoBottonheaderCrearProveedor != null) {
                            permisoBottonheaderCrearProveedor.style.display = "none";
                        }

                        if (permisoBottnCrearProveedor != null) {
                            permisoBottnCrearProveedor.forEach(element => {
                                element.style.display = "none";
                            });
                        }
                    }
                }

                //Permisos Categoria Productos
                if (permisoCategoriaProductos.NombrePermiso === "CategoriaProductos" && permisoCategoriaProductos.Visualizar === 0) {
                    if (permisoElementoCategoriaProductos != null) {
                        permisoElementoCategoriaProductos.style.display = "none";
                    }
                } else {
                    if (permisoBottonCrearCategoriaProducto != null) {
                        if (permisoCategoriaProductos.Crear === 0) {
                            permisoBottonCrearCategoriaProducto.style.display = "none";
                        }
                    }

                    if (permisoCategoriaProductos.Editar === 0) {
                        if (permisoBottonheaderCrearCategoriaProducto != null) {
                            permisoBottonheaderCrearCategoriaProducto.style.display = "none";
                        }

                        if (permisoBottnCrearCrearCategoriaProducto != null) {
                            permisoBottnCrearCrearCategoriaProducto.forEach(element => {
                                element.style.display = "none";
                            });
                        }
                    }
                }

                //Permisos Producto
                if (permisoProductos.NombrePermiso === "Productos" && permisoProductos.Visualizar === 0) {
                    if (permisoElementoProductos != null) {
                        permisoElementoProductos.style.display = "none";
                    }
                } else {
                    if (permisoBottonCrearProducto != null) {
                        if (permisoProductos.Crear === 0) {
                            permisoBottonCrearProducto.style.display = "none";
                        }
                    }

                    if (permisoProductos.Editar === 0) {
                        if (permisoBottonheaderCrearProducto != null) {
                            permisoBottonheaderCrearProducto.style.display = "none";
                        }

                        if (permisoBottnCrearProducto != null) {
                            permisoBottnCrearProducto.forEach(element => {
                                element.style.display = "none";
                            });
                        }
                    }
                }

                //Compras
                if (permisoCompras.NombrePermiso === "Compras" && permisoCompras.Visualizar === 0) {
                    if (permisoElementoCompras != null) {
                        permisoElementoCompras.style.display = "none";
                    }
                } 

                //Devoluciones
                if (permisoDevolucionCompra.NombrePermiso === "DevolucionCompra" && permisoDevolucionCompra.Visualizar === 0) {
                    if (permisoElementoDevolucionCompra != null) {
                        permisoElementoDevolucionCompra.style.display = "none";
                    }
                } 
            }

                })
                .catch(error => console.error('Error al obtener los datos del rol:', error));
            })
            .catch(error => {
                console.error('Error al obtener información del usuario:', error);
            });
        }




// Función para llenar el formulario con la información del usuario
function llenarFormularioUsuario(data) {
    console.log('Llenando el formulario con los siguientes datos:', data);

    // Llenar los campos del formulario con los datos del usuario
    if (document.getElementById('Nombres')) {
        document.getElementById('Nombres').value = data.Nombres || '';
    }
    if (document.getElementById('Apellidos')) {
        document.getElementById('Apellidos').value = data.Apellidos || '';
    }
    if (document.getElementById('Correo')) {
        document.getElementById('Correo').value = data.Correo || '';
    }
    if (document.getElementById('Telefono')) {
        document.getElementById('Telefono').value = data.Telefono || '';
    }
    if (document.getElementById('Documento')) {
        document.getElementById('Documento').value = data.Documento || ''; // Asegúrate de que esta clave coincide con los datos devueltos
    }

    // Manejo especial para la fecha de nacimiento (si se tiene disponible en el formato correcto)
    if (data.FechaDeNacimiento) {
        const fechaNacimiento = new Date(data.FechaDeNacimiento);
        const fechaFormateada = fechaNacimiento.toISOString().split('T')[0];
        if (document.getElementById('FechaDeNacimiento')) {
            document.getElementById('FechaDeNacimiento').value = fechaFormateada;
        }
    }

    if (document.getElementById('Direccion')) {
        document.getElementById('Direccion').value = data.Direccion || '';
    }

    // Seleccionar el género en el formulario
    if (data.Genero && document.getElementById('Genero')) {
        document.getElementById('Genero').value = data.Genero;
    }
}

// Llamar a la función al cargar el DOM
document.addEventListener('DOMContentLoaded', function() {
    mostrarInformacionUsuario();
});

// Función para cerrar sesión
async function cerrarSesion() {
    const token = localStorage.getItem('token'); // Asumiendo que el token está almacenado en localStorage
    if (!token) {
        console.error('No token found');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/auth/logout', { 
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Logout successful:', data);
        localStorage.removeItem('token'); // Elimina el token del almacenamiento local

        window.location.href = '/ingresar';
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
    }
}

if (document.getElementById('logoutButton')) {
    document.getElementById('logoutButton').addEventListener('click', cerrarSesion);
}







