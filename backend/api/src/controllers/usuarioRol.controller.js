// controllers/usuarioRol.controller.js
import { pool } from '../db.js';

// Obtener usuario por su Id junto con los roles asignados
export const getUsuarioRolById = async (req, res) => {
    try {
        const { IdUsuario } = req.params;
        if (!IdUsuario) {
            return res.status(400).json({ error: 'IdUsuario es requerido' });
        }

        // Consulta para obtener el usuario por su Id
        const [usuarioRows] = await pool.query('SELECT * FROM Usuarios WHERE IdUsuario = ?', [IdUsuario]);
        if (usuarioRows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Consulta para obtener los roles asignados al usuario
        const [rolesRows] = await pool.query('SELECT r.* FROM Roles r JOIN RolUsuario ru ON r.IdRol = ru.IdRol WHERE ru.IdUsuario = ?', [IdUsuario]);

        // Agregar los roles al objeto de usuario
        const usuario = usuarioRows[0];
        usuario.roles = rolesRows;

        res.json(usuario);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el usuario y sus roles' });
    }
};

// Obtener roles de un usuario específico
export const getRolesDeUsuario = async (req, res) => {
    try {
        const { IdUsuario } = req.params;
        if (!IdUsuario) {
            return res.status(400).json({ error: 'IdUsuario es requerido' });
        }

        const [rows] = await pool.query('SELECT r.* FROM Roles r JOIN RolUsuario ru ON r.IdRol = ru.IdRol WHERE ru.IdUsuario = ?', [IdUsuario]);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los roles del usuario' });
    }
};

// Asignar un rol a un usuario
export const agregarRolAUsuario = async (req, res) => {
    try {
        const { IdUsuario } = req.params;
        const { IdRol } = req.body;

        if (!IdUsuario || !IdRol) {
            return res.status(400).json({ error: 'IdUsuario e IdRol son requeridos' });
        }

        const [result] = await pool.query('INSERT INTO RolUsuario (IdRol, IdUsuario) VALUES (?, ?)', [IdRol, IdUsuario]);

        res.status(201).send({
            id: result.insertId,
            IdRol,
            IdUsuario
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al asignar el rol al usuario' });
    }
};

// Editar roles de un usuario
export const editarRolDeUsuario = async (req, res) => {
    try {
        const { IdUsuario } = req.params;
        const { IdRoles } = req.body; // IdRoles es un array de IdRol

        if (!IdUsuario || !Array.isArray(IdRoles)) {
            return res.status(400).json({ error: 'IdUsuario e IdRoles son requeridos' });
        }

        // Eliminar roles actuales
        await pool.query('DELETE FROM RolUsuario WHERE IdUsuario = ?', [IdUsuario]);

        // Asignar nuevos roles
        for (const IdRol of IdRoles) {
            await pool.query('INSERT INTO RolUsuario (IdRol, IdUsuario) VALUES (?, ?)', [IdRol, IdUsuario]);
        }

        res.status(200).json({ message: 'Roles actualizados exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al editar los roles del usuario' });
    }
};

// Eliminar un rol de un usuario
export const eliminarRolDeUsuario = async (req, res) => {
    try {
        const { IdRolUsuario } = req.params;

        if (!IdRolUsuario) {
            return res.status(400).json({ error: 'IdRolUsuario es requerido' });
        }

        await pool.query('DELETE FROM RolUsuario WHERE IdRolUsuario = ?', [IdRolUsuario]);

        res.sendStatus(204);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el rol del usuario' });
    }
};
