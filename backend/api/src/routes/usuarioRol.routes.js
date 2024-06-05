import { Router } from 'express';
import {getUsuarioRolById, agregarRolAUsuario, eliminarRolDeUsuario } from '../controllers/usuarioRol.controller.js';

const router = Router();

// Rutas para operaciones CRUD relacionadas con los roles de usuarios

router.get('/usuariosRol/:IdUsuario/roles', getUsuarioRolById);
router.post('/usuariosRol/:IdUsuario/roles', agregarRolAUsuario);
router.delete('/usuariosRol/roles/:IdRolUsuario', eliminarRolDeUsuario);



export default router;