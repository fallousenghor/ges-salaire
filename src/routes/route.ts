import { Router } from 'express';

import userRoutes from './user.route';
import entrepriseRoutes from './entreprise.route';

import userEntrepriseRoutes from './userEntreprise.route';

import employeRoutes from './employe.route';

import payrunRoutes from './payrun.route';

import payslipRoutes from './payslip.route';
import paiementRoutes from './paiement.route';

export const router = Router();

router.use('/auth', userRoutes);

router.use('/entreprise', entrepriseRoutes);

router.use('/user-entreprise', userEntrepriseRoutes);

router.use('/employe', employeRoutes);

router.use('/payrun', payrunRoutes);

router.use('/payslip', payslipRoutes);

router.use('/paiement', paiementRoutes);

export default router;
