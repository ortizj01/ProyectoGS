import { pool } from "../db.js";
import { request, response } from "express";

export const validarRoles = (permisosRequeridos = []) => {
    return async (req = request, res = response, next) => {
        try {
            const { IdUsuario } = req.user;

            const [permisos] = await pool.query(`
                SELECT p.NombrePermiso 
                FROM PermisoRoles pr 
                JOIN Permisos p ON pr.IdPermiso = p.IdPermiso 
                JOIN RolUsuario ru ON pr.IdRol = ru.IdRol 
                WHERE ru.IdUsuario = ?
            `, [IdUsuario]);

            const permisosUsuario = permisos.map(permiso => permiso.NombrePermiso);

            const tienePermisos = permisosRequeridos.every(permiso => permisosUsuario.includes(permiso));

            if (!tienePermisos) {
                return res.status(403).json({ msg: 'No tienes permisos para realizar esta acción' });
            }

            next();
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: 'Hable con el administrador' });
        }
    };
};
