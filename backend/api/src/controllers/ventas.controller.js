import { pool } from '../db.js';

// Obtener detalles de una venta específica
export const getVentaDetalle = async (req, res) => {
    const { id } = req.params;

    try {
        // Obtener la venta
        const [venta] = await pool.query(`
            SELECT 
                v.FechaVenta,
                v.Total,
                CONCAT(u.Nombres, ' ', u.Apellidos) AS NombreCompleto,
                u.Documento,
                ev.NombreEstado AS EstadoVenta
            FROM 
                Ventas v
            JOIN 
                Usuarios u ON v.IdUsuario = u.IdUsuario
            JOIN 
                EstadosVentas ev ON v.EstadoVenta = ev.IdEstadoVenta
            WHERE 
                v.IdVenta = ?
        `, [id]);

        if (venta.length === 0) {
            return res.status(404).json({ message: 'Venta no encontrada' });
        }

        // Obtener productos de la venta
        const [productos] = await pool.query(`
            SELECT 
                p.NombreProducto,
                vp.Cantidad
            FROM 
                VentasProducto vp
            JOIN 
                Productos p ON vp.IdProducto = p.IdProducto
            WHERE 
                vp.IdVenta = ?
        `, [id]);

        // Obtener membresías de la venta
        const [membresias] = await pool.query(`
            SELECT 
                m.NombreMembresia,
                vm.Cantidad
            FROM 
                VentasMembresia vm
            JOIN 
                Membresias m ON vm.IdMembresia = m.IdMembresia
            WHERE 
                vm.IdVenta = ?
        `, [id]);

        // Responder con los detalles de la venta
        res.json({
            ...venta[0],
            productos,
            membresias
        });
    } catch (error) {
        console.error('Error al obtener los detalles de la venta:', error);
        res.status(500).json({ error: 'Error al obtener los detalles de la venta' });
    }
};

// Obtener todas las ventas
export const getVentas = async (req, res) => {
    try {
        const [ventas] = await pool.query(`
            SELECT 
                v.IdVenta,
                v.FechaVenta,
                v.Total,
                CONCAT(u.Nombres, ' ', u.Apellidos) AS NombreCompleto,
                u.Documento,
                ev.NombreEstado AS EstadoVenta
            FROM 
                Ventas v
            JOIN 
                Usuarios u ON v.IdUsuario = u.IdUsuario
            JOIN 
                EstadosVentas ev ON v.EstadoVenta = ev.IdEstadoVenta
        `);

        for (const venta of ventas) {
            // Obtener productos asociados
            const [productos] = await pool.query(`
                SELECT 
                    p.NombreProducto,
                    vp.Cantidad,
                    p.PrecioProducto AS PrecioUnitario
                FROM 
                    VentasProducto vp
                JOIN 
                    Productos p ON vp.IdProducto = p.IdProducto
                WHERE 
                    vp.IdVenta = ?
            `, [venta.IdVenta]);

            // Obtener membresías asociadas
            const [membresias] = await pool.query(`
                SELECT 
                    m.NombreMembresia,
                    vm.Cantidad
                FROM 
                    VentasMembresia vm
                JOIN 
                    Membresias m ON vm.IdMembresia = m.IdMembresia
                WHERE 
                    vm.IdVenta = ?
            `, [venta.IdVenta]);

            venta.productos = productos;
            venta.membresias = membresias;
        }

        res.json(ventas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener las ventas' });
    }
};


// Crear una nueva venta
export const crearVenta = async (req, res) => {
    const { IdUsuario, FechaVenta, Total, productos, membresias } = req.body; // Eliminamos EstadoVenta porque será predeterminado
    const connection = await pool.getConnection();
    
    try {
        await connection.beginTransaction();
        
        // Establecer estado inicial a "Activo" (suponiendo que 1 es el ID para "Activo")
        const estadoInicial = 1; // Cambia este valor si el ID del estado "Activo" es diferente
        
        const [result] = await connection.query(
            'INSERT INTO Ventas (IdUsuario, FechaVenta, Total, EstadoVenta) VALUES (?, ?, ?, ?)', 
            [IdUsuario, FechaVenta, Total, estadoInicial]
        );

        const idVenta = result.insertId;

        if (productos && productos.length > 0) {
            for (const producto of productos) {
                if (producto.IdProducto !== "Agregar producto a la venta") {
                    // Obtener el stock actual del producto
                    const [stockData] = await connection.query('SELECT Stock FROM Productos WHERE IdProducto = ?', [producto.IdProducto]);
                    const currentStock = stockData[0].Stock;

                    // Validar el stock
                    if (currentStock < producto.Cantidad) {
                        await connection.rollback();
                        return res.status(400).json({ error: `El producto con ID ${producto.IdProducto} no tiene suficiente stock. Disponible: ${currentStock}, Solicitado: ${producto.Cantidad}` });
                    }

                    // Insertar el producto en VentasProducto
                    await connection.query(
                        'INSERT INTO VentasProducto (IdVenta, IdProducto, Cantidad) VALUES (?, ?, ?)', 
                        [idVenta, producto.IdProducto, producto.Cantidad]
                    );

                    // Restar la cantidad de productos vendidos del stock
                    await connection.query(
                        'UPDATE Productos SET Stock = Stock - ? WHERE IdProducto = ?', 
                        [producto.Cantidad, producto.IdProducto]
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
        
        res.status(201).json({ id: idVenta, IdUsuario, FechaVenta, Total, EstadoVenta: estadoInicial, productos, membresias });
    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ error: 'Error al crear la venta' });
    } finally {
        connection.release();
    }
};

// Cambiar el estado de una venta
export const cambiarEstadoVenta = async (req, res) => {
    const { id } = req.params;
    const { nuevoEstado } = req.body; // Recibir el nuevo estado desde el cliente

    let connection;

    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        // Obtener el estado actual de la venta para verificar si ya estaba anulado
        const [ventaActual] = await connection.query('SELECT EstadoVenta FROM Ventas WHERE IdVenta = ?', [id]);
        
        if (ventaActual.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'Venta no encontrada' });
        }

        const estadoActual = ventaActual[0].EstadoVenta;

        // Cambiar el estado de la venta
        const [result] = await connection.query('UPDATE Ventas SET EstadoVenta = ? WHERE IdVenta = ?', [nuevoEstado, id]);

        if (result.affectedRows === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'Venta no encontrada' });
        }

        // Si el nuevo estado es 'Anulado' y el estado anterior no era 'Anulado', restaurar el stock de productos
        if (nuevoEstado === 2 && estadoActual !== 2) { // Suponiendo que 2 es el estado para 'Anulado'
            const [productos] = await connection.query('SELECT IdProducto, Cantidad FROM VentasProducto WHERE IdVenta = ?', [id]);
            for (const producto of productos) {
                await connection.query('UPDATE Productos SET Stock = Stock + ? WHERE IdProducto = ?', [producto.Cantidad, producto.IdProducto]);
            }
        }

        await connection.commit();
        res.status(200).json({ message: 'Estado de la venta actualizado con éxito' });
    } catch (error) {
        console.error(error);
        if (connection) {
            await connection.rollback();
        }
        res.status(500).json({ error: 'Error al actualizar el estado de la venta' });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};