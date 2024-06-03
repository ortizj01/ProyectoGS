import { Router } from 'express'; //para crear y agrupar todas la rutas
import { getEjercicios, createEjercicios, updateEjercicios, 
deleteEjercicio, getEjercicio, } from '../controllers/ejercicios.controller.js';

const router = Router()

router.get('/ejercicios', getEjercicios)
router.get('/ejercicios/:IdEjercicio', getEjercicio)
router.post('/ejercicios', createEjercicios)
router.patch('/ejercicios/:IdEjercicio', updateEjercicios)
router.delete('/ejercicios/:IdEjercicio', deleteEjercicio)

export default router