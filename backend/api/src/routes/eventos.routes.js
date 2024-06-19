import { Router } from 'express'; //para crear y agrupar todas la rutas
import { getEventos, createEventos, updateEventos, 
deleteEvento, getEvento, getServicios, getEntrenadores } from '../controllers/eventos.contoller.js';

const router = Router()

router.get('/eventos', getEventos)
router.get('/eventos/:IdEvento', getEvento)
router.post('/eventos', createEventos)
router.put('/eventos/:IdEvento', updateEventos)
router.delete('/evento/:IdEvento', deleteEvento)

// Nuevas rutas
router.get('/serviciosEventos', getServicios);
router.get('/entrenadores', getEntrenadores);

export default router