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

export const crearVenta = async (req, res) => {
    const { IdUsuario, FechaVenta, Total, EstadoVenta, productos, membresias } = req.body;
    const connection = await pool.getConnection();
    
    try {
        await connection.beginTransaction();
        
        const [result] = await connection.query(
            'INSERT INTO Ventas (IdUsuario, FechaVenta, Total, EstadoVenta) VALUES (?, ?, ?, ?)', 
            [IdUsuario, FechaVenta, Total, EstadoVenta]
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
        
        res.status(201).json({ id: idVenta, IdUsuario, FechaVenta, Total, EstadoVenta, productos, membresias });
    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ error: 'Error al crear la venta' });
    } finally {
        connection.release();
    }
};

export const anularVenta = async (req, res) => {
    const { id } = req.params;
    let connection;

    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        // Anular la venta
        const [result] = await connection.query('UPDATE Ventas SET EstadoVenta = "Anulado" WHERE IdVenta = ?', [id]);

        if (result.affectedRows === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'Venta no encontrada' });
        }

        // Restaurar stock de productos
        const [productos] = await connection.query('SELECT IdProducto, Cantidad FROM VentasProducto WHERE IdVenta = ?', [id]);
        for (const producto of productos) {
            await connection.query('UPDATE Productos SET Stock = Stock + ? WHERE IdProducto = ?', [producto.Cantidad, producto.IdProducto]);
        }

        await connection.commit();
        res.status(200).json({ message: 'Venta anulada con éxito' });
    } catch (error) {
        console.error(error);
        if (connection) {
            await connection.rollback();
        }
        res.status(500).json({ error: 'Error al anular la venta' });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};
