import { Router } from 'express'; //para crear y agrupar todas la rutas
import { getEjercicios, createEjercicios, updateEjercicios, deleteEjercicios } from '../controllers/ejercicios.controller.js';

const router = Router()

router.get('/ejercicios', getEjercicios)
router.post('/ejercicios', createEjercicios)
router.put('/ejercicios/:IdEjercicio', updateEjercicios)
router.delete('/ejercicios/:IdEjercicio', deleteEjercicio)

export default router