import { Router } from 'express';
import { getVentasMembresia, getVentaMembresia, postVentasMembresia, deleteVentasMembresia, putVentasMembresia } from '../controllers/ventas.membresia.controller.js';

const router = Router();

router.get('/ventasMembresia', getVentasMembresia);
router.get('/ventasMembresia/:id', getVentaMembresia);
router.post('/ventasMembresia', postVentasMembresia);
router.delete('/ventasMembresia/:id', deleteVentasMembresia);
router.put('/ventasMembresia/:id', putVentasMembresia);

export default router;
