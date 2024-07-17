import { Router } from 'express';
import { getVentas, getVenta, crearVenta, anularVenta } from '../controllers/ventas.controller.js';

const router = Router();

router.get('/ventas', getVentas);
router.get('/ventas/:id', getVenta);
router.post('/ventas', crearVenta);
router.delete('/ventas/:id', anularVenta);

export default router;
