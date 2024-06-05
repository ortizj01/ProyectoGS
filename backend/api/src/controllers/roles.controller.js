import { pool } from '../db.js';


export const getRoles = async (req, res) => {
    const [rows] = await pool.query ('SELECT * FROM Roles')
    res.json(rows)
}

export const getRol = async (req, res) => {
    const [rows] = await pool.query ('SELECT * FROM Roles WHERE IdRol = ?', [req.params.IdRol])
    
    if(rows.length <= 0) return res.status(400).json({
        message: 'Rol no encontrado'
    })   

    res.json(rows[0])
}

export const crearRol = async (req, res) => {
    const {NombreRol, EstadoRol} = req.body
    const [rows] = await pool.query('INSERT INTO Roles (NombreRol, EstadoRol) VALUES (?,?)',
    [NombreRol, EstadoRol])
    res.send({
        id: rows.insertId,
        NombreRol,
        EstadoRol,
        
    })
}

export const eliminarRol =  async (req, res) => {
    const [result] =  await pool.query('DELETE FROM Roles WHERE IdRol = ?', [req.params.IdRol])
   
    if (result.affectedRows <= 0) return res.status(404).json({
        message: 'Rol not found'
    })

    res.sendStatus(204)
} 

export const editarRol = async (req, res) => {
    const {IdRol} = req.params
    const {NombreRol, EstadoRol} = req.body

    try {
        const [result] = await pool.query('UPDATE Roles SET NombreRol = IFNULL(?, NombreRol),  EstadoRol = IFNULL (?, EstadoRol) WHERE IdRol = ?', [NombreRol, EstadoRol, IdRol])
        
        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Rol not found'
            })
        }
        
        const [rows] = await pool.query('SELECT * FROM Roles WHERE IdRol = ?', [IdRol])
        
        res.json(rows[0])
    } catch (error) {
        console.error('Error:', error)
        res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}
