import { Router } from 'express';
import { getVentas, getProductosDeVenta, crearVenta, anularVenta } from '../controllers/ventas.controller.js';

const router = Router();

router.get('/ventas', getVentas);
router.get('/ventas/:id/productos', getProductosDeVenta); // Obtener productos de una venta específica);
router.post('/ventas', crearVenta);
router.delete('/ventas/:id', anularVenta);

export default router;
