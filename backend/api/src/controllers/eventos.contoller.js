import { pool } from '../db.js';

export const getEventos = async (req, res) => {
    const [rows] = await pool.query ('SELECT * FROM Eventos') 
    res.json(rows)
}

export const getEvento = async (req, res) => {
    const [rows] = await pool.query ('SELECT * FROM Ejercicios WHERE IdEjercicio = ?', [req.params.IdEjercicio])
    
    if(rows.length <= 0) return res.status(400).json({
        message: 'Ejercicio no encontrado'
    })   

    res.json(rows[0])
}

export const createEventos = async (req, res) => {
    const {FechaInicio, FechaFin, HoraInicio, HoraFin, DescripcionEvento, EstadoAgenda, IdServicio, IdUsuario} = req.body
    const [rows] = await pool.query('INSERT INTO Eventos (FechaInicio, FechaFin, HoraInicio, HoraFin, DescripcionEvento, EstadoAgenda, IdServicio, IdUsuario) VALUES (?,?,?,?,?,?,?,?)',
    [FechaInicio, FechaFin, HoraInicio, HoraFin, DescripcionEvento, EstadoAgenda, IdServicio, IdUsuario])
    res.send({
        id: rows.insertId,
        FechaInicio, 
        FechaFin, 
        HoraInicio, 
        HoraFin, 
        DescripcionEvento, 
        EstadoAgenda, 
        IdServicio, 
        IdUsuario
    })
}

export const deleteEvento = async (req, res) => {
    const [result] = await pool.query('DELETE FROM Eventos WHERE IdEvento = ?', [req.params.IdEvento])

    if (result.affectedRows <= 0) return res.status(404).json({
        message: 'Evento no encontrado'
    })
    
    res.sendStatus(204)
}


export const updateEventos = async (req, res) => {
    const {IdEvento} = req.params
    const {FechaInicio, FechaFin, HoraInicio, HoraFin, DescripcionEvento, EstadoAgenda, IdServicio, IdUsuario} = req.body
    
    const [result] = await  pool.query('UPDATE Eventos SET FechaInicio = IFNULL(?, FechaInicio), FechaFin = IFNULL(?, FechaFin), HoraInicio = IFNULL(?, HoraInicio), HoraFin = IFNULL(?, HoraFin),  DescripcionEvento = IFNULL(?, DescripcionEvento), IdServicio = IFNULL (?, IdServicio), IdUsuario = IFNULL(?, IdUsuario) WHERE IdEvento = ?',
    [FechaInicio, FechaFin, HoraInicio, HoraFin, DescripcionEvento, EstadoAgenda, IdServicio, IdUsuario]
    )
    
    if(result.affectedRows === 0 )return res.status(404).json({
        message: 'Evento no encontrado'
    })

    const [rows] = await pool.query('SELECT * FROM Eventos WHERE IdEvento = ?', [IdEvento])

    res.json(rows[0])
}