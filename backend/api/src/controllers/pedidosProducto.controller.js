import * as PedidoProductoModel from '../models/pedidosProducto.model.js';

export const getPedidosProducto = async (req, res) => {
    try {
        const pedidosProducto = await PedidoProductoModel.getAllPedidosProducto();
        res.json(pedidosProducto);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getPedidoProductoById = async (req, res) => {
    try {
        const { id } = req.params;
        const pedidoProducto = await PedidoProductoModel.getPedidoProductoById(id);
        if (pedidoProducto) {
            res.json(pedidoProducto);
        } else {
            res.status(404).json({ message: 'PedidoProducto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createPedidoProducto = async (req, res) => {
    try {
        const id = await PedidoProductoModel.createPedidoProducto(req.body);
        res.status(201).json({ id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updatePedidoProducto = async (req, res) => {
    try {
        const { id } = req.params;
        await PedidoProductoModel.updatePedidoProducto(id, req.body);
        res.json({ message: 'PedidoProducto editado' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deletePedidoProducto = async (req, res) => {
    try {
        const { id } = req.params;
        await PedidoProductoModel.deletePedidoProducto(id);
        res.json({ message: 'PedidoProducto eliminado' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
