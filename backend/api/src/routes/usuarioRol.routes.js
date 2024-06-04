import { Router } from 'express';
import { getRolesDeUsuario, agregarRolAUsuario, eliminarRolDeUsuario } from '../controllers/usuarioRol.controller.js';

const router = Router();

// Rutas para operaciones CRUD relacionadas con los roles de usuarios
router.get('/usuarios/:IdUsuario/roles', getRolesDeUsuario);
router.post('/usuarios/:IdUsuario/roles', agregarRolAUsuario);
router.delete('/usuarios/roles/:IdRolUsuario', eliminarRolDeUsuario);

export default router;