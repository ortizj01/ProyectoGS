import { pool } from '../db.js';

// Obtener permisos de un rol específico
export const getPermisosDeRol = async (req, res) => {
    const { IdRol } = req.params;
    const [rows] = await pool.query('SELECT p.* FROM Permisos p JOIN PermisoRoles pr ON p.IdPermiso = pr.IdPermiso WHERE pr.IdRol = ?', [IdRol]);
    res.json(rows);
};

// Asignar un permiso a un rol
export const agregarPermisoARol = async (req, res) => {
    const { IdRol } = req.params;
    const { IdPermiso } = req.body;
    const [rows] = await pool.query('INSERT INTO PermisoRoles (IdRol, IdPermiso) VALUES (?, ?)', [IdRol, IdPermiso]);
    res.send({
        id: rows.insertId,
        IdRol,
        IdPermiso
    });
};

// Eliminar un permiso de un rol
export const eliminarPermisoDeRol = async (req, res) => {
    const { IdPermisoRol } = req.params;
    await pool.query('DELETE FROM PermisoRoles WHERE IdPermisoRol = ?', [IdPermisoRol]);
    res.sendStatus(204);
};
