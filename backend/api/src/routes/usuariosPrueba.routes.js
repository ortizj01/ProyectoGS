import { Router } from 'express';
import * as UsuarioController from '../controllers/usuariosPrueba.controller.js';

const router = Router();

router.get('/', UsuarioController.getUsuarios);
router.get('/:id', UsuarioController.getUsuarioById);
router.post('/', UsuarioController.createUsuario);
router.put('/:id', UsuarioController.updateUsuario);
router.delete('/:id', UsuarioController.deleteUsuario);

export default router;
