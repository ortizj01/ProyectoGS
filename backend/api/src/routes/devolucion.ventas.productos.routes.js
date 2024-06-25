import { Router } from "express";
import { getDevolucionVentasProducto, postDevolucionVentasProducto, putDevolucionVentasProducto, deleteDevolucionVentasProducto, getDevolucionVentaProducto } from '../controllers/devolucion.ventas.productos.comtroller';

const router = Router();

router.get('/devolucionventasproducto', getDevolucionVentasProducto);
router.get('/devolucionventasproducto/:id', getDevolucionVentaProducto);
router.post('/devolucionventasproducto', postDevolucionVentasProducto);
router.patch('/devolucionventasproducto/:id', putDevolucionVentasProducto);
router.delete('/devolucionventasproducto/:id', deleteDevolucionVentasProducto);

export default router;
