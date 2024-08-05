import { Router } from "express";
import { deleteUsuarios, getUsuarios, postUsuarios, putUsuarios, getUsuario, getUserWithBeneficiary, getClientes, getBeneficiarios, getUsuariosPorDocumento } from "../controllers/Usuarios.controllers.js";
const router = Router();

// Rutas para clientes
router.get('/clientes', getClientes); // Listar clientes

// Rutas para beneficiarios
router.get('/beneficiarios', getBeneficiarios); // Listar beneficiarios

router.get('/ping', (req, res) => res.send('pong'));

router.get('/usuarios', getUsuarios);

router.get('/usuarios/:id', getUsuario);

router.post('/usuarios', postUsuarios);

router.put('/usuarios/:id', putUsuarios);

router.delete('/usuarios/:id', deleteUsuarios);

router.get('/UsuarioBeneficiario/:id', getUserWithBeneficiary);

router.get('/usuarios/buscar/:documento', getUsuariosPorDocumento);

export default router;
