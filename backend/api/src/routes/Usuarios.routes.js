import { Router } from "express";
import{ deleteUsuarios, getUsuarios, postUsuarios, putUsuarios, getUsuario,getUserWithBeneficiary, getClientes} from "../controllers/Usuarios.controllers.js";
const router=Router()


// Rutas para clientes
router.get('/clientes', getClientes); // Listar clientes

router.get('/ping',(req,res)=>res.send('pong'))

router.get('/usuarios',getUsuarios)

router.get('/usuarios/:id',getUsuario)

router.post('/usuarios',postUsuarios)

router.put('/usuarios/:id',putUsuarios)

router.delete('/usuarios/:id',deleteUsuarios)

router.get('/UsuarioBeneficiario/:id', getUserWithBeneficiary);



export default router