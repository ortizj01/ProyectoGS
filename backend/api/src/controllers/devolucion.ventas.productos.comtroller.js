import { pool } from '../db.js';

export const getDevolucionVentasProducto = async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM DevolucionesVentasProducto');
    res.json(rows);
}

export const getDevolucionVentaProducto = async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM DevolucionesVentasProducto WHERE IdDevolucionesVentaProducto = ?', [req.params.id]);
    
    if (rows.length <= 0) return res.status(404).json({
        message: 'Devolución de Producto de Venta no encontrada'
    });
    res.json(rows[0]);
}

export const postDevolucionVentasProducto = async (req, res) => {
    const { IdDevolucionesVenta, IdProducto, CantidadProducto, PrecioUnitario } = req.body;
    const [rows] = await pool.query(
        'INSERT INTO DevolucionesVentasProducto (IdDevolucionesVenta, IdProducto, CantidadProducto, PrecioUnitario) VALUES (?, ?, ?, ?)', 
        [IdDevolucionesVenta, IdProducto, CantidadProducto, PrecioUnitario]
    );
    await pool.query('UPDATE Productos SET Stock = Stock + ? WHERE IdProducto = ?', [CantidadProducto, IdProducto]);
    res.send({
        id: rows.insertId,
        IdDevolucionesVenta, 
        IdProducto,
        CantidadProducto,
        PrecioUnitario
    });
}

export const deleteDevolucionVentasProducto = async (req, res) => {
    const [result] = await pool.query('DELETE FROM DevolucionesVentasProducto WHERE IdDevolucionesVentaProducto = ?', [req.params.id]);
    if (result.affectedRows <= 0) return res.status(404).json({
        message: 'Devolución de Producto de Venta no encontrada'
    });
    res.send('Devolución de Producto de Venta eliminada');
}

export const putDevolucionVentasProducto = async (req, res) => {
    const { id } = req.params;
    const { IdDevolucionesVenta, IdProducto, CantidadProducto, PrecioUnitario } = req.body;
    const [result] = await pool.query(
        'UPDATE DevolucionesVentasProducto SET IdDevolucionesVenta = IFNULL(?, IdDevolucionesVenta), IdProducto = IFNULL(?, IdProducto), CantidadProducto = IFNULL(?, CantidadProducto), PrecioUnitario = IFNULL(?, PrecioUnitario) WHERE IdDevolucionesVentaProducto = ?', 
        [IdDevolucionesVenta, IdProducto, CantidadProducto, PrecioUnitario, id]
    );

    if (result.affectedRows === 0) return res.status(404).json({
        message: 'Devolución de Producto de Venta no encontrada'
    });

    const [rows] = await pool.query('SELECT * FROM DevolucionesVentasProducto WHERE IdDevolucionesVentaProducto = ?', [id]);
    res.json(rows[0]);
}
