import { Router } from 'express'; //para crear y agrupar todas la rutas
import { getEjercicios, createEjercicios, updateEjercicios } from '../controllers/ejercicios.controller.js';

const router = Router()

router.get('/ejercicios', getEjercicios)
router.post('/ejercicios', createEjercicios)
router.put('/ejercicios/:IdEjercicio', updateEjercicios)


export default router