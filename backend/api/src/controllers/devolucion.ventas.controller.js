import { pool } from '../db.js';

export const getDevolucionVentas = async (req, res) => {
    const [rows] = await pool.query(
        `SELECT
            DV.*,
            v.FechaVenta,
            v.Total,
            DATE_FORMAT(DV.FechaDevolucion, '%Y-%m-%d') AS FechaVentaFormatted,
            CASE 
                WHEN DV.EstadoDevolucion = 1 THEN 'Activo'
                WHEN DV.EstadoDevolucion = 0 THEN 'Inactivo'
                ELSE 'estado no definido'
            END AS estado_descripcion
        FROM 
            DevolucionVenta DV
        LEFT JOIN 
            Ventas v ON DV.IdVenta = v.IdVenta`
    );
    res.json(rows);
}

export const getDevolucionVenta = async (req, res) => {
    const [rows] = await pool.query(
        `SELECT
            v.FechaVenta,
            v.Total,
            u.Nombres AS NombreUsuario,
            u.Apellidos AS ApellidosUsuario,
            u.Documento
        FROM 
            Ventas v
        LEFT JOIN 
            Usuarios u ON v.IdUsuario = u.IdUsuario
        LEFT JOIN 
            DevolucionVenta DV ON DV.IdVenta = v.IdVenta
        WHERE 
            v.IdVenta = ?`,
        [req.params.id]
    );
    
    if (rows.length <= 0) return res.status(404).json({
        message: 'Venta no encontrada'
    });
    res.json(rows[0]);
}

export const postDevolucionVentas = async (req, res) => {
    const { Motivo, ValorDevolucionVenta, EstadoDevolucion, IdVenta, FechaDevolucion } = req.body;
    const [rows] = await pool.query(
        'INSERT INTO DevolucionVenta (Motivo, ValorDevolucionVenta, EstadoDevolucion, IdVenta, FechaDevolucion) VALUES (?, ?, ?, ?, ?)', 
        [Motivo, ValorDevolucionVenta, EstadoDevolucion, IdVenta, FechaDevolucion]
    );
    res.send({
        id: rows.insertId,
        Motivo, 
        ValorDevolucionVenta,
        EstadoDevolucion,
        IdVenta,
        FechaDevolucion,
    });
}

export const deleteDevolucionVentas = async (req, res) => {
    const [result] = await pool.query('DELETE FROM DevolucionesVentas WHERE IdDevolucionVenta = ?', [req.params.id]);
    if (result.affectedRows <= 0) return res.status(404).json({
        message: 'Devolución de Venta no encontrada'
    });
    res.send('Devolución de Venta eliminada');
}

export const putDevolucionVentas = async (req, res) => {
    const { id } = req.params;
    const { Motivo, ValorDevolucionVenta, EstadoDevolucion, IdVenta } = req.body;
    const [result] = await pool.query(
        'UPDATE DevolucionesVentas SET Motivo = IFNULL(?, Motivo), ValorDevolucionVenta = IFNULL(?, ValorDevolucionVenta), EstadoDevolucion = IFNULL(?, EstadoDevolucion), IdVenta = IFNULL(?, IdVenta) WHERE IdDevolucionVenta = ?', 
        [Motivo, ValorDevolucionVenta, EstadoDevolucion, IdVenta, id]
    );

    if (result.affectedRows === 0) return res.status(404).json({
        message: 'Devolución de Venta no encontrada'
    });

    const [rows] = await pool.query('SELECT * FROM DevolucionesVentas WHERE IdDevolucionVenta = ?', [id]);
    res.json(rows[0]);
}
