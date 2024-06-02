import { Router } from 'express'; // para crear y agrupar todas las rutas
import { getRutinas, createRutinas, getRutina, updateRutina, deleteRutina, getRutinaDetallada, getUsuarios } from '../controllers/rutinas.controller.js';

const router = Router();

router.get('/rutinas', getRutinas);
router.get('/rutinas/:IdRutina', getRutina); 
router.post('/rutinas', createRutinas);
router.patch('/rutinas/:IdRutina', updateRutina); 
router.delete('/rutinas/:IdRutina', deleteRutina);
router.get('/rutinas/:IdRutina/detallada', getRutinaDetallada);

// Nueva ruta para obtener los usuarios
router.get('/usuarios', getUsuarios);

export default router;
