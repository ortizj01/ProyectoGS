import { pool } from '../db.js';

export const getAllPedidos = async () => {
    const [rows] = await pool.query('SELECT * FROM Pedidos');
    return rows;
};

export const getPedidoById = async (id) => {
    const [rows] = await pool.query('SELECT * FROM Pedidos WHERE IdPedido = ?', [id]);
    return rows[0];
};

export const createPedido = async (pedido) => {
    const { IdUsuario, FechaPedido, PagoNeto, Iva, Total, EstadoPedido } = pedido;
    const [result] = await pool.query(
        'INSERT INTO Pedidos (IdUsuario, FechaPedido, PagoNeto, Iva, Total, EstadoPedido) VALUES (?, ?, ?, ?, ?, ?)',
        [IdUsuario, FechaPedido, PagoNeto, Iva, Total, EstadoPedido]
    );
    return result.insertId;
};

export const updatePedido = async (id, pedido) => {
    const { IdUsuario, FechaPedido, PagoNeto, Iva, Total, EstadoPedido } = pedido;
    await pool.query(
        'UPDATE Pedidos SET IdUsuario = ?, FechaPedido = ?, PagoNeto = ?, Iva = ?, Total = ?, EstadoPedido = ? WHERE IdPedido = ?',
        [IdUsuario, FechaPedido, PagoNeto, Iva, Total, EstadoPedido, id]
    );
};

export const deletePedido = async (id) => {
    await pool.query('DELETE FROM Pedidos WHERE IdPedido = ?', [id]);
};
