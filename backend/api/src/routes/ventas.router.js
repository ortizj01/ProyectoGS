import { Router } from 'express';
import { getVentas, getVenta, crearVenta, eliminarVenta } from '../controllers/ventas.controller.js';

const router = Router();

router.get('/ventas', getVentas);
router.get('/ventas/:id', getVenta);
router.post('/ventas', crearVenta);
router.delete('/ventas/:id', eliminarVenta);

export default router;
