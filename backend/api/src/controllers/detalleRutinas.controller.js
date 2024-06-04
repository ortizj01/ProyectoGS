import { pool } from '../db.js';

export const getEjerciciosDeRutina = async (req, res) => {
    const { IdRutina } = req.params;
    const [rows] = await pool.query('SELECT e.* FROM Ejercicios e JOIN RutinasEjercicios re ON e.IdEjercicio = re.IdEjercicio WHERE re.IdRutina = ?', [IdRutina]);
    res.json(rows);
};


export const agregarEjercicioARutina = async (req, res) => {
    const { IdRutina } = req.params;
    const { IdEjercicio } = req.body;
    const [rows] = await pool.query('INSERT INTO RutinasEjercicios (IdRutina, IdEjercicio) VALUES (?, ?)', [IdRutina, IdEjercicio]);
    res.send({
        id: rows.insertId,
        IdRutina,
        IdEjercicio
    });
};

export const eliminarEjercicioDeRutina = async (req, res) => {
    const { IdRutinaEjercicio } = req.params;
    await pool.query('DELETE FROM RutinasEjercicios WHERE IdRutinaEjercicio = ?', [IdRutinaEjercicio]);
    res.sendStatus(204);
};

export const getDetallesDeRutinaPorDiaSemana = async (req, res) => {
    const { IdRutina } = req.params;
    const { DiaSemana } = req.query;
    const [rows] = await pool.query('SELECT re.* FROM RutinasEjerciciosDiaSemana reds JOIN RutinasEjercicios re ON reds.IdRutinaEjercicio = re.IdRutinaEjercicio WHERE re.IdRutina = ? AND reds.DiaSemana = ?', [IdRutina, DiaSemana]);
    res.json(rows);
};

export const agregarEjercicioARutinaPorDiaSemana = async (req, res) => {
    const { IdRutinaEjercicio } = req.params;
    const { DiaSemana } = req.body;
    const [rows] = await pool.query('INSERT INTO RutinasEjerciciosDiaSemana (IdRutinaEjercicio, DiaSemana) VALUES (?, ?)', [IdRutinaEjercicio, DiaSemana]);
    res.send({
        id: rows.insertId,
        IdRutinaEjercicio,
        DiaSemana
    });
};


export const eliminarEjercicioDeRutinaPorDiaSemana = async (req, res) => {
    const { IdRutinaEjercicioDiaSemana } = req.params;
    await pool.query('DELETE FROM RutinasEjerciciosDiaSemana WHERE IdRutinaEjercicioDiaSemana = ?', [IdRutinaEjercicioDiaSemana]);
    res.sendStatus(204);
};
