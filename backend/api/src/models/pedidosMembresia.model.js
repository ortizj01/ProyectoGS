import { pool } from '../db.js';

export const getAllPedidosMembresia = async () => {
    const [rows] = await pool.query('SELECT * FROM PedidosMembresia');
    return rows;
};

export const getPedidoMembresiaById = async (id) => {
    const [rows] = await pool.query('SELECT * FROM PedidosMembresia WHERE IdPedidoMembresia = ?', [id]);
    return rows[0];
};

export const createPedidoMembresia = async (pedidoMembresia) => {
    const { IdPedido, IdMembresia, FechaInicio, FechaFin, Total } = pedidoMembresia;
    const [result] = await pool.query(
        'INSERT INTO PedidosMembresia (IdPedido, IdMembresia, FechaInicio, FechaFin, Total) VALUES (?, ?, ?, ?, ?)',
        [IdPedido, IdMembresia, FechaInicio, FechaFin, Total]
    );
    return result.insertId;
};

export const updatePedidoMembresia = async (id, pedidoMembresia) => {
    const { IdPedido, IdMembresia, FechaInicio, FechaFin, Total } = pedidoMembresia;
    await pool.query(
        'UPDATE PedidosMembresia SET IdPedido = ?, IdMembresia = ?, FechaInicio = ?, FechaFin = ?, Total = ? WHERE IdPedidoMembresia = ?',
        [IdPedido, IdMembresia, FechaInicio, FechaFin, Total, id]
    );
};

export const deletePedidoMembresia = async (id) => {
    await pool.query('DELETE FROM PedidosMembresia WHERE IdPedidoMembresia = ?', [id]);
};
