import { Router } from 'express';
import { getVentas, crearVenta, cambiarEstadoVenta, getVentaDetalle } from '../controllers/ventas.controller.js';

const router = Router();

router.get('/ventas', getVentas);
//router.get('/ventas/:id/productos', getProductosDeVenta); // Obtener productos de una venta específica);
router.get('/ventas/:id', getVentaDetalle); // Ruta para obtener detalles de una venta específica
router.post('/ventas', crearVenta);
router.put('/ventas/:id', cambiarEstadoVenta);

export default router;
