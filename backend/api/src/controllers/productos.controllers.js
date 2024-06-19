import {pool} from '../db.js'

export const getProductos = async (req,res)=> {
const [rows] =await pool.query(
    `SELECT
    p.*,
    cp.NombreCategoriaProductos AS Nombre_categoria,
    CASE 
        WHEN p.EstadoProducto = 1 THEN 'Activo'
        WHEN p.EstadoProducto = 0 THEN 'Inactivo'
        ELSE 'estado no definido'
    END AS estado_descripcion
FROM 
    Productos p
LEFT JOIN 
    CategoriaProductos cp ON p.IdCategoriaProductos = cp.IdCategoriaProductos`)
res.json(rows)
}

export const getProducto = async (req,res)=> {
    const [rows] =await pool.query('SELECT*FROM Productos WHERE IdProducto=?',[req.params.id])
    
    if(rows.length<=0)return res.status(404).json({
        message: 'producto no encontrado'
    })
    res.json(rows[0])
    }

export const postProductos = async (req,res)=> {
    const {NombreProducto,PrecioProducto,IvaProducto,Stock,Imagen,EstadoProducto,IdCategoriaProductos} = req.body
    const [rows] = await pool.query('INSERT INTO Productos(NombreProducto,PrecioProducto,IvaProducto,Stock,Imagen,EstadoProducto,IdCategoriaProductos)VALUES(?,?,?,?,?,?,?)',[NombreProducto,PrecioProducto,IvaProducto,Stock,Imagen,EstadoProducto,IdCategoriaProductos])
    res.send({
        id:rows.insertId,
        NombreProducto,
        PrecioProducto,
        IvaProducto,
        Stock,
        Imagen,
        EstadoProducto,
        IdCategoriaProductos,
    })
}

export const deleteProductos = async (req,res)=> {
    const [result]=await pool.query('DELETE FROM Productos WHERE IdProducto=?',[req.params.id])
    if(result.affectedRows<=0) return res.status(404).json({
        message: 'Categoria no encontrado'
    })
    res.send('producto eliminada')
}

export const putProductos = async (req,res)=>{
    const{id}=req.params
    const{NombreProducto,PrecioProducto,IvaProducto,Stock,Imagen,EstadoProducto,IdCategoriaProductos}=req.body
    const [result]= await pool.query('UPDATE Productos SET NombreProducto = IFNULL(?,NombreProducto), PrecioProducto = IFNULL(?,PrecioProducto),IvaProducto = IFNULL(?,IvaProducto),Stock = IFNULL(?,Stock),Imagen = IFNULL(?,Imagen),EstadoProducto = IFNULL(?,EstadoProducto),IdCategoriaProductos = IFNULL(?,IdCategoriaProductos) WHERE IdProducto=?',[NombreProducto,PrecioProducto,IvaProducto,Stock,Imagen,EstadoProducto,IdCategoriaProductos,id])

    if(result.affectedRows===0)return res.status(404).json({
        message:'producto no encontrado'
    })

    const [rows] = await pool.query('SELECT*FROM Productos WHERE IdProducto=?',[id])
    res.json(rows[0])
}

