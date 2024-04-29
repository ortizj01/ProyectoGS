const {response} = require('express')
// const { model } = require('mongoose')

const RegistroUsuario = require('../models/registroUsuario')

const getRegistroUsuario = async(req, res ) => {
    
    const usuario = await RegistroUsuario.find(); //Obtener todos los documentos de una coleccion
    res.json({
        msg: usuario
    })
}

const postRegistroUsuario = async(req, res) => {
    const datos = req.body //Capturar daros de la url-postman

    let mensaje = 'Inserccion usuario exitosa'
    try {
        const usuario = new RegistroUsuario(datos) // instancia objeto
        await usuario.save() //guardar en la bd
    } catch (error) {
        mensaje = error.message;
    }

    res.json({ 
        msg: mensaje 
    })

}    

const putRegistroUsuario = async (req, res) => {
    const { nombres, apellidos, documento, correo, telefono, edad, direccion, precioDolar, password } = req.body // desectructurar el array con los datos
    let mensaje = ''

    try {
        const usuario = await RegistroUsuario.findOneAndUpdate({nombres: nombres}, // Busqueda
        { nombres: nombres, apellidos:apellidos, documento:documento, correo:correo, telefono:telefono, edad:edad, direccion:direccion, precioDolar:precioDolar, password:password}) // Campos a editar
        mensaje = 'actualizacion exitosa'   

    } catch (error) {
        mensaje = error
    }

    res.json({
        msg: mensaje

    })
}

// const deleteRegistroUsuario = async (req, res) => {
//     const { nombreEmpleado } = req.query // desectructurar el array con los datos
//     let mensaje = ''

//     try {
//         const usuario = await RegistroUsuario.findOneAndDelete({nombreEmpleado:nombreEmpleado}) // Busqueda
//         mensaje = 'eliminacion exitosa'

//     } catch (error) {
//         mensaje = error
//     }

//     res.json({
//         msg: mensaje

//     })
// }


module.exports = {
    getRegistroUsuario,
    postRegistroUsuario,
    putRegistroUsuario,
    //deleteRegistroUsuario
}
