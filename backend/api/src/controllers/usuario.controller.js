import { pool } from '../db.js';


// Obtener todos los usuarios
export const getUsuarios = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Usuarios');
        res.json(rows);
    } catch (error) {
        return res.status(500).json({
            message: 'something goes wrong'
        });
    }
}

// Obtener un usuario por su ID
export const getUsuario = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Usuarios WHERE IdUsuario=?', [req.params.id]);
        if (rows.length <= 0) return res.status(400).json({
            message: 'Usuario not found'
        });
        res.json(rows[0]);
    } catch (error) {
        return res.status(500).json({
            message: 'something goes wrong'
        });
    }
}

// Registrar un nuevo usuario
export const postUsuarios = async (req, res) => {
    const { Documento, TipoDocumento, Nombres, Apellidos, Correo, Telefono, FechaDeNacimiento, Direccion, Genero, Contrasena, Estado, Beneficiario } = req.body;

    try {
        // Verificar si Documento ya existe
        const [existingDocumento] = await pool.query('SELECT * FROM Usuarios WHERE Documento = ?', [Documento]);
        if (existingDocumento.length > 0) {
            return res.status(400).json({
                message: 'El documento ya está en uso'
            });
        }

        // Verificar si Correo ya existe
        const [existingCorreo] = await pool.query('SELECT * FROM Usuarios WHERE Correo = ?', [Correo]);
        if (existingCorreo.length > 0) {
            return res.status(400).json({
                message: 'El correo ya está en uso'
            });
        }

        // Verificar si Telefono ya existe
        const [existingTelefono] = await pool.query('SELECT * FROM Usuarios WHERE Telefono = ?', [Telefono]);
        if (existingTelefono.length > 0) {
            return res.status(400).json({
                message: 'El teléfono ya está en uso'
            });
        }

        // Encriptar la contraseña
        const contraseñaEncriptada = await bcrypt.hash(Contrasena, 10);

        // Insertar nuevo usuario
        const [result] = await pool.query(
            'INSERT INTO Usuarios (Documento, TipoDocumento, Nombres, Apellidos, Correo, Telefono, FechaDeNacimiento, Direccion, Genero, Contrasena, Estado, Beneficiario) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [Documento, TipoDocumento, Nombres, Apellidos, Correo, Telefono, FechaDeNacimiento, Direccion, Genero, contraseñaEncriptada, Estado, Beneficiario]
        );

        const userId = result.insertId;

        // Asignar rol al usuario (rol predeterminado: 3 - Cliente)
        await pool.query('INSERT INTO RolUsuario (IdUsuario, IdRol) VALUES (?, ?)', [userId, 3]);

        res.status(201).json({
            IdUsuario: userId,
            Documento,
            TipoDocumento,
            Nombres,
            Apellidos,
            Correo,
            Telefono,
            FechaDeNacimiento,
            Direccion,
            Genero,
            Beneficiario,
            Estado
        });
    } catch (error) {
        console.error('Error en postUsuarios:', error);
        return res.status(500).json({
            message: 'Internal Server Error'
        });
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
