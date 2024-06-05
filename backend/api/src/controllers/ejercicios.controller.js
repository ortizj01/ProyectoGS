import { pool } from '../db.js';

export const getEjercicios = async (req, res) => {
    const [rows] = await pool.query ('SELECT * FROM ejercicios')
    res.json(rows)
}

export const createEjercicios = async (req, res) => {
    const {NombreEjercicio, DescripcionEjercicio, RepeticionesEjercicio} = req.body
    const [rows] = await pool.query('INSERT INTO ejercicios (NombreEjercicio, DescripcionEjercicio, RepeticionesEjercicio) VALUES (?,?,?)',
    [NombreEjercicio, DescripcionEjercicio,RepeticionesEjercicio])
    res.send({
        id: rows.insertId,
        NombreEjercicio,
        DescripcionEjercicio,
        RepeticionesEjercicio
    })
}

export const updateEjercicios = async (req, res) => {
    const { IdEjercicio } = req.params;
    const { NombreEjercicio, DescripcionEjercicio, RepeticionesEjercicio, EstadoEjercicio } = req.body;

    const [result] = await pool.query('UPDATE Ejercicios SET NombreEjercicio = IFNULL(?, NombreEjercicio), DescripcionEjercicio = IFNULL(?, DescripcionEjercicio), RepeticionesEjercicio = IFNULL(?, RepeticionesEjercicio), EstadoEjercicio = IFNULL(?, EstadoEjercicio) WHERE IdEjercicio = ?',
        [NombreEjercicio, DescripcionEjercicio, RepeticionesEjercicio, EstadoEjercicio, IdEjercicio]
    );

    if (result.affectedRows === 0) return res.status(404).json({
        message: 'Ejercicio no encontrado'
    });

    const [rows] = await pool.query('SELECT * FROM Ejercicios WHERE IdEjercicio = ?', [IdEjercicio]);

    res.json(rows[0]);
};
