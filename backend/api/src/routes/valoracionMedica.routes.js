import { Router } from 'express';
import * as ValoracionMedicaController from '../controllers/valoracionMedica.controller.js';

const router = Router();

router.get('/', ValoracionMedicaController.getValoracionesMedicas);
router.get('/:id', ValoracionMedicaController.getValoracionMedicaById);
router.post('/', ValoracionMedicaController.createValoracionMedica);
router.put('/:id', ValoracionMedicaController.updateValoracionMedica);
router.delete('/:id', ValoracionMedicaController.deleteValoracionMedica);

export default router;
