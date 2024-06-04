import { Router } from 'express';
import * as PedidoController from '../controllers/pedidos.controller.js';

const router = Router();

router.get('/', PedidoController.getPedidos);
router.get('/:id', PedidoController.getPedidoById);
router.post('/', PedidoController.createPedido);
router.put('/:id', PedidoController.updatePedido);
router.delete('/:id', PedidoController.deletePedido);

export default router;
