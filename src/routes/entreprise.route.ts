import { Router } from 'express';
import { EntrepriseController } from '../controllers/entreprise.controller';
import { superAdminMiddleware } from '../middleware/superAdmin.middleware';
import { authenticateJWT } from '../middleware/authenticateJWT.middleware';
import { checkEntrepriseAccess } from '../middleware/checkEntrepriseAccess.middleware';
import { upload } from '../config/upload';

const router = Router();
const entrepriseController = new EntrepriseController();

// Routes qui nécessitent d'être super admin
router.post('/', authenticateJWT, superAdminMiddleware, upload.single('logo'), entrepriseController.createEntreprise);
router.get('/', authenticateJWT, superAdminMiddleware, entrepriseController.getAllEntreprises);
router.put('/:id/fermer', authenticateJWT, superAdminMiddleware, entrepriseController.fermerEntreprise);
router.delete('/:id', authenticateJWT, superAdminMiddleware, entrepriseController.deleteEntreprise);

// Routes qui nécessitent d'être soit super admin soit utilisateur de l'entreprise
router.get('/:id', authenticateJWT, checkEntrepriseAccess, entrepriseController.getEntrepriseById);
// Accept logo upload on update as well (multipart/form-data)
router.put('/:id', authenticateJWT, checkEntrepriseAccess, upload.single('logo'), entrepriseController.updateEntreprise);

export default router;
