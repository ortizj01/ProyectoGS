import { pool } from '../db.js';

export const getVentas = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT v.*, CONCAT(u.Nombres, ' ', u.Apellidos) AS NombreCompleto, u.Documento
            FROM Ventas v 
            JOIN Usuarios u ON v.IdUsuario = u.IdUsuario
        `);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener las ventas' });
    }
};

export const getVenta = async (req, res) => {
    try {
        const { id } = req.params;
        const [venta] = await pool.query(`
            SELECT v.*, CONCAT(u.Nombres, ' ', u.Apellidos) AS NombreCompleto, u.*
            FROM Ventas v 
            JOIN Usuarios u ON v.IdUsuario = u.IdUsuario
            WHERE v.IdVenta = ?
        `, [id]);

        if (venta.length <= 0) return res.status(404).json({ message: 'Venta no encontrada' });

        const [productos] = await pool.query(`
            SELECT p.NombreProducto, vp.Cantidad 
            FROM VentasProducto vp 
            JOIN Productos p ON vp.IdProducto = p.IdProducto 
            WHERE vp.IdVenta = ?
        `, [id]);

        const [membresias] = await pool.query(`
            SELECT m.NombreMembresia, vm.Cantidad 
            FROM VentasMembresia vm 
            JOIN Membresias m ON vm.IdMembresia = m.IdMembresia 
            WHERE vm.IdVenta = ?
        `, [id]);

        res.json({ venta: venta[0], productos, membresias });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener la venta' });
    }
};

// Crear una nueva venta
export const crearVenta = async (req, res) => {
    const { IdUsuario, FechaVenta, PagoNeto, Iva, Total, EstadoVenta, productos, membresias } = req.body;
    const connection = await pool.getConnection();
    
    try {
        await connection.beginTransaction();
        
        const [result] = await connection.query(
            'INSERT INTO Ventas (IdUsuario, FechaVenta, PagoNeto, Iva, Total, EstadoVenta) VALUES (?, ?, ?, ?, ?, ?)', 
            [IdUsuario, FechaVenta, PagoNeto, Iva, Total, EstadoVenta]
        );

        const idVenta = result.insertId;

        if (productos && productos.length > 0) {
            for (const producto of productos) {
                await connection.query(
                    'INSERT INTO VentasProducto (IdVenta, IdProducto, Cantidad) VALUES (?, ?, ?)', 
                    [idVenta, producto.IdProducto, producto.Cantidad]
                );
            }
        }

        if (membresias && membresias.length > 0) {
            for (const membresia of membresias) {
                await connection.query(
                    'INSERT INTO VentasMembresia (IdVenta, IdMembresia, Cantidad) VALUES (?, ?, ?)', 
                    [idVenta, membresia.IdMembresia, membresia.Cantidad]
                );
            }
        }

        await connection.commit();
        
        res.status(201).json({ id: idVenta, IdUsuario, FechaVenta, PagoNeto, Iva, Total, EstadoVenta, productos, membresias });
    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ error: 'Error al crear la venta' });
    } finally {
        connection.release();
    }
};

// Actualizar una venta
export const actualizarVenta = async (req, res) => {
    const { IdVenta } = req.params;
    const { IdUsuario, FechaVenta, PagoNeto, Iva, Total, EstadoVenta, productos, membresias } = req.body;
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const [result] = await connection.query(
            'UPDATE Ventas SET IdUsuario = ?, FechaVenta = ?, PagoNeto = ?, Iva = ?, Total = ?, EstadoVenta = ? WHERE IdVenta = ?', 
            [IdUsuario, FechaVenta, PagoNeto, Iva, Total, EstadoVenta, IdVenta]
        );

        if (result.affectedRows === 0) {
            await connection.rollback();
            return res.status(404).json({ error: 'Venta no encontrada' });
        }

        await connection.query('DELETE FROM VentasProducto WHERE IdVenta = ?', [IdVenta]);
        await connection.query('DELETE FROM VentasMembresia WHERE IdVenta = ?', [IdVenta]);

        if (productos && productos.length > 0) {
            for (const producto of productos) {
                await connection.query(
                    'INSERT INTO VentasProducto (IdVenta, IdProducto, Cantidad) VALUES (?, ?, ?)', 
                    [IdVenta, producto.IdProducto, producto.Cantidad]
                );
            }
        }

        if (membresias && membresias.length > 0) {
            for (const membresia of membresias) {
                await connection.query(
                    'INSERT INTO VentasMembresia (IdVenta, IdMembresia, Cantidad) VALUES (?, ?, ?)', 
                    [IdVenta, membresia.IdMembresia, membresia.Cantidad]
                );
            }
        }

        await connection.commit();

        res.json({ IdVenta, IdUsuario, FechaVenta, PagoNeto, Iva, Total, EstadoVenta, productos, membresias });
    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar la venta' });
    } finally {
        connection.release();
    }
};

// Eliminar una venta
export const eliminarVenta = async (req, res) => {
    const { IdVenta } = req.params;

    try {
        const [result] = await pool.query('DELETE FROM Ventas WHERE IdVenta = ?', [IdVenta]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Venta no encontrada' });

        await pool.query('DELETE FROM VentasProducto WHERE IdVenta = ?', [IdVenta]);
        await pool.query('DELETE FROM VentasMembresia WHERE IdVenta = ?', [IdVenta]);

        res.sendStatus(204);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar la venta' });
    }
};
