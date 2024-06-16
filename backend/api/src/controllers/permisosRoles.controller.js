import { pool } from '../db.js';

// Obtener permisos de un rol específico
export const getPermisosDeRol = async (req, res) => {
    try {
        const { IdRol } = req.params;
        if (!IdRol) {
            return res.status(400).json({ error: 'IdRol es requerido' });
        }

        const [rows] = await pool.query('SELECT p.* FROM Permisos p JOIN PermisoRoles pr ON p.IdPermiso = pr.IdPermiso WHERE pr.IdRol = ?', [IdRol]);

        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los permisos del rol' });
    }
};

// Asignar un permiso a un rol
export const agregarPermisoARol = async (req, res) => {
    try {
        const { IdRol } = req.params;
        const { IdPermiso } = req.body;

        if (!IdRol || !IdPermiso) {
            return res.status(400).json({ error: 'IdRol y IdPermiso son requeridos' });
        }

        const [result] = await pool.query('INSERT INTO PermisoRoles (IdRol, IdPermiso) VALUES (?, ?)', [IdRol, IdPermiso]);

        res.status(201).send({
            id: result.insertId,
            IdRol,
            IdPermiso
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al agregar el permiso al rol' });
    }
};

// Eliminar un permiso de un rol
export const eliminarPermisoDeRol = async (req, res) => {
    try {
        const { IdRol, IdPermiso } = req.params;

        if (!IdRol || !IdPermiso) {
            return res.status(400).json({ error: 'IdRol e IdPermiso son requeridos' });
        }

        await pool.query('DELETE FROM PermisoRoles WHERE IdRol = ? AND IdPermiso = ?', [IdRol, IdPermiso]);

        res.sendStatus(204);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el permiso del rol' });
    }
};
