import express from 'express';
import cors from 'cors';
import indexRoutes from './routes/index.routes.js';
import rolesRoutes from './routes/roles.routes.js';
import permisosRoutes from './routes/permisos.routes.js';
import permisosRolesRoutes from './routes/permisosRoles.routes.js';
import usuarioRolRoutes from './routes/usuarioRol.routes.js';
import UsuariosRoutes from './routes/Usuarios.routes.js';
import ventasRouter from './routes/ventas.router.js';
import ventasProductosRouter from './routes/ventas.productos.routes.js';
import ventasMembresiaRoutes from './routes/ventas.membresia.routes.js';
import productosRouter from './routes/productos.routes.js';
import membresiaRouter from './routes/membresia.routes.js';
import devolucionVentasRoutes from './routes/devolucion.ventas.routes.js';
import devolucionVentasProductosRoutes from './routes/devolucion.ventas.productos.routes.js';

//JUAN ORTIZ
import authRoutes from './routes/auth.routes.js'
import ejerciciosRoutes from './routes/ejercicios.routes.js';
import rutinasRoutes from './routes/rutinas.routes.js';
import eventosRoutes from './routes/eventos.routes.js';
import detalleRutinasRouter from './routes/detalleRutinas.routes.js';


const app = express();

app.use(cors());
app.use(express.json());


//RUTAS JUAN
// Rutas
app.use('/api/auth', authRoutes);
app.use('/api', UsuariosRoutes)

app.use('/api', ejerciciosRoutes);
app.use('/api', rutinasRoutes);
app.use('/api', eventosRoutes);
app.use('/api', detalleRutinasRouter);


//ROLES
app.use('/api', rolesRoutes);
app.use('/api', permisosRoutes);
app.use('/api', permisosRolesRoutes);
app.use('/api', usuarioRolRoutes);
app.use('/api', usuariosRoutes);
app.use('/api', ejerciciosRoutes);

//VENTAS
app.use('/api', ventasRouter);
app.use('/api', ventasProductosRouter);
app.use('/api', ventasMembresiaRoutes);
app.use('/api', productosRouter);
app.use('/api', membresiaRouter);

//DEVOLUCIONES VENTAS
app.use('/api', devolucionVentasRoutes);
app.use('/api', devolucionVentasProductosRoutes);
app.use(indexRoutes);

app.listen(3000, () => {
    console.log('Servidor ejecutándose en el puerto 3000');
});