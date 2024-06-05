import express from 'express';
import cors from 'cors';
import ejerciciosRoutes from './routes/ejercicios.routes.js';
import indexRoutes from './routes/index.routes.js';
import pedidosRoutes from './routes/pedidos.routes.js';
import pedidosProductoRoutes from './routes/pedidosProducto.routes.js';
import pedidosMembresiaRoutes from './routes/pedidosMembresia.routes.js';
import valoracionMedicaRoutes from './routes/valoracionMedica.routes.js';
import usuarioRolRoutes from './routes/usuarioRol.routes.js';
import UsuariosRoutes from "./routes/Usuarios.routes.js";

const app = express()

 // Middleware para parsear JSON en el cuerpo de las solicitudes
app.use(express.json()); 
// Configurar CORS
app.use(cors());

app.use('/api', ejerciciosRoutes)
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/pedidosProducto', pedidosProductoRoutes);
app.use('/api/pedidosMembresia', pedidosMembresiaRoutes);
app.use('/api/valoracionMedica', valoracionMedicaRoutes);
app.use('/api', usuarioRolRoutes)
app.use('/Api',UsuariosRoutes)
app.use(indexRoutes)

app.listen(3000)
console.log('Servidor ejecutandose en el port 3000');