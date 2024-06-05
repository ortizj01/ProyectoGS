import { Router } from "express";
import{ deleteUsuarios, getUsuarios, postUsuarios, putUsuarios, getUsuario,getUserWithBeneficiary  } from "../controllers/Usuarios.controllers.js";
const router=Router()



router.get('/ping',(req,res)=>res.send('pong'))

router.get('/Usuarioss',getUsuarios)

router.get('/usuarioss/:id',getUsuario)

router.post('/usuarioss',postUsuarios)

router.put('/usuarioss/:id',putUsuarios)

router.delete('/usuarioss/:id',deleteUsuarios)

router.get('/UsuarioBeneficiario/:id', getUserWithBeneficiary);



export default router