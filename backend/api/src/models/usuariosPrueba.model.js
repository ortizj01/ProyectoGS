import { pool } from '../db.js';

export const getAllUsuarios = async () => {
    const [rows] = await pool.query('SELECT * FROM Usuarios');
    return rows;
};

export const getUsuarioById = async (id) => {
    const [rows] = await pool.query('SELECT * FROM Usuarios WHERE IdUsuario = ?', [id]);
    return rows[0];
};

export const createUsuario = async (usuario) => {
    const { Documento, TipoDocumento, Nombres, Apellidos, Correo, Telefono, FechaDeNacimiento, Direccion, Genero, Contrasena, Estado, Beneficiario } = usuario;
    const [result] = await pool.query(
        'INSERT INTO Usuarios (Documento, TipoDocumento, Nombres, Apellidos, Correo, Telefono, FechaDeNacimiento, Direccion, Genero, Contrasena, Estado, Beneficiario) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [Documento, TipoDocumento, Nombres, Apellidos, Correo, Telefono, FechaDeNacimiento, Direccion, Genero, Contrasena, Estado, Beneficiario]
    );
    return result.insertId;
};

export const updateUsuario = async (id, usuario) => {
    const { Documento, TipoDocumento, Nombres, Apellidos, Correo, Telefono, FechaDeNacimiento, Direccion, Genero, Contrasena, Estado, Beneficiario } = usuario;
    await pool.query(
        'UPDATE Usuarios SET Documento = ?, TipoDocumento = ?, Nombres = ?, Apellidos = ?, Correo = ?, Telefono = ?, FechaDeNacimiento = ?, Direccion = ?, Genero = ?, Contrasena = ?, Estado = ?, Beneficiario = ? WHERE IdUsuario = ?',
        [Documento, TipoDocumento, Nombres, Apellidos, Correo, Telefono, FechaDeNacimiento, Direccion, Genero, Contrasena, Estado, Beneficiario, id]
    );
};

export const deleteUsuario = async (id) => {
    await pool.query('DELETE FROM Usuarios WHERE IdUsuario = ?', [id]);
};
