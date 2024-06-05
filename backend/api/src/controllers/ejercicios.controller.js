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

export const updateEjercicios = (req, res) => res.send('Actualizando ejercicios')

export const deleteEjercicios = (req, res) => res.send('Eliminando ejercicios')