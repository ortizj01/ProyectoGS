import { Router } from 'express'; //para crear y agrupar todas la rutas
import { getRoles, crearRol, editarRol, eliminarRol} from '../controllers/roles.controller.js';

const router = Router()

router.get('/roles', getRoles)
router.post('/roles', crearRol)
router.put('/roles/:IdRol', editarRol)
router.delete('/roles/:IdRol', eliminarRol)

export default router