import { Router } from 'express'; //para crear y agrupar todas la rutas
import { getRutinas, createRutinas, getRutina,updateRutina, deleteRutina, getRutinaDetallada } from '../controllers/rutinas.controller.js';

const router = Router()

router.get('/rutinas', getRutinas)
router.get('/rutinas:IdRutina', getRutina)
router.post('/rutinas', createRutinas)
router.patch('/rutinas:IdRutina', updateRutina)
router.delete('/rutinas:IdRutina', deleteRutina)
router.get('/rutinas/:IdRutina/detallada', getRutinaDetallada)


export default router