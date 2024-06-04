import express from 'express';
import cors from 'cors';
import ejerciciosRoutes from './routes/ejercicios.routes.js';
import indexRoutes from './routes/index.routes.js';
import rolesRoutes from './routes/roles.routes.js';
import permisosRoutes from './routes/permisos.routes.js';
import permisosRolesRoutes from './routes/permisosRoles.routes.js';
import usuarioRolRoutes from './routes/usuarioRol.routes.js';
import usuariosRoutes from './routes/usuario.routes.js';


const app = express()

app.use(cors());

app.use('/api', rolesRoutes)
app.use('/api', permisosRoutes)
app.use('/api', permisosRolesRoutes)
app.use('/api', usuarioRolRoutes)
app.use('/api', usuariosRoutes);
app.use('/api', ejerciciosRoutes)
app.use(indexRoutes)

app.listen(3000)
console.log('Servidor ejecutandose en el port 3000'); 