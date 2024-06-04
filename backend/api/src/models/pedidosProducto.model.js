import { pool } from '../db.js';

export const getAllPedidosProducto = async () => {
    const [rows] = await pool.query('SELECT * FROM PedidosProducto');
    return rows;
};

export const getPedidoProductoById = async (id) => {
    const [rows] = await pool.query('SELECT * FROM PedidosProducto WHERE IdPedidoProducto = ?', [id]);
    return rows[0];
};

export const createPedidoProducto = async (pedidoProducto) => {
    const { IdPedido, IdProducto, Cantidad, Total } = pedidoProducto;
    const [result] = await pool.query(
        'INSERT INTO PedidosProducto (IdPedido, IdProducto, Cantidad, Total) VALUES (?, ?, ?, ?)',
        [IdPedido, IdProducto, Cantidad, Total]
    );
    return result.insertId;
};

export const updatePedidoProducto = async (id, pedidoProducto) => {
    const { IdPedido, IdProducto, Cantidad, Total } = pedidoProducto;
    await pool.query(
        'UPDATE PedidosProducto SET IdPedido = ?, IdProducto = ?, Cantidad = ?, Total = ? WHERE IdPedidoProducto = ?',
        [IdPedido, IdProducto, Cantidad, Total, id]
    );
};

export const deletePedidoProducto = async (id) => {
    await pool.query('DELETE FROM PedidosProducto WHERE IdPedidoProducto = ?', [id]);
};
