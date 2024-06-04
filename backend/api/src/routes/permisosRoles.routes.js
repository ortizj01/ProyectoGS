import { Router } from 'express';
import { getPermisosDeRol, agregarPermisoARol, eliminarPermisoDeRol } from '../controllers/permisosRoles.controller.js';

const router = Router();

// Rutas para operaciones CRUD relacionadas con los permisos de roles
router.get('/permisosRoles/:IdRol/IdPermiso', getPermisosDeRol);
router.post('/permisosRoles/:IdRol/IdPermiso', agregarPermisoARol);
router.delete('/permisosRoles/:IdRol/:IdPermiso', eliminarPermisoDeRol);

export default router;
