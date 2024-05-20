import { Router } from 'express';
import { getEjerciciosDeRutina, agregarEjercicioARutina, eliminarEjercicioDeRutina, getDetallesDeRutinaPorDiaSemana, agregarEjercicioARutinaPorDiaSemana, eliminarEjercicioDeRutinaPorDiaSemana } from '../controllers/detalleRutinas.controller.js';

const router = Router();

// Rutas para operaciones CRUD relacionadas con los detalles de las rutinas
router.get('/rutinas/:IdRutina/ejercicios', getEjerciciosDeRutina);
router.post('/rutinas/:IdRutina/ejercicios', agregarEjercicioARutina);
router.delete('/rutinas/ejercicios/:IdRutinaEjercicio', eliminarEjercicioDeRutina);
router.get('/rutinas/:IdRutina/detalles', getDetallesDeRutinaPorDiaSemana);
router.post('/rutinas/:IdRutinaEjercicio/detalles', agregarEjercicioARutinaPorDiaSemana);
router.delete('/rutinas/detalles/:IdRutinaEjercicioDiaSemana', eliminarEjercicioDeRutinaPorDiaSemana);

export default router;
