import { Router } from 'express';

import { EntrepriseController } from '../controllers/entreprise.controller';

import { superAdminMiddleware } from '../middleware/superAdmin.middleware';
import { authenticateJWT } from '../middleware/authenticateJWT.middleware';

const router = Router();
const entrepriseController = new EntrepriseController();

router.post('/', authenticateJWT, superAdminMiddleware, entrepriseController.createEntreprise);
router.get('/', authenticateJWT, superAdminMiddleware, entrepriseController.getAllEntreprises);
router.get('/:id', authenticateJWT, superAdminMiddleware, entrepriseController.getEntrepriseById);
router.put('/:id', authenticateJWT, superAdminMiddleware, entrepriseController.updateEntreprise);
router.delete('/:id', authenticateJWT, superAdminMiddleware, entrepriseController.deleteEntreprise);

export default router;
