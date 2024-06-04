import * as ValoracionMedicaModel from '../models/valoracionMedica.model.js';

export const getValoracionesMedicas = async (req, res) => {
    try {
        const valoraciones = await ValoracionMedicaModel.getAllValoracionesMedicas();
        res.json(valoraciones);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getValoracionMedicaById = async (req, res) => {
    try {
        const { id } = req.params;
        const valoracion = await ValoracionMedicaModel.getValoracionMedicaById(id);
        if (valoracion) {
            res.json(valoracion);
        } else {
            res.status(404).json({ message: 'Valoración Médica no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createValoracionMedica = async (req, res) => {
    try {
        const id = await ValoracionMedicaModel.createValoracionMedica(req.body);
        res.status(201).json({ id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateValoracionMedica = async (req, res) => {
    try {
        const { id } = req.params;
        await ValoracionMedicaModel.updateValoracionMedica(id, req.body);
        res.json({ message: 'Valoración Médica actualizada' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteValoracionMedica = async (req, res) => {
    try {
        const { id } = req.params;
        await ValoracionMedicaModel.deleteValoracionMedica(id);
        res.json({ message: 'Valoración Médica eliminada' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
