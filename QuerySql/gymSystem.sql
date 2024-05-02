CREATE DATABASE GymSystem;
USE GymSystem;

DROP database GymSystem;


/* TABLAS PADRE */

-- Roles
CREATE TABLE Roles (
    IdRol INT NOT NULL AUTO_INCREMENT ,
    NombreRol VARCHAR(50) NOT NULL,
    EstadoRol BIT NOT NULL,
    CONSTRAINT PK_Roles PRIMARY KEY (IdRol)
);

-- Permisos
CREATE TABLE Permisos (
    IdPermiso INT NOT NULL AUTO_INCREMENT ,
    NombrePermiso VARCHAR(50) NOT NULL,
    CONSTRAINT PK_Permisos PRIMARY KEY (IdPermiso),
    CONSTRAINT UC_Permisos_NombrePermiso UNIQUE (NombrePermiso)
);

-- Clientes
CREATE TABLE Clientes (
    IdCliente INT NOT NULL AUTO_INCREMENT ,
    NombreCliente VARCHAR(255) NOT NULL,
    CorreoCliente VARCHAR(255) NOT NULL,
    DireccionCliente VARCHAR(255) NOT NULL,
    TelefonoCliente INT NOT NULL,
    DocumentoCliente INT NOT NULL,
    EstadoCliente BIT NOT NULL,
    CONSTRAINT PK_Clientes PRIMARY KEY (IdCliente),
    CONSTRAINT UC_Clientes_NombreCliente UNIQUE (NombreCliente, DocumentoCliente),
    CONSTRAINT CHK_Clientes_NombreCliente CHECK (NombreCliente LIKE '%[A-Za-z]%')
);

-- Rutinas
CREATE TABLE Rutinas (
    IdRutina INT NOT NULL AUTO_INCREMENT ,
    NombreRutina VARCHAR(255) NOT NULL,
    RepeticioneseEjercicio INT NOT NULL,
    EstadoRutina BIT NOT NULL DEFAULT 1,
    IdUsuario INT,
    CONSTRAINT PK_Rutina PRIMARY KEY (IdRutina),
    CONSTRAINT FK_Rutina_Usuario FOREIGN KEY (IdUsuario) REFERENCES Usuarios(IdUsuario),
    CONSTRAINT UC_Rutina_NombreRutina UNIQUE (NombreRutina),
    CONSTRAINT CHK_Rutina_NombreRutina CHECK (NombreRutina LIKE '%[A-Za-z]%')
);

-- Ejercicios
CREATE TABLE Ejercicios (
    IdEjercicio INT NOT NULL AUTO_INCREMENT ,
    NombreEjercicio VARCHAR(255) NOT NULL,
    DescripcionEjercicio VARCHAR(255) NOT NULL,
    RepeticionesEjercicio INT NOT NULL,
    EstadoEjercicio BIT NOT NULL DEFAULT 1,
    CONSTRAINT PK_Ejercicio PRIMARY KEY (IdEjercicio),
    CONSTRAINT UC_Ejercicio_NombreEjercicio UNIQUE (NombreEjercicio),
    CONSTRAINT CHK_Ejercicio_NombreEjercicio CHECK (NombreEjercicio LIKE '%[A-Za-z]%')
);

-- Proveedores
CREATE TABLE Proveedores (
    IdProveedores INT NOT NULL AUTO_INCREMENT ,
    NombreProveedor VARCHAR(255) NOT NULL,
    NombreContactoProveedor VARCHAR(255) NOT NULL,
    Telefono INT NOT NULL,
    Direccion VARCHAR(255) NOT NULL,
    NIT INT NOT NULL,
    EstadoProveedores BIT NOT NULL DEFAULT 1,
    CONSTRAINT PK_Proveedores PRIMARY KEY (IdProveedores),
    CONSTRAINT UC_Proveedor_NombreProveedor UNIQUE (NombreProveedor, NIT),
    CONSTRAINT CHK_Proveedores_NombreContactoProveedor CHECK (NombreContactoProveedor LIKE '%[A-Za-z]%')
);

-- CategoriaProductos
CREATE TABLE CategoriaProductos (
    IdCategoriaProductos INT NOT NULL AUTO_INCREMENT ,
    NombreCategoriaProductos VARCHAR(255) NOT NULL,
    EstadoCategoriaProductos BIT NOT NULL DEFAULT 1,
    CONSTRAINT PK_CategoriaProductos PRIMARY KEY (IdCategoriaProductos),
    CONSTRAINT UC_CategoriaProductos_NombreCategoriaProductos UNIQUE (NombreCategoriaProductos),
    CONSTRAINT CHK_CategoriaProductos_NombreCategoriaProductos CHECK (NombreCategoriaProductos LIKE '[A-Z]%[A-Za-z0-9]' OR NombreCategoriaProductos LIKE '[A-Z]')
);

-- Membresias
CREATE TABLE Membresias (
    IdMembresia INT NOT NULL AUTO_INCREMENT ,
    IdServicio INT NOT NULL,
    NombreMembresia VARCHAR(255) NOT NULL,
    Tiempo INT NOT NULL,
    Cantidad INT NOT NULL,
    FechaInicio DATE NOT NULL,
    FechaFin DATE NOT NULL,
    CostoTotal FLOAT NOT NULL,
    CostoVenta FLOAT NOT NULL,
    Estado BIT NOT NULL,
    CONSTRAINT PK_Membresias PRIMARY KEY (IdMembresia),
    CONSTRAINT FK_Membresias_Servicio FOREIGN KEY (IdServicio) REFERENCES Servicios(IdServicio),
    CONSTRAINT CHK_Membresias_Tiempo CHECK (Tiempo > 0),
    CONSTRAINT CHK_Membresias_Cantidad CHECK (Cantidad > 0),
    CONSTRAINT CHK_Membresias_Fechas CHECK (FechaInicio <= FechaFin),
    CONSTRAINT CHK_Membresias_Costos CHECK (CostoTotal >= 0 AND CostoVenta >= 0)
);

-- Servicios
CREATE TABLE Servicios (
    IdServicio INT NOT NULL AUTO_INCREMENT ,
    NombreClase VARCHAR(255) NOT NULL,
    Instructor VARCHAR(255) NOT NULL,
    Cantidad INT NOT NULL,
    FechaInicio DATE NOT NULL,
    FechaFin DATE NOT NULL,
    CostoTotal FLOAT NOT NULL,
    CostoVenta FLOAT NOT NULL,
    Estado BIT NOT NULL,
    CONSTRAINT PK_Servicios PRIMARY KEY (IdServicio),
    CONSTRAINT CHK_Servicios_Cantidad CHECK (Cantidad > 0),
    CONSTRAINT CHK_Servicios_Fechas CHECK (FechaInicio <= FechaFin),
    CONSTRAINT CHK_Servicios_Costos CHECK (CostoTotal >= 0 AND CostoVenta >= 0)
);

-- Usuarios
CREATE TABLE Usuarios (
    IdUsuario INT NOT NULL AUTO_INCREMENT ,
    IdRol INT NOT NULL,
    Documento VARCHAR(255) NOT NULL,
    TipoDocumento VARCHAR(255) NOT NULL,
    Nombre VARCHAR(255) NOT NULL,
    Correo VARCHAR(255) NOT NULL,
    Telefono INT NOT NULL,
    Contrasena VARCHAR(255) NOT NULL,
    ConfirmarContrasena VARCHAR(255) NOT NULL,
    Estado BIT NOT NULL,
    CONSTRAINT PK_Usuarios PRIMARY KEY (IdUsuario),
    CONSTRAINT FK_Usuarios_Roles FOREIGN KEY (IdRol) REFERENCES Roles(IdRol),
    CONSTRAINT CHK_Usuarios_Telefono CHECK (Telefono > 0),
    CONSTRAINT CHK_Usuarios_Contrasenas CHECK (Contrasena = ConfirmarContrasena)
);

/* TABLAS DETALLE */

-- RutinasEjercicios
CREATE TABLE RutinasEjercicios(
    IdRutinaEjercicio INT NOT NULL AUTO_INCREMENT ,
    IdRutina INT,
    IdEjercicio INT,
    CONSTRAINT PK_RutinasEjercicios PRIMARY KEY (IdRutinaEjercicio),
    CONSTRAINT FK_RutinasEjercicios_Rutinas FOREIGN KEY (IdRutina) REFERENCES Rutinas(IdRutina),
    CONSTRAINT FK_RutinasEjercicios_Ejercicios FOREIGN KEY (IdEjercicio) REFERENCES Ejercicios(IdEjercicio)
);

-- RutinasEjerciciosDiaSemana
CREATE TABLE RutinasEjerciciosDiaSemana (
    IdRutinaEjercicioDiaSemana INT NOT NULL AUTO_INCREMENT ,
    IdRutinaEjercicio INT,
    DiaSemana INT NOT NULL,
    CONSTRAINT PK_RutinasEjerciciosDiaSemana PRIMARY KEY (IdRutinaEjercicioDiaSemana),
    CONSTRAINT FK_RutinasEjerciciosDiaSemana_RutinasEjercicios FOREIGN KEY (IdRutinaEjercicio) REFERENCES RutinasEjercicios(IdRutinaEjercicio),
    CONSTRAINT CHK_RutinasEjerciciosDiaSemana_DiaSemana CHECK (DiaSemana BETWEEN 1 AND 7)
);

/* TABLAS CON FK */

-- PermisoRoles
CREATE TABLE PermisoRoles (
    IdPermisoRol INT NOT NULL AUTO_INCREMENT ,
    IdRol INT,
    IdPermiso INT,
    CONSTRAINT PK_PermisoRoles PRIMARY KEY (IdPermisoRol),
    CONSTRAINT FK_PermisoRoles_Roles FOREIGN KEY (IdRol) REFERENCES Roles(IdRol),
    CONSTRAINT FK_PermisoRoles_Permisos FOREIGN KEY (IdPermiso) REFERENCES Permisos(IdPermiso)
);

-- Ventas
CREATE TABLE Ventas(
    IdVenta INT NOT NULL AUTO_INCREMENT ,
    IdCliente INT,
    IdProducto INT,
    IdMembresia INT,
    FechaVenta DATE NOT NULL,
    PagoNeto FLOAT NOT NULL,
    Iva FLOAT NOT NULL,
    Total FLOAT NOT NULL,
    EstadoVenta VARCHAR(50) NOT NULL,
    CONSTRAINT PK_Ventas PRIMARY KEY (IdVenta),
    CONSTRAINT FK_Ventas_Clientes FOREIGN KEY (IdCliente) REFERENCES Clientes(IdCliente),
    CONSTRAINT FK_Ventas_Productos FOREIGN KEY (IdProducto) REFERENCES Productos(IdProducto),
    CONSTRAINT FK_Ventas_Membresias FOREIGN KEY (IdMembresia) REFERENCES Membresias(IdMembresia),
    CONSTRAINT CHK_Ventas_Iva CHECK (Iva >= 0)
);

-- DevolucionVenta
CREATE TABLE DevolucionVenta (
    IdDevolucionVenta INT NOT NULL AUTO_INCREMENT ,
    IdVenta INT,
    Motivo VARCHAR(250) NOT NULL,
    EstadoDevolucion BIT NOT NULL DEFAULT 1,
    FechaDevolucion DATE NOT NULL,
    ValorDevolucionVenta DECIMAL(16,2) NOT NULL,
    CONSTRAINT PK_DevolucionVenta PRIMARY KEY (IdDevolucionVenta),
    CONSTRAINT FK_DevolucionVenta_Ventas FOREIGN KEY (IdVenta) REFERENCES Ventas(IdVenta),
    CONSTRAINT CHK_DevolucionVenta_ValorDevolucion CHECK (ValorDevolucionVenta >= 0)
);

-- Pedidos
CREATE TABLE Pedidos (
    IdPedido INT NOT NULL AUTO_INCREMENT ,
    IdCliente INT NOT NULL,
    FechaPedido DATE NOT NULL,
    PagoNeto FLOAT NOT NULL,
    Iva FLOAT NOT NULL,
    Total FLOAT NOT NULL,
    EstadoPedido VARCHAR(150),
    CONSTRAINT PK_Pedidos PRIMARY KEY (IdPedido),
    CONSTRAINT FK_Pedidos_Clientes FOREIGN KEY (IdCliente) REFERENCES Clientes(IdCliente),
    CONSTRAINT CHK_Pedidos_PagoNeto CHECK (PagoNeto >= 0),
    CONSTRAINT CHK_Pedidos_Iva CHECK (Iva >= 0),
    CONSTRAINT CHK_Pedidos_Total CHECK (Total >= 0)
);

-- PedidosProducto
CREATE TABLE PedidosProducto (
    IdPedidoProducto INT NOT NULL AUTO_INCREMENT ,
    IdPedido INT NOT NULL,
    IdProducto INT NOT NULL,
    Cantidad INT NOT NULL,
    Total FLOAT NOT NULL,
    CONSTRAINT PK_PedidosProducto PRIMARY KEY (IdPedidoProducto),
    CONSTRAINT FK_PedidosProducto_Pedidos FOREIGN KEY (IdPedido) REFERENCES Pedidos(IdPedido),
    CONSTRAINT FK_PedidosProducto_Productos FOREIGN KEY (IdProducto) REFERENCES Productos(IdProducto),
    CONSTRAINT CHK_PedidosProducto_Cantidad CHECK (Cantidad > 0)
);

-- PedidosMembresia
CREATE TABLE PedidosMembresia (
    IdPedidoMembresia INT NOT NULL AUTO_INCREMENT,
    IdPedido INT NOT NULL,
    IdMembresia INT NOT NULL,
    IdBeneficiarios INT NOT NULL,
    Total FLOAT NOT NULL,
    CONSTRAINT PK_PedidosMembresia PRIMARY KEY (IdPedidoMembresia),
    CONSTRAINT FK_PedidosMembresia_Pedidos FOREIGN KEY (IdPedido) REFERENCES Pedidos(IdPedido)
);

-- Eventos
CREATE TABLE Eventos(
    IdEvento INT NOT NULL AUTO_INCREMENT,
    FechaInicio DATE NOT NULL,
    FechaFin DATE NOT NULL,
    HoraInicio TIME NOT NULL,
    HoraFin TIME NOT NULL,
    DescripcionEvento VARCHAR(300) NOT NULL,
    EstadoAgenda BIT NOT NULL,
    IdServicio INT,
    IdUsuario INT,
    CONSTRAINT PK_Evento PRIMARY KEY (IdEvento),
    CONSTRAINT FK_Evento_Servicio FOREIGN KEY (IdServicio) REFERENCES Servicios(IdServicio),
    CONSTRAINT FK_Evento_Usuario FOREIGN KEY (IdUsuario) REFERENCES Usuarios(IdUsuario),
    CONSTRAINT CHK_Evento_HorasValidas CHECK (HoraInicio < HoraFin AND HoraInicio >= '06:00:00' AND HoraFin <= '21:00:00'),
    CONSTRAINT CHK_Evento_DescripcionEvento CHECK (DescripcionEvento LIKE '%[A-Za-z]%')
);

-- Productos
CREATE TABLE Productos (
    IdProducto INT NOT NULL AUTO_INCREMENT ,
    NombreProducto VARCHAR(255) NOT NULL,
    PrecioProducto DECIMAL(16,2) NOT NULL,
    IvaProducto INT NOT NULL,
    Stock INT NOT NULL,
    EstadoProducto BIT NOT NULL DEFAULT 1,
    IdCategoriaProductos INT,
    CONSTRAINT PK_Productos PRIMARY KEY (IdProducto),
    CONSTRAINT UC_Productos_NombreProducto UNIQUE (NombreProducto),
    CONSTRAINT CHK_Productos_PrecioProducto CHECK (PrecioProducto >= 0),
    CONSTRAINT CHK_Productos_IvaProducto CHECK (IvaProducto >= 0),
    CONSTRAINT CHK_Productos_Stock CHECK (Stock >= 0),
    CONSTRAINT FK_Productos_CategoriaProductos FOREIGN KEY (IdCategoriaProductos) REFERENCES CategoriaProductos(IdCategoriaProductos)
);

-- Compras
CREATE TABLE Compras (
    IdCompra INT NOT NULL AUTO_INCREMENT ,
    FechaCompra DATE NOT NULL,
    ValorCompra DECIMAL(16,2) NOT NULL,
    FechaRegistroCompra TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    NumeroReciboCompra INT NOT NULL,
    EstadoCompra BIT NOT NULL DEFAULT 1,
    IdProveedores INT,
    CONSTRAINT PK_Compras PRIMARY KEY (IdCompra),
    CONSTRAINT UC_Compras_NumeroReciboCompra UNIQUE (NumeroReciboCompra),
    CONSTRAINT CHK_Compras_FechaCompra CHECK (FechaCompra >= FechaRegistroCompra),
    CONSTRAINT CHK_Compras_ValorCompra CHECK (ValorCompra >= 0),
    CONSTRAINT FK_Compras_Proveedores FOREIGN KEY (IdProveedores) REFERENCES Proveedores(IdProveedores)
);

-- DevolucionesCompras
CREATE TABLE DevolucionesCompras (
    IdDevolucionesCompra INT NOT NULL AUTO_INCREMENT ,
    Motivo VARCHAR(255) NOT NULL,
    ValorDevolucion DECIMAL(16,2) NOT NULL,
    EstadoDevolucion BIT NOT NULL DEFAULT 1,
    IdCompra INT,
    IdCliente INT,
    CONSTRAINT PK_DevolucionesCompras PRIMARY KEY (IdDevolucionesCompra),
    CONSTRAINT FK_DevolucionesCompras_Compras FOREIGN KEY (IdCompra) REFERENCES Compras(IdCompra),
    CONSTRAINT FK_DevolucionesCompras_Clientes FOREIGN KEY (IdCliente) REFERENCES Clientes(IdCliente),
    CONSTRAINT CHK_DevolucionesCompras_ValorDevolucion CHECK (ValorDevolucion >= 0)
);

-- ComprasProducto
CREATE TABLE ComprasProducto (
    IdCompraProducto INT NOT NULL AUTO_INCREMENT ,
    IdCompra INT,
    IdProducto INT,
    CantidadProducto INT NOT NULL,
    PrecioUnitario DECIMAL(16,2) NOT NULL,
    Iva DECIMAL(16,2) NOT NULL,
    CONSTRAINT PK_ComprasProducto PRIMARY KEY (IdCompraProducto),
    CONSTRAINT FK_ComprasProducto_Compras FOREIGN KEY (IdCompra) REFERENCES Compras(IdCompra),
    CONSTRAINT FK_ComprasProducto_Productos FOREIGN KEY (IdProducto) REFERENCES Productos(IdProducto),
    CONSTRAINT CHK_ComprasProducto_PrecioUnitario CHECK (PrecioUnitario >= 0),
    CONSTRAINT CHK_ComprasProducto_Iva CHECK (Iva >= 0),
    CONSTRAINT CHK_ComprasProducto_CantidadProducto CHECK (CantidadProducto > 0)
);

-- DevolucionesComprasProducto
CREATE TABLE DevolucionesComprasProducto (
    IdDevolucionesComprasProducto INT NOT NULL AUTO_INCREMENT ,
    IdDevolucionesCompra INT,
    IdProducto INT,
    CantidadProducto INT NOT NULL,
    PrecioUnitario DECIMAL(16,2) NOT NULL,
    Iva DECIMAL(16,2) NOT NULL,
    CONSTRAINT PK_DevolucionesComprasProducto PRIMARY KEY (IdDevolucionesComprasProducto),
    CONSTRAINT FK_DevolucionesComprasProducto_DevolucionesCompras FOREIGN KEY (IdDevolucionesCompra) REFERENCES DevolucionesCompras(IdDevolucionesCompra),
    CONSTRAINT FK_DevolucionesComprasProducto_Productos FOREIGN KEY (IdProducto) REFERENCES Productos(IdProducto),
    CONSTRAINT CHK_DevolucionesComprasProducto_PrecioUnitario CHECK (PrecioUnitario >= 0),
    CONSTRAINT CHK_DevolucionesComprasProducto_Iva CHECK (Iva >= 0),
    CONSTRAINT CHK_DevolucionesComprasProducto_CantidadProducto CHECK (CantidadProducto > 0)
);

-- MembresiasServicios
CREATE TABLE MembresiasServicios (
    IdMembresiasServicios INT NOT NULL AUTO_INCREMENT,
    IdMembresia INT NOT NULL,
    IdServicio INT NOT NULL,
    CONSTRAINT PK_MembresiasServicios PRIMARY KEY (IdMembresiasServicios),
    CONSTRAINT FK_MembresiasServicios_Membresias FOREIGN KEY (IdMembresia) REFERENCES Membresias(IdMembresia),
    CONSTRAINT FK_MembresiasServicios_Servicios FOREIGN KEY (IdServicio) REFERENCES Servicios(IdServicio)
);
