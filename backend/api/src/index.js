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
import rutinasRoutes from './routes/rutinas.routes.js';
import eventosRoutes from './routes/eventos.routes.js';
import detalleRutinasRouter from './routes/detalleRutinas.routes.js';
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


const app = express()

 // Middleware para parsear JSON en el cuerpo de las solicitudes
app.use(express.json()); 
// Configurar CORS
app.use(cors());

//YONIER

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
app.use('/api', ejerciciosRoutes);
app.use('/api', rutinasRoutes);
app.use('/api', eventosRoutes);
app.use('/api', detalleRutinasRouter);
app.use('/api',UsuariosRoutes)
app.use(indexRoutes);

//Alejo

app.use('/api',proveedoresRoutes)
app.use('/api',productosRoutes)
app.use('/api',categoriasRoutes)
app.use('/api',comprasRoutes)
app.use('/api',devolucionescomprasRoutes)
app.use('/api',comprasproductoRoutes)
app.use('/api',devolucioncomprasproductoRoutes)

app.listen(3000, () => {
    console.log('Servidor ejecutandose en el puerto 3000');
});
