import * as UsuarioModel from '../models/usuariosPrueba.model.js';

export const getUsuarios = async (req, res) => {
    try {
        const usuarios = await UsuarioModel.getAllUsuarios();
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUsuarioById = async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = await UsuarioModel.getUsuarioById(id);
        if (usuario) {
            res.json(usuario);
        } else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createUsuario = async (req, res) => {
    try {
        const id = await UsuarioModel.createUsuario(req.body);
        res.status(201).json({ id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        await UsuarioModel.updateUsuario(id, req.body);
        res.json({ message: 'Usuario editado' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        await UsuarioModel.deleteUsuario(id);
        res.json({ message: 'Usuario eliminado' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
