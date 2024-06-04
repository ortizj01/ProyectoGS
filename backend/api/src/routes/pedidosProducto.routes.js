import { Router } from 'express';
import * as PedidoProductoController from '../controllers/pedidosProducto.controller.js';

const router = Router();

router.get('/', PedidoProductoController.getPedidosProducto);
router.get('/:id', PedidoProductoController.getPedidoProductoById);
router.post('/', PedidoProductoController.createPedidoProducto);
router.put('/:id', PedidoProductoController.updatePedidoProducto);
router.delete('/:id', PedidoProductoController.deletePedidoProducto);

export default router;
