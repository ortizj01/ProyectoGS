import { Router } from 'express';
import { getRolesDeUsuario, getUsuarioRolById, agregarRolAUsuario, editarRolDeUsuario, eliminarRolDeUsuario } from '../controllers/usuarioRol.controller.js';


const router = Router();

router.get('/usuariosRol/:IdUsuario/roles', getRolesDeUsuario);
router.get('/usuariosRol/:IdUsuario', getUsuarioRolById);
router.post('/usuariosRol/:IdUsuario/roles', agregarRolAUsuario);
router.put('/usuariosRol/:IdUsuario/roles', editarRolDeUsuario);
router.delete('/usuariosRol/roles/:IdRolUsuario', eliminarRolDeUsuario);

export default router;
