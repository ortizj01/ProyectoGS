const express = require('express')
const path = require('path') //Trabajar con rutas
const hbs = require('hbs') //Incorporar motor de plantillas

const formArray = [];
const app = express()
const port = 8086

// Configuración del middleware para analizar datos POST
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'))

// Asignar la ubicacion de los archivos hbs
app.set('views', path.join(__dirname+'/public/views'))
// Ingenieria de las vistas hbs
app.set('view engine', 'hbs')
// Configuracion del directorio que guardara los archivos partials hbs
hbs.registerPartials(__dirname + '/public/views/partials')

app.get('/', (req, res)=>{
    res.render('index', {
        "nombre":"Juan Ortiz",
        "email":"juanes@gmail.com"
    })//Redireccionar hacia el archivo hbs
})

// INICIO GESTION ACCESO *JUANES*
app.get('/ingresar', (req, res)=>{
    res.render('auth/sign-in')
})

app.get('/registrar-usuario', (req, res)=>{
    res.render('auth/sign-up')
})

app.get('/recuperar-contrasena', (req, res)=>{
    res.render('auth/recoverpw')
})

app.get('/confirmacion', (req, res)=>{
    res.render('auth/confirm-mail')
})

app.get('/perfil', (req, res)=>{
    res.render('auth/user-account-setting')
})

app.get('/restablecer', (req, res)=>{
    res.render('auth/new-password')
})

// FIN GESTION ACCESO

// INICIO COMPRAS *ALEJANDRO*

app.get('/Proveedores', (req, res)=>{
    res.render('Proveedores')
})

app.get('/Compras', (req, res)=>{
    res.render('Compras')
})

app.get('/Productos', (req, res)=>{
    res.render('Productos')
})

app.get('/Devolucioncom', (req, res)=>{
    res.render('Devolucioncom')
})

app.get('/Categoriaprod', (req, res)=>{
    res.render('Categoriaprod')
})

app.get('/formDevolucioncom', (req, res)=>{
    res.render('formDevolucioncom')
})

app.get('/formproveedores', (req, res)=>{
    res.render('formproveedores')
})

app.get('/formcompras', (req, res)=>{
    res.render('formcompras')
})

app.get('/formproductos', (req, res)=>{
    res.render('formproductos')
})

app.get('/DevolucionEditar', (req, res)=>{
    res.render('DevolucionEditar')
})

app.get('/ProductosEditar', (req, res)=>{
    res.render('ProductosEditar')
})

app.get('/ProveedoresEditar', (req, res)=>{
    res.render('ProveedoresEditar')
})


// FIN COMPRAS


// INICIO SERVICIOS

//WEIMAR

app.get('/usuariosAdmin', (req, res)=>{
    res.render('usuariosAdmin')
})
app.get('/formUsuarios.hbs', (req, res)=>{
    res.render('formUsuarios.hbs')
})
app.get('/formUsuariosModal', (req, res)=>{
    res.render('formUsuariosModal')
})
app.get('/detalleUSuario', (req, res)=>{
    res.render('detalleUsuario')
})
app.get('/usuariosEntrenador', (req, res)=>{
    res.render('usuariosEntrenador')
})

app.get('/serviciosAdmin', (req, res)=>{
    res.render('serviciosAdmin')
})

app.get('/serviciosEntrenador', (req, res)=>{
    res.render('serviciosEntrenador')
})


app.get('/membresiasAdmin', (req, res)=>{
    res.render('membresiasAdmin')
})

app.get('/membresiasEntrenador', (req, res)=>{
    res.render('membresiasEntrenador')
})

app.get('/membresiasCliente', (req, res)=>{
    res.render('membresiasCliente')
})

// INICIO RUTINA *JUANES*

//Rutinas

app.get('/rutinas', (req, res)=>{
    res.render('rutinas');
});

app.get('/nueva-rutina', (req, res)=>{
    res.render('formRutina')
});

app.get('/agenda-servicios', (req, res) => {
    res.render('calendario')
});

//Ejercicios

app.get('/ejercicios', (req, res)=>{
    res.render('ejercicios_views/tablaEjercicios');
});

app.get('/nuevo-ejercicio', (req, res)=>{
    res.render('ejercicios_views/formEjercicio');
});
app.get('/editarEjercicio', (req, res)=>{
    res.render('ejercicios_views/editarEjercicio');
});

//eventos
app.get('/eventos', (req, res)=>{
    res.render('eventos/calendario');
});


//




// FIN SERVICIOS


// ROLES *JOHANY* 

app.get('/roles', (req, res)=>{
    res.render('roles')
})

app.get('/CrearRol', (req, res)=>{
    res.render('CrearRol')
})

//PRUEBAS TABLAS


//FIN PRUEBA

// FIN ROLES

// Inicio Ventas *YONIER*

// Inicio Ventas *YONIER*

app.get('/clientes', (req, res)=>{
    res.render('clientes/clientes')
})
app.get('/beneficiarios', (req, res)=>{
    res.render('beneficiarios/beneficiarios')
})
app.get('/formularioCliente', (req, res)=>{
    res.render('clientes/formularioCliente')
})
app.get('/detalleCliente', (req, res)=>{
    res.render('clientes/detalleCliente')
})
app.get('/editarCliente', (req, res)=>{
    res.render('clientes/editarCliente')
})
app.get('/detalleBeneficiario', (req, res)=>{
    res.render('beneficiarios/detalleBeneficiario')
})
app.get('/formularioBeneficiario', (req, res)=>{
    res.render('beneficiarios/formularioBeneficiario')
})
app.get('/pedidos', (req, res)=>{
    res.render('pedidos/pedidos')
})
app.get('/editarPedido', (req, res)=>{
    res.render('pedidos/editarPedido')
})
app.get('/detallePedido', (req, res)=>{
    res.render('pedidos/detallePedido')
})


// JOHANY

app.get('/GestionVentas', (req, res)=>{
    res.render('GestionVentas')
})

app.get('/GestionDevoluciones', (req, res)=>{
    res.render('GestionDevoluciones')
})

app.get('/formulDevolucion', (req, res)=>{
    res.render('formulDevolucion')
})

app.get('/formuVenta', (req, res)=>{
    res.render('formuVenta')
})


// FIN JOHANY


//Fin Ventas


// Fin rutinas

app.get('/plantilla', (req, res)=>{
    res.render('plantilla')
})

app.get('*', (req, res)=>{
    res.render('404')
})

app.listen(port, () => {
    console.log(`Escuchado por el puerto ${port}`)
})