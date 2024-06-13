import { Router } from 'express'; //para crear y agrupar todas la rutas
import { getEventos, createEventos, updateEventos, 
deleteEvento, getEvento } from '../controllers/eventos.controller.js';

const router = Router()

router.get('/eventos', getEventos)
router.get('/eventos/:IdEvento', getEvento)
router.post('/eventos', createEventos)
router.patch('/eventos/:IdEvento', updateEventos)
router.delete('/evento/:IdEvento', deleteEvento)

export default router