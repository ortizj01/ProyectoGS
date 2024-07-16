import { pool } from '../db.js';

// Obtener todos los productos de las ventas
export const getVentasProducto = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM VentasProducto');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los productos de las ventas' });
    }
};

// Obtener un producto de venta por ID
export const getVentaProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query('SELECT * FROM VentasProducto WHERE IdVentaProducto = ?', [id]);

        if (rows.length <= 0) return res.status(404).json({ message: 'Producto de venta no encontrado' });

        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el producto de venta' });
    }
};

// Crear un nuevo producto en una venta
export const postVentasProducto = async (req, res) => {
    const { IdVenta, IdProducto, Cantidad } = req.body;
    try {
        const [rows] = await pool.query('INSERT INTO VentasProducto (IdVenta, IdProducto, Cantidad) VALUES (?, ?, ?)', [IdVenta, IdProducto, Cantidad]);
        res.status(201).json({
            id: rows.insertId,
            IdVenta,
            IdProducto,
            Cantidad
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear el producto de venta' });
    }
};

// Eliminar un producto de una venta
export const deleteVentasProducto = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM VentasProducto WHERE IdVentaProducto = ?', [id]);
        if (result.affectedRows <= 0) return res.status(404).json({ message: 'Producto de venta no encontrado' });

        res.send('Producto de venta eliminado');
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el producto de venta' });
    }
};

// Actualizar un producto de una venta
export const putVentasProducto = async (req, res) => {
    const { id } = req.params;
    const { IdVenta, IdProducto, Cantidad } = req.body;

    try {
        const [result] = await pool.query('UPDATE VentasProducto SET IdVenta = IFNULL(?, IdVenta), IdProducto = IFNULL(?, IdProducto), Cantidad = IFNULL(?, Cantidad) WHERE IdVentaProducto = ?', [IdVenta, IdProducto, Cantidad, id]);

        if (result.affectedRows === 0) return res.status(404).json({ message: 'Producto de venta no encontrado' });

        const [rows] = await pool.query('SELECT * FROM VentasProducto WHERE IdVentaProducto = ?', [id]);
        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el producto de venta' });
    }
};
