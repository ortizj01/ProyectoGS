import { pool } from '../db.js';

export const getDevolucionVentasProducto = async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM DevolucionVentaProducto');
    res.json(rows);
};

export const getDevolucionVentaProducto = async (req, res) => {
    const [rows] = await pool.query(`
        SELECT
            DVP.*,
            P.NombreProducto,
            P.PrecioProducto,
            DVP.CantidadProducto,
            P.PrecioProducto * DVP.CantidadProducto AS Valortotal
        FROM 
            DevolucionVentaProducto AS DVP
        LEFT JOIN 
            Productos AS P ON DVP.IdProducto = P.IdProducto
        WHERE 
            DVP.IdDevolucionVenta = ?
    `, [req.params.id]);
    
    if (rows.length <= 0) return res.status(404).json({
        message: 'Devolución de Producto de Venta no encontrada'
    });
    res.json(rows);
};

export const postDevolucionVentasProducto = async (req, res) => {
    const { IdDevolucionVenta, IdProducto, CantidadProducto, PrecioProducto } = req.body;

    try {
        const [productData] = await pool.query('SELECT Stock FROM Productos WHERE IdProducto = ?', [IdProducto]);
        if (productData.length === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        
        const [rows] = await pool.query(`
            INSERT INTO DevolucionVentaProducto (IdDevolucionVenta, IdProducto, CantidadProducto, PrecioProducto) 
            VALUES (?, ?, ?, ?)
        `, [IdDevolucionVenta, IdProducto, CantidadProducto, PrecioProducto]);

        await pool.query(`
            UPDATE Productos SET Stock = Stock + ? WHERE IdProducto = ?
        `, [CantidadProducto, IdProducto]);
        
        res.send({
            id: rows.insertId,
            IdDevolucionVenta, 
            IdProducto,
            CantidadProducto,
            PrecioProducto
        });
    } catch (error) {
        console.error('Error al añadir producto a la devolución:', error);
        res.status(500).json({ message: 'Error al añadir producto a la devolución' });
    }
};

export const deleteDevolucionVentasProducto = async (req, res) => {
    const [result] = await pool.query('DELETE FROM DevolucionVentaProducto WHERE IdDevolucionVentaProducto = ?', [req.params.id]);
    if (result.affectedRows <= 0) return res.status(404).json({
        message: 'Devolución de Producto de Venta no encontrada'
    });
    res.send('Devolución de Producto de Venta eliminada');
};

export const putDevolucionVentasProducto = async (req, res) => {
    const { id } = req.params;
    const { IdDevolucionVenta, IdProducto, CantidadProducto, PrecioProducto } = req.body;
    const [result] = await pool.query(`
        UPDATE DevolucionVentaProducto 
        SET IdDevolucionVenta = IFNULL(?, IdDevolucionVenta), IdProducto = IFNULL(?, IdProducto), CantidadProducto = IFNULL(?, CantidadProducto), PrecioProducto = IFNULL(?, PrecioProducto) 
        WHERE IdDevolucionVentaProducto = ?
    `, [IdDevolucionVenta, IdProducto, CantidadProducto, PrecioProducto, id]);

    if (result.affectedRows === 0) return res.status(404).json({
        message: 'Devolución de Producto de Venta no encontrada'
    });

    const [rows] = await pool.query('SELECT * FROM DevolucionVentaProducto WHERE IdDevolucionVentaProducto = ?', [id]);
    res.json(rows[0]);
};
