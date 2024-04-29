const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const registroUsuarioSchema = new mongoose.Schema({
    nombres: {
        type: String,
        required:[true, 'El nombre es requerido']
    },
    apellidos:{
        type: String,
        required:[true, 'El apellido es requerido']
    },
    documento: {
        type: Number,
        unique:true,
        required:[true, 'El documento es requerido']
    },
    correo: {
        type: String,
        unique:true,
        required:[true, 'La hora fin agenda es requerida']
    },
    telefono:{
        type:Number,
        required:[true, 'el telefono es requerido']
    },
    direccion: {
        type: String,
        required:[true, 'La direccion es requerida']
    },
    password: {
        type: String,
        required:[true, 'La contraseña es requerida']
    }
});

// Método para comparar contraseñas
registroUsuarioSchema.methods.comparePassword = async function(candidatePassword) {
    console.log('Contraseña almacenada en la base de datos:', this.password); // Agregar este mensaje de depuración
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    console.log('Contraseña coincidente:', isMatch); // Agregar este mensaje de depuración
    return isMatch;
};


// Antes de guardar, encriptar la contraseña
registroUsuarioSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

module.exports = mongoose.model('registroUsuario', registroUsuarioSchema);
