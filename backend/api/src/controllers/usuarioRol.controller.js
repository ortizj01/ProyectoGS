import { pool } from '../db.js';

// Obtener roles de un usuario específico
export const getRolesDeUsuario = async (req, res) => {
    const { IdUsuario } = req.params;
    const [rows] = await pool.query('SELECT r.* FROM Roles r JOIN RolUsuario ru ON r.IdRol = ru.IdRol WHERE ru.IdUsuario = ?', [IdUsuario]);
    res.json(rows);
};

// Asignar un rol a un usuario
export const agregarRolAUsuario = async (req, res) => {
    const { IdUsuario } = req.params;
    const { IdRol } = req.body;
    const [rows] = await pool.query('INSERT INTO RolUsuario (IdRol, IdUsuario) VALUES (?, ?)', [IdRol, IdUsuario]);
    res.send({
        id: rows.insertId,
        IdRol,
        IdUsuario
    });
};

// Eliminar un rol de un usuario
export const eliminarRolDeUsuario = async (req, res) => {
    const { IdRolUsuario } = req.params;
    await pool.query('DELETE FROM RolUsuario WHERE IdRolUsuario = ?', [IdRolUsuario]);
    res.sendStatus(204);
};
