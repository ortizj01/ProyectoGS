import express from 'express';
import cors from 'cors'; // Importar cors
import ejerciciosRoutes from './routes/ejercicios.routes.js';
import rutinasRoutes from './routes/rutinas.routes.js';
import eventosRoutes from './routes/eventos.routes.js';
import detalleRutinasRouter from './routes/detalleRutinas.routes.js';
import indexRoutes from './routes/index.routes.js';

const app = express();

// Usar cors para permitir solicitudes desde cualquier origen
app.use(cors());

app.use(express.json());

app.use('/api', ejerciciosRoutes);
app.use('/api', rutinasRoutes);
app.use('/api', eventosRoutes);
app.use('/api', detalleRutinasRouter);
app.use(indexRoutes);

app.listen(3000, () => {
    console.log('Servidor ejecutandose en el puerto 3000');
});
