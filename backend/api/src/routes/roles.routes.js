import { Router } from 'express';
//import { validarJWT } from '../middlewares/validar-jwt.js';
//import { validarRoles } from '../middlewares/validar-permisos.js';
import { getRoles, getRol, crearRol, editarRol, eliminarRol } from '../controllers/roles.controller.js';

const router = Router();

router.get('/roles', getRoles);
router.get('/roles/:IdRol', getRol);
router.post('/roles', crearRol);
router.put('/roles/:IdRol', editarRol);
router.delete('/roles/:IdRol', eliminarRol);


export default router;
