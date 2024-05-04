import express from 'express';
import ejerciciosRoutes from './routes/ejercicios.routes.js';
import indexRoutes from './routes/index.routes.js';

const app = express()

app.use(express.json())

app.use('/api', ejerciciosRoutes)
app.use(indexRoutes)

app.listen(3000)
console.log('Servidor ejecutandose en el port 3000');