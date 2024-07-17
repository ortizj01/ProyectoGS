import { Router } from 'express';
import { getVentasProducto, getVentaProducto, postVentasProducto, deleteVentasProducto, putVentasProducto } from '../controllers/ventas.productos.controller.js';

const router = Router();

router.get('/ventasProducto', getVentasProducto);
router.get('/ventasProducto/:id', getVentaProducto);
router.post('/ventasProducto', postVentasProducto);
router.delete('/ventasProducto/:id', deleteVentasProducto);
router.put('/ventasProducto/:id', putVentasProducto);

export default router;
