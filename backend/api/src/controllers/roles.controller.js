import { pool } from '../db.js';


export const getRoles = async (req, res) => {
    const [rows] = await pool.query ('SELECT * FROM Roles')
    res.json(rows)
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
    const [result] =  await pool.query('DELETE FROM Roles WHERE IdRol = ?', [req.params.id])
   
    if (result.affectedRows <= 0) return res.status(404).json({
        message: 'Rol not found'
    })

    res.sendStatus(204)
} 

export const editarRol = async (req, res) => {
    const {IdRol} = req.params
    const {NombreRol, EstadoRol}= req.body

    const [result] = await pool.query('UPDATE Roles SET NombreRol =?, EstadoRol =?  WHERE IdRol = ?' ,
        [NombreRol, EstadoRol, IdRol]
    )
    
    if(result.affectedRows === 0) return res.status(404).json({
        message: 'Rol not found'
    })
    
    const [rows] = await pool.query('SELECT * FROM Roles WHERE IdRol= ?', [IdRol])

    res.json(rows(0))
}

 