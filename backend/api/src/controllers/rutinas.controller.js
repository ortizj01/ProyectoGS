import { pool } from '../db.js';

//Traer todas las Rutinas
export const getRutinas = async (req, res) => {
    try {
        // Consulta para obtener las rutinas con sus detalles de días de la semana y nombres de ejercicios
        const query = `
            SELECT r.*, e.NombreEjercicio, reds.DiaSemana
            FROM Rutinas r
            LEFT JOIN RutinasEjercicios re ON r.IdRutina = re.IdRutina
            LEFT JOIN Ejercicios e ON re.IdEjercicio = e.IdEjercicio
            LEFT JOIN RutinasEjerciciosDiaSemana reds ON re.IdRutinaEjercicio = reds.IdRutinaEjercicio
        `;
        
        // Ejecutar la consulta
        const [rows] = await pool.query(query);

        // Crear un mapa para almacenar las rutinas y sus ejercicios por día de la semana
        const rutinasConDias = new Map();

        // Procesar los resultados
        rows.forEach(row => {
            // Si la rutina aún no está en el mapa, inicializarla
            if (!rutinasConDias.has(row.IdRutina)) {
                rutinasConDias.set(row.IdRutina, {
                    IdRutina: row.IdRutina,
                    NombreRutina: row.NombreRutina,
                    EstadoRutina: row.EstadoRutina,
                    IdUsuario: row.IdUsuario,
                    DiasSemana: {} // Inicializar un objeto para almacenar los ejercicios por día de la semana
                });
            }

            // Si el día de la semana aún no está asociado con la rutina, inicializarlo como un array vacío
            if (!rutinasConDias.get(row.IdRutina).DiasSemana[row.DiaSemana]) {
                rutinasConDias.get(row.IdRutina).DiasSemana[row.DiaSemana] = [];
            }

            // Agregar el ejercicio al día de la semana correspondiente
            rutinasConDias.get(row.IdRutina).DiasSemana[row.DiaSemana].push({
                IdEjercicio: row.IdEjercicio,
                NombreEjercicio: row.NombreEjercicio
            });
        });

        // Convertir el mapa de rutinas a un array para la respuesta
        const rutinas = Array.from(rutinasConDias.values());

        // Enviar la respuesta
        res.json(rutinas);
    } catch (error) {
        console.error('Error al obtener las rutinas con los días asignados:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};




//Traer todas una Rutina
export const getRutina = async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM Rutinas WHERE IdRutina = ?', [req.params.IdRutina]);
    if(rows.length <= 0) return res.status(400).json({ message: 'Rutina no encontrada' });
    res.json(rows[0]);
};


export const createRutinas = async (req, res) =>{
    const {NombreRutina, EstadoRutina, IdUsuario} = req.body
    const [rows] = await pool.query('INSERT INTO Rutinas (NombreRutina, EstadoRutina, IdUsuario) VALUES (?,?,?)',
    [NombreRutina, EstadoRutina, IdUsuario])
    res.send({
        id: rows.insertId,
        NombreRutina,
        EstadoRutina,
        IdUsuario
    })

}

export const updateRutina = async (req, res) => {
    const { IdRutina } = req.params;
    const { NombreRutina, EstadoRutina, IdUsuario } = req.body;
    const [result] = await pool.query('UPDATE Rutinas SET NombreRutina = IFNULL(?, NombreRutina), EstadoRutina = IFNULL(?, EstadoRutina), IdUsuario = IFNULL(?, IdUsuario) WHERE IdRutina = ?',
        [NombreRutina, EstadoRutina, IdUsuario, IdRutina]);
    if(result.affectedRows === 0 ) return res.status(404).json({ message: 'Rutina no encontrada' });
    const [rows] = await pool.query('SELECT * FROM Rutinas WHERE IdRutina = ?', [IdRutina]);
    res.json(rows[0]);
};


export const deleteRutina = async (req, res) => {
    const [result] = await pool.query('DELETE FROM Rutinas WHERE IdRutina = ?', [req.params.IdRutina]);
    if (result.affectedRows <= 0) return res.status(404).json({ message: 'Rutina no encontrada' });
    res.sendStatus(204);
};

// En tu archivo de controlador de rutinas (rutinas.controller.js)

export const getRutinaDetallada = async (req, res) => {
    const { IdRutina } = req.params;

    // Consulta para obtener los detalles de la rutina, los días de la semana y los ejercicios asociados
    const query = `
        SELECT r.NombreRutina, reds.DiaSemana, e.NombreEjercicio
        FROM Rutinas r
        JOIN RutinasEjercicios re ON r.IdRutina = re.IdRutina
        JOIN RutinasEjerciciosDiaSemana reds ON re.IdRutinaEjercicio = reds.IdRutinaEjercicio
        JOIN Ejercicios e ON re.IdEjercicio = e.IdEjercicio
        WHERE r.IdRutina = ?
    `;

    try {
        const [rows] = await pool.query(query, [IdRutina]);
        res.json(rows);
    } catch (error) {
        console.error("Error al obtener los detalles de la rutina:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

