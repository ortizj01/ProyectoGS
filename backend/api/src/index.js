import express from 'express';
import cors from 'cors';
import ejerciciosRoutes from './routes/ejercicios.routes.js';
import indexRoutes from './routes/index.routes.js';
import rolesRoutes from './routes/roles.routes.js';
import permisosRoutes from './routes/permisos.routes.js';
import permisosRolesRoutes from './routes/permisosRoles.routes.js';
import usuarioRolRoutes from './routes/usuarioRol.routes.js';
import usuariosRoutes from './routes/usuario.routes.js';
import ventasRouter from './routes/ventas.router.js';
import ventasProductosRouter from './routes/ventas.productos.routes.js';
import ventasMembresiaRoutes from './routes/ventas.membresia.routes.js';
import productosRouter from './routes/productos.routes.js';
import membresiaRouter from './routes/membresia.routes.js';


const app = express();

app.use(cors());
app.use(express.json());

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
app.use(indexRoutes);

app.listen(3000, () => {
    console.log('Servidor ejecutándose en el puerto 3000');
});