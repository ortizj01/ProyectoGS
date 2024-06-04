import { Router } from 'express';
import * as PedidoMembresiaController from '../controllers/pedidosMembresia.controller.js';

const router = Router();

router.get('/', PedidoMembresiaController.getPedidosMembresia);
router.get('/:id', PedidoMembresiaController.getPedidoMembresiaById);
router.post('/', PedidoMembresiaController.createPedidoMembresia);
router.put('/:id', PedidoMembresiaController.updatePedidoMembresia);
router.delete('/:id', PedidoMembresiaController.deletePedidoMembresia);

export default router;
