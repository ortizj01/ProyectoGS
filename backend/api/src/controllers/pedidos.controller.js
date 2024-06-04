import * as PedidoModel from '../models/pedidos.model.js';

export const getPedidos = async (req, res) => {
    try {
        const pedidos = await PedidoModel.getAllPedidos();
        res.json(pedidos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getPedidoById = async (req, res) => {
    try {
        const { id } = req.params;
        const pedido = await PedidoModel.getPedidoById(id);
        if (pedido) {
            res.json(pedido);
        } else {
            res.status(404).json({ message: 'Pedido no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createPedido = async (req, res) => {
    try {
        const id = await PedidoModel.createPedido(req.body);
        res.status(201).json({ id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updatePedido = async (req, res) => {
    try {
        const { id } = req.params;
        await PedidoModel.updatePedido(id, req.body);
        res.json({ message: 'Pedido editado' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deletePedido = async (req, res) => {
    try {
        const { id } = req.params;
        await PedidoModel.deletePedido(id);
        res.json({ message: 'Pedido eliminado' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
