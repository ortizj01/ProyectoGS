import { pool } from "../db.js";
import bcrypt from "bcryptjs";


export const getUsuarios=async(req,res)=>{
    try {
        const[rows]=await pool.query('SELECT * FROM Usuarios')
    res.json(rows)
    } catch (error) {
        return res.status(500).json({
            message: 'something goes wrong'
        })
    }
}

export const getUsuario = async (req, res) => {

    try {
        const [rows] = await pool.query('SELECT * FROM Usuarios WHERE IdUsuario=?', [req.params.id]);
    console.log(rows);
    if (rows.length<=0 )return res.status(400).json({
        message:'Usuario not found'
    })
    res.json(rows[0]);
    } catch (error) {
        return res.status(500).json({
            message:'somethin goes wrong'
        })
    }
}


export const getUserWithBeneficiary = async (req, res) => {
    try {
        const { id } = req.params; // Obtener el parámetro id de la URL

        // Consulta SQL para obtener el usuario con sus beneficiarios asociados
        const query = `
            SELECT u.*, b.*
            FROM Usuarios u
            LEFT JOIN Usuarios b ON u.IdUsuario = b.Beneficiario
            WHERE u.IdUsuario = ?
        `;

        // Ejecutar la consulta con el id proporcionado
        const [rows] = await pool.query(query, [id]);

        // Verificar si se encontraron resultados
        if (rows.length <= 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Devolver los resultados encontrados
        res.json(rows);
    } catch (error) {
        console.error("Error al obtener usuario con beneficiarios:", error);
        res.status(500).json({ message: "Error al obtener usuario con beneficiarios" });
    }
};


export const postUsuarios= async (req,res)=>{
    const { Documento, TipoDocumento, Nombres, Apellidos, Correo, Telefono, FechaDeNacimiento, Direccion, Genero, Contrasena, Estado, Beneficiario } = req.body;
    
    

let contraseñaEncriptada = await bcrypt.hash(Contrasena, 10);

const [rows]=await pool.query('INSERT INTO Usuarios (Documento, TipoDocumento, Nombres, Apellidos, Correo, Telefono, FechaDeNacimiento, Direccion, Genero, Contrasena, Estado, Beneficiario) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',[Documento, TipoDocumento, Nombres, Apellidos, Correo, Telefono, FechaDeNacimiento, Direccion, Genero, contraseñaEncriptada, Estado, Beneficiario ])
res.send({
    IdUsuario:rows.insertId,
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
  
   
})

}


export const deleteUsuarios = async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM Usuarios WHERE IdUsuario = ?', [req.params.id]);

        if (result.affectedRows <= 0) {
            return res.status(400).json({
                message: 'Usuario not found'
            });
        }

        return res.status(200).json({
            message: 'User deleted successfully'
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Something goes wrong'
        });
    }
};
export const putUsuarios = async (req, res) => {
    const { id } = req.params;
    const { Documento, TipoDocumento, Nombres, Apellidos, Correo, Telefono, FechaDeNacimiento, Direccion, Genero, Contrasena, Estado, Beneficiario } = req.body;

    try {
        // Si se proporciona una nueva contraseña, encriptarla
        let contraseñaEncriptada = Contrasena ? await bcrypt.hash(Contrasena, 10) : undefined;

        const updateUserQuery = `
            UPDATE Usuarios 
            SET 
                Documento = ?, 
                TipoDocumento = ?, 
                Nombres = ?, 
                Apellidos = ?, 
                Correo = ?, 
                Telefono = ?, 
                FechaDeNacimiento = ?, 
                Direccion = ?, 
                Genero = ?, 
                Contrasena = COALESCE(?, Contrasena), 
                Estado = ?, 
                Beneficiario = ?
            WHERE IdUsuario = ?
        `;

        const [result] = await pool.query(updateUserQuery, [
            Documento, 
            TipoDocumento, 
            Nombres, 
            Apellidos, 
            Correo, 
            Telefono, 
            FechaDeNacimiento, 
            Direccion, 
            Genero, 
            contraseñaEncriptada, 
            Estado, 
            Beneficiario, 
            id
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.json({ message: 'Usuario actualizado correctamente' });
    } catch (error) {
        console.error("Error al actualizar usuario:", error);
        res.status(500).json({ message: "Error al actualizar usuario" });
    }
};
