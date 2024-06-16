import { Router } from 'express';
import { getMembresias, getMembresia } from '../controllers/membresias.controller.js';

const router = Router();

router.get('/membresias', getMembresias);
router.get('/membresias/:id', getMembresia);

export default router;
