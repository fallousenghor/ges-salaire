import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticateJWT } from '../middleware/authenticateJWT.middleware';

const router = Router();
const authController = new AuthController();

// Connexion
router.post('/login', authController.login);
// Changement de mot de passe
router.post('/change-password', authenticateJWT, authController.changePassword);
// Vérification du token
router.get('/verify-token', authenticateJWT, authController.verifyToken);
// Switch en mode admin
router.post('/switch-to-admin/:entrepriseId', authenticateJWT, authController.switchToAdmin);

export default router;