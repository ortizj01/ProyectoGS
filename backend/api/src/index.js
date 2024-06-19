import express from 'express';
import cors from 'cors'; // Importar cors
import ejerciciosRoutes from './routes/ejercicios.routes.js';
import rutinasRoutes from './routes/rutinas.routes.js';
import eventosRoutes from './routes/eventos.routes.js';
import detalleRutinasRouter from './routes/detalleRutinas.routes.js';
import rolesUsuariosRoutes from './routes/rolCliente.routes.js'


//Alejo
import proveedoresRoutes from './routes/proveedores.routes.js'
import comprasRoutes from './routes/compras.routes.js'
import devolucionescomprasRoutes from './routes/devolucioncompras.routes.js'
import categoriasRoutes from './routes/categorias.routes.js'
import productosRoutes from './routes/productos.routes.js'
import comprasproductoRoutes from './routes/comprasproducto.routes.js'
import devolucioncomprasproductoRoutes from './routes/devolucionescomprasproducto.routes.js'
import indexRoutes from './routes/index.routes.js';

//Weiki
import UsuariosRoutes from "./routes/Usuarios.routes.js";
import serviciosRoutes from "./routes/Servicios.routes.js";
import membresiasRoutes from "./routes/Membresias.routes.js";

import authRoutes from './routes/auth.routes.js'

//nanis
import rolesRoutes from './routes/roles.routes.js';
import permisosRoutes from './routes/permisos.routes.js';
import permisosRolesRoutes from './routes/permisosRoles.routes.js';

import ventasRouter from './routes/ventas.router.js';
import ventasProductosRouter from './routes/ventas.productos.routes.js';
import ventasMembresiaRoutes from './routes/ventas.membresia.routes.js';

import usuarioRolRoutes from './routes/usuarioRol.routes.js';

//yonier
import valoracionMedicaRoutes from './routes/valoracionMedica.routes.js';

const app = express();


// Usar cors para permitir solicitudes desde cualquier origen
app.use(cors());

app.use(express.json()); // Middleware para parsear application/json

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api', rolesUsuariosRoutes);

app.use('/api', ejerciciosRoutes);
app.use('/api', rutinasRoutes);
app.use('/api', eventosRoutes);
app.use('/api', detalleRutinasRouter);
app.use('/api', UsuariosRoutes)

app.use(indexRoutes);



//Alejo

app.use('/api',proveedoresRoutes)
app.use('/api',productosRoutes)
app.use('/api',categoriasRoutes)
app.use('/api',comprasRoutes)
app.use('/api',devolucionescomprasRoutes)
app.use('/api',comprasproductoRoutes)
app.use('/api',devolucioncomprasproductoRoutes)

//weiki
app.use('/Api',serviciosRoutes)
app.use('/Api',membresiasRoutes)

//nanis
app.use('/api', ventasRouter);
app.use('/api', ventasProductosRouter);
app.use('/api', ventasMembresiaRoutes);

app.use('/api', usuarioRolRoutes)

app.use('/api', rolesRoutes);
app.use('/api', permisosRoutes);
app.use('/api', permisosRolesRoutes);

//yonier

app.use('/api', valoracionMedicaRoutes);



app.listen(3000, () => {
    console.log('Servidor ejecutandose en el puerto 3000');
});
