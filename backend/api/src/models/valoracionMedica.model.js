import { pool } from '../db.js';

export const getAllValoracionesMedicas = async () => {
    const [rows] = await pool.query('SELECT * FROM ValoracionMedica');
    return rows;
};

export const getValoracionMedicaById = async (id) => {
    const [rows] = await pool.query('SELECT * FROM ValoracionMedica WHERE IdValoracion = ?', [id]);
    return rows[0];
};

export const createValoracionMedica = async (valoracionMedica) => {
    const { IdUsuario, TieneCondicionCronica, CirugiaPrevia, AlergiasConocidas, MedicamentosActuales, LesionesMusculoesqueleticas, EnfermedadCardiacaVascular, AntecedentesFamiliares, TipoAfiliacion, IMC } = valoracionMedica;
    const [result] = await pool.query(
        'INSERT INTO ValoracionMedica (IdUsuario, TieneCondicionCronica, CirugiaPrevia, AlergiasConocidas, MedicamentosActuales, LesionesMusculoesqueleticas, EnfermedadCardiacaVascular, AntecedentesFamiliares, TipoAfiliacion, IMC) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [IdUsuario, TieneCondicionCronica, CirugiaPrevia, AlergiasConocidas, MedicamentosActuales, LesionesMusculoesqueleticas, EnfermedadCardiacaVascular, AntecedentesFamiliares, TipoAfiliacion, IMC]
    );
    return result.insertId;
};

export const updateValoracionMedica = async (id, valoracionMedica) => {
    const { IdUsuario, TieneCondicionCronica, CirugiaPrevia, AlergiasConocidas, MedicamentosActuales, LesionesMusculoesqueleticas, EnfermedadCardiacaVascular, AntecedentesFamiliares, TipoAfiliacion, IMC } = valoracionMedica;
    await pool.query(
        'UPDATE ValoracionMedica SET IdUsuario = ?, TieneCondicionCronica = ?, CirugiaPrevia = ?, AlergiasConocidas = ?, MedicamentosActuales = ?, LesionesMusculoesqueleticas = ?, EnfermedadCardiacaVascular = ?, AntecedentesFamiliares = ?, TipoAfiliacion = ?, IMC = ? WHERE IdValoracion = ?',
        [IdUsuario, TieneCondicionCronica, CirugiaPrevia, AlergiasConocidas, MedicamentosActuales, LesionesMusculoesqueleticas, EnfermedadCardiacaVascular, AntecedentesFamiliares, TipoAfiliacion, IMC, id]
    );
};

export const deleteValoracionMedica = async (id) => {
    await pool.query('DELETE FROM ValoracionMedica WHERE IdValoracion = ?', [id]);
};
