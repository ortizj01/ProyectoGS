import { Router } from 'express';
import { getMembresias, getMembresia } from '../controllers/membresia.controller.js';

const router = Router();

router.get('/membresias', getMembresias);
router.get('/membresias/:id', getMembresia);

export default router;
