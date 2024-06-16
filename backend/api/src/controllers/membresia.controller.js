import { pool } from '../db.js';

// Obtener todas las membresías
export const getMembresias = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Membresias');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener las membresías' });
    }
};

// Obtener una membresía por ID
export const getMembresia = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query('SELECT * FROM Membresias WHERE IdMembresia = ?', [id]);
        if (rows.length <= 0) return res.status(404).json({ message: 'Membresía no encontrada' });
        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener la membresía' });
    }
};
