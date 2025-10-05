import { Router } from 'express';


import userRoutes from './user.route';
import entrepriseRoutes from './entreprise.route';
import userEntrepriseRoutes from './userEntreprise.route';
import employeRoutes from './employe.route';
import payrunRoutes from './payrun.route';
import payslipRoutes from './payslip.route';
import { PayslipController } from '../controllers/payslip.controller';
import { authenticateJWT } from '../middleware/authenticateJWT.middleware';
import { authorizeRole } from '../middleware/authorizeRole.middleware';
import paiementRoutes from './paiement.route';
import dashboardRoutes from './dashboard.route';

export const router = Router();

router.use('/auth', userRoutes);

router.use('/entreprise', entrepriseRoutes);

router.use('/user-entreprise', userEntrepriseRoutes);

router.use('/employe', employeRoutes);

router.use('/payrun', payrunRoutes);

router.use('/payslip', payslipRoutes);
// Route directe pour /payslips
router.get('/payslips', authenticateJWT, authorizeRole(['ADMIN']), PayslipController.getAllPayslips);

router.use('/paiement', paiementRoutes);

router.use('/dashboard', dashboardRoutes);

export default router;
