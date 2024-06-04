import { pool } from '../db.js';


// Obtener todos los usuarios
export const getUsuarios = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Usuarios');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
};

// Obtener un usuario por ID
export const getUsuarioById = async (req, res) => {
    try {
        const { IdUsuario } = req.params;
        const [rows] = await pool.query('SELECT * FROM Usuarios WHERE IdUsuario = ?', [IdUsuario]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el usuario' });
    }
};

// Crear un nuevo usuario
export const crearUsuario = async (req, res) => {
    try {
        const {
            Documento, TipoDocumento, Nombres, Apellidos,
            Correo, Telefono, FechaDeNacimiento, Direccion,
            Genero, Contrasena, Estado, Beneficiario
        } = req.body;

        const [result] = await pool.query('INSERT INTO Usuarios (Documento, TipoDocumento, Nombres, Apellidos, Correo, Telefono, FechaDeNacimiento, Direccion, Genero, Contrasena, Estado, Beneficiario) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [
            Documento, TipoDocumento, Nombres, Apellidos,
            Correo, Telefono, FechaDeNacimiento, Direccion,
            Genero, Contrasena, Estado, Beneficiario
        ]);

        res.status(201).json({
            id: result.insertId,
            Documento, TipoDocumento, Nombres, Apellidos,
            Correo, Telefono, FechaDeNacimiento, Direccion,
            Genero, Contrasena, Estado, Beneficiario
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear el usuario' });
    }
};

// Actualizar un usuario por ID
export const editarUsuario = async (req, res) => {
    try {
        const { IdUsuario } = req.params;
        const {
            Documento, TipoDocumento, Nombres, Apellidos,
            Correo, Telefono, FechaDeNacimiento, Direccion,
            Genero, Contrasena, Estado, Beneficiario
        } = req.body;

        const [result] = await pool.query('UPDATE Usuarios SET Documento = ?, TipoDocumento = ?, Nombres = ?, Apellidos = ?, Correo = ?, Telefono = ?, FechaDeNacimiento = ?, Direccion = ?, Genero = ?, Contrasena = ?, Estado = ?, Beneficiario = ? WHERE IdUsuario = ?', [
            Documento, TipoDocumento, Nombres, Apellidos,
            Correo, Telefono, FechaDeNacimiento, Direccion,
            Genero, Contrasena, Estado, Beneficiario, IdUsuario
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json({
            id: IdUsuario,
            Documento, TipoDocumento, Nombres, Apellidos,
            Correo, Telefono, FechaDeNacimiento, Direccion,
            Genero, Contrasena, Estado, Beneficiario
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el usuario' });
    }
};

// Eliminar un usuario por ID
export const eliminarUsuario = async (req, res) => {
    try {
        const { IdUsuario } = req.params;
        const [result] = await pool.query('DELETE FROM Usuarios WHERE IdUsuario = ?', [IdUsuario]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.sendStatus(204);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el usuario' });
    }
};
