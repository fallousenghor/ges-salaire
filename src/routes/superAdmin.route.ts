import express from 'express';
import { authenticateJWT } from '../middleware/authenticateJWT.middleware';
import { getMainSuperAdmin } from '../controllers/superAdmin.controller';

const router = express.Router();

// Route pour récupérer le super admin principal
router.get('/main', authenticateJWT, getMainSuperAdmin);

export default router;