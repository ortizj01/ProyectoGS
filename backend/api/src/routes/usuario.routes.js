import { Router } from 'express';
import { getUsuarios, getUsuarioById, crearUsuario, editarUsuario, eliminarUsuario } from '../controllers/usuario.controller.js';

const router = Router();

// Rutas para operaciones CRUD relacionadas con los usuarios
router.get('/usuarios', getUsuarios);
router.get('/usuarios/:IdUsuario', getUsuarioById);
router.post('/usuarios', crearUsuario);
router.put('/usuarios/:IdUsuario', editarUsuario);
router.delete('/usuarios/:IdUsuario', eliminarUsuario);

export default router;
