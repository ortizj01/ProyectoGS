import { pool } from '../db.js';

// Obtener todos los productos
export const getProductos = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Productos');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
};

// Obtener un producto por ID
export const getProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query('SELECT * FROM Productos WHERE IdProducto = ?', [id]);
        if (rows.length <= 0) return res.status(404).json({ message: 'Producto no encontrado' });
        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
};
