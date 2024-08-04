import { pool } from '../db.js';

export const getDevolucionVentasProducto = async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM DevolucionVentaProducto');
    res.json(rows);
}

export const getDevolucionVentaProducto = async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM DevolucionVentaProducto WHERE IdDevolucionVentaProducto = ?', [req.params.id]);
    
    if (rows.length <= 0) return res.status(404).json({
        message: 'Devolución de Producto de Venta no encontrada'
    });
    res.json(rows[0]);
}

export const postDevolucionVentasProducto = async (req, res) => {
    const { IdDevolucionVenta, IdProducto, CantidadProducto, PrecioUnitario } = req.body;
    const [rows] = await pool.query(
        'INSERT INTO DevolucionVentaProducto (IdDevolucionVenta, IdProducto, CantidadProducto, PrecioUnitario) VALUES (?, ?, ?, ?)', 
        [IdDevolucionVenta, IdProducto, CantidadProducto, PrecioUnitario]
    );
    await pool.query('UPDATE Productos SET Stock = Stock + ? WHERE IdProducto = ?', [CantidadProducto, IdProducto]);
    res.send({
        id: rows.insertId,
        IdDevolucionVenta, 
        IdProducto,
        CantidadProducto,
        PrecioUnitario
    });
}

export const deleteDevolucionVentasProducto = async (req, res) => {
    const [result] = await pool.query('DELETE FROM DevolucionVentaProducto WHERE IdDevolucionVentaProducto = ?', [req.params.id]);
    if (result.affectedRows <= 0) return res.status(404).json({
        message: 'Devolución de Producto de Venta no encontrada'
    });
    res.send('Devolución de Producto de Venta eliminada');
}

export const putDevolucionVentasProducto = async (req, res) => {
    const { id } = req.params;
    const { IdDevolucionVenta, IdProducto, CantidadProducto, PrecioUnitario } = req.body;
    const [result] = await pool.query(
        'UPDATE DevolucionVentaProducto SET IdDevolucionVenta = IFNULL(?, IdDevolucionVenta), IdProducto = IFNULL(?, IdProducto), CantidadProducto = IFNULL(?, CantidadProducto), PrecioUnitario = IFNULL(?, PrecioUnitario) WHERE IdDevolucionVentaProducto = ?', 
        [IdDevolucionVenta, IdProducto, CantidadProducto, PrecioUnitario, id]
    );

    if (result.affectedRows === 0) return res.status(404).json({
        message: 'Devolución de Producto de Venta no encontrada'
    });

    const [rows] = await pool.query('SELECT * FROM DevolucionVentaProducto WHERE IdDevolucionVentaProducto = ?', [id]);
    res.json(rows[0]);
}
