import { pool } from '../db.js';

// Obtener todas las ventas
export const getVentas = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                v.IdVenta,
                v.FechaVenta,
                v.Total,
                CONCAT(u.Nombres, ' ', u.Apellidos) AS NombreCompleto,
                u.Documento
            FROM 
                Ventas v
            JOIN 
                Usuarios u ON v.IdUsuario = u.IdUsuario
        `);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener las ventas' });
    }
};

// Obtener productos de una venta específica
export const getProductosDeVenta = async (req, res) => {
    try {
        const { id } = req.params;
        const [productos] = await pool.query(`
            SELECT 
                p.IdProducto,
                p.NombreProducto,
                vp.Cantidad AS Cantidad,
                vp.PrecioUnitario
            FROM 
                VentasProducto vp
            JOIN 
                Productos p ON vp.IdProducto = p.IdProducto
            WHERE 
                vp.IdVenta = ?
        `, [id]);

        if (productos.length <= 0) return res.status(404).json({ message: 'No se encontraron productos para esta venta' });

        res.json(productos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener productos de la venta' });
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
                if (producto.IdProducto !== "Agregar producto a la venta") {
                    await connection.query(
                        'INSERT INTO VentasProducto (IdVenta, IdProducto, Cantidad) VALUES (?, ?, ?)', 
                        [idVenta, producto.IdProducto, producto.Cantidad]
                    );
                }
            }
        }

        if (membresias && membresias.length > 0) {
            for (const membresia of membresias) {
                if (membresia.IdMembresia !== "Agregar membresía a la venta") {
                    await connection.query(
                        'INSERT INTO VentasMembresia (IdVenta, IdMembresia, Cantidad) VALUES (?, ?, ?)', 
                        [idVenta, membresia.IdMembresia, membresia.Cantidad]
                    );
                }
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
        const [result] = await connection.query('UPDATE Ventas SET EstadoVenta = 2 WHERE IdVenta = ?', [id]);

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

