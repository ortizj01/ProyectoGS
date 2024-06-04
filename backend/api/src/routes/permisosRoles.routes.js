import { Router } from 'express';
import { getPermisosDeRol, agregarPermisoARol, eliminarPermisoDeRol } from '../controllers/permisosRoles.controller.js';

const router = Router();


router.get('/permisosRoles/:IdRol', getPermisosDeRol);

router.post('/permisosRoles/:IdRol', agregarPermisoARol);

router.delete('/permisosRoles/:IdPermisoRol', eliminarPermisoDeRol);

export default router;
