const {Router} = require('express')

const route = Router()


//Listar todos los datos
const { getRegistroUsuario, postRegistroUsuario, putRegistroUsuario} = require('../controllers/registroUsuario')

route.get('/', getRegistroUsuario)
route.post('/', postRegistroUsuario)
route.put('/', putRegistroUsuario)




module.exports = route 