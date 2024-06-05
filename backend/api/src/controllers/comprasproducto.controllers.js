import {pool} from '../db.js'

export const getComprasProducto = async (req,res)=> {
const [rows] =await pool.query('SELECT*FROM ComprasProducto')
res.json(rows)
}   

export const getCompraProducto = async (req,res)=> {
    const [rows] =await pool.query('SELECT*FROM ComprasProducto WHERE IdCompraProducto=?',[req.params.id])
    
    if(rows.length<=0)return res.status(404).json({
        message: 'Compras Producto no encontrada'
    })
    res.json(rows[0])
    }

export const postComprasProducto = async (req,res)=> {
    const {IdCompra, IdProducto,CantidadProducto} = req.body
    const [rows] = await pool.query('INSERT INTO ComprasProducto(IdCompra, IdProducto,CantidadProducto)VALUES(?,?,?)',[IdCompra,IdProducto,CantidadProducto])
    res.send({
        id:rows.insertId,
        IdCompra, 
        IdProducto,
        CantidadProducto,
    })
}

export const deleteComprasProducto = async (req,res)=> {
    const [result]=await pool.query('DELETE FROM ComprasProducto WHERE IdCompraProducto=?',[req.params.id])
    if(result.affectedRows<=0) return res.status(404).json({
        message: 'Compras Producto no encontrado'
    })
    res.send('Compras Producto eliminada')
}

export const putComprasProducto = async (req,res)=>{
    const{id}=req.params
    const{IdCompra, IdProducto,CantidadProducto}=req.body
    const [result]= await pool.query('UPDATE ComprasProducto SET IdCompra = IFNULL(?,IdCompra), IdProducto = IFNULL(?,IdProducto),CantidadProducto = IFNULL(?,CantidadProducto) WHERE IdCompraProducto=?',[IdCompra, IdProducto,CantidadProducto,id])

    if(result.affectedRows===0)return res.status(404).json({
        message:'Compras Producto no encontrado'
    })

    const [rows] = await pool.query('SELECT*FROM ComprasProducto WHERE IdCompraProducto=?',[id])
    res.json(rows[0])
}

