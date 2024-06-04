import * as PedidoMembresiaModel from '../models/pedidosMembresia.model.js';

export const getPedidosMembresia = async (req, res) => {
    try {
        const pedidosMembresia = await PedidoMembresiaModel.getAllPedidosMembresia();
        res.json(pedidosMembresia);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getPedidoMembresiaById = async (req, res) => {
    try {
        const { id } = req.params;
        const pedidoMembresia = await PedidoMembresiaModel.getPedidoMembresiaById(id);
        if (pedidoMembresia) {
            res.json(pedidoMembresia);
        } else {
            res.status(404).json({ message: 'PedidoMembresia no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createPedidoMembresia = async (req, res) => {
    try {
        const id = await PedidoMembresiaModel.createPedidoMembresia(req.body);
        res.status(201).json({ id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updatePedidoMembresia = async (req, res) => {
    try {
        const { id } = req.params;
        await PedidoMembresiaModel.updatePedidoMembresia(id, req.body);
        res.json({ message: 'PedidoMembresia editado' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deletePedidoMembresia = async (req, res) => {
    try {
        const { id } = req.params;
        await PedidoMembresiaModel.deletePedidoMembresia(id);
        res.json({ message: 'PedidoMembresia eliminado' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
