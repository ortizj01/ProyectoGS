import {pool} from '../db.js'

export const getDevolucioncompras = async (req,res)=> {
const [rows] =await pool.query('SELECT*FROM DevolucionesCompras')
res.json(rows)
}

export const getDevolucioncompra = async (req,res)=> {
    const [rows] =await pool.query('SELECT*FROM DevolucionesCompras WHERE IdDevolucionesCompra=?',[req.params.id])
    
    if(rows.length<=0)return res.status(404).json({
        message: 'Compra no encontrada'
    })
    res.json(rows[0])
    }

export const postDevolucioncompras = async (req,res)=> {
    const {Motivo, ValorDevolucion,EstadoDevolucion,IdCompra,IdUsuario} = req.body
    const [rows] = await pool.query('INSERT INTO DevolucionesCompras(Motivo, ValorDevolucion,EstadoDevolucion,IdCompra,IdUsuario)VALUES(?,?,?,?,?)',[Motivo, ValorDevolucion,EstadoDevolucion,IdCompra,IdUsuario])
    res.send({
        id:rows.insertId,
        Motivo, 
        ValorDevolucion,
        EstadoDevolucion,
        IdCompra,
        IdUsuario,
    })
}

export const deleteDevolucioncompras = async (req,res)=> {
    const [result]=await pool.query('DELETE FROM DevolucionesCompras WHERE IdDevolucionesCompra=?',[req.params.id])
    if(result.affectedRows<=0) return res.status(404).json({
        message: 'Devolucion de Compra no encontrada'
    })
    res.send('devolucion de Compra eliminada')
}

export const putDevolucioncompras = async (req,res)=>{
    const{id}=req.params
    const{Motivo, ValorDevolucion,EstadoDevolucion,IdCompra,IdUsuario}=req.body
    const [result]= await pool.query('UPDATE DevolucionesCompras SET Motivo = IFNULL(?,Motivo), ValorDevolucion = IFNULL(?,ValorDevolucion, EstadoDevolucion = IFNULL(?,EstadoDevolucion, IdCompra = IFNULL(?,IdCompra, IdUsuario = IFNULL(?,IdUsuario,WHERE IdDevolucionesCompra=?',[Motivo, ValorDevolucion,EstadoDevolucion,IdCompra,IdUsuario,id])

    if(result.affectedRows===0)return res.status(404).json({
        message:'compra no encontrada'
    })

    const [rows] = await pool.query('SELECT*FROM DevolucionesCompras WHERE IdDevolucionesCompra=?',[id])
    res.json(rows[0])
}

