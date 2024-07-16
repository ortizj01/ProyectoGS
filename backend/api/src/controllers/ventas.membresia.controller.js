import { pool } from '../db.js';

// Obtener todas las membresías de las ventas
export const getVentasMembresia = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM VentasMembresia');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener las membresías de las ventas' });
    }
};

// Obtener una membresía de venta por ID
export const getVentaMembresia = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query('SELECT * FROM VentasMembresia WHERE IdVentaMembresia = ?', [id]);

        if (rows.length <= 0) return res.status(404).json({ message: 'Membresía de venta no encontrada' });

        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener la membresía de venta' });
    }
};

// Crear una nueva membresía en una venta
export const postVentasMembresia = async (req, res) => {
    const { IdVenta, IdMembresia, Cantidad } = req.body;
    try {
        const [rows] = await pool.query('INSERT INTO VentasMembresia (IdVenta, IdMembresia, Cantidad) VALUES (?, ?, ?)', [IdVenta, IdMembresia, Cantidad]);
        res.status(201).json({
            id: rows.insertId,
            IdVenta,
            IdMembresia,
            Cantidad
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear la membresía de venta' });
    }
};

// Eliminar una membresía de una venta
export const deleteVentasMembresia = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM VentasMembresia WHERE IdVentaMembresia = ?', [id]);
        if (result.affectedRows <= 0) return res.status(404).json({ message: 'Membresía de venta no encontrada' });

        res.send('Membresía de venta eliminada');
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar la membresía de venta' });
    }
};

// Actualizar una membresía de una venta
export const putVentasMembresia = async (req, res) => {
    const { id } = req.params;
    const { IdVenta, IdMembresia, Cantidad } = req.body;

    try {
        const [result] = await pool.query('UPDATE VentasMembresia SET IdVenta = IFNULL(?, IdVenta), IdMembresia = IFNULL(?, IdMembresia), Cantidad = IFNULL(?, Cantidad) WHERE IdVentaMembresia = ?', [IdVenta, IdMembresia, Cantidad, id]);

        if (result.affectedRows === 0) return res.status(404).json({ message: 'Membresía de venta no encontrada' });

        const [rows] = await pool.query('SELECT * FROM VentasMembresia WHERE IdVentaMembresia = ?', [id]);
        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar la membresía de venta' });
    }
};
