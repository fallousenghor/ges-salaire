import { Router } from 'express';


import { PaiementController } from '../controllers/paiement.controller';
import { authenticateJWT } from '../middleware/authenticateJWT.middleware';
import { authorizeRole } from '../middleware/authorizeRole.middleware';

const router = Router();

router.post('/', authenticateJWT, authorizeRole(['CAISSIER', 'ADMIN']), PaiementController.createPaiement);
router.get('/payslip/:payslipId', authenticateJWT, authorizeRole(['CAISSIER', 'ADMIN']), PaiementController.getPaiementsByPayslip);
router.get('/:id', authenticateJWT, authorizeRole(['CAISSIER', 'ADMIN']), PaiementController.getPaiementById);
router.put('/:id', authenticateJWT, authorizeRole(['CAISSIER', 'ADMIN']), PaiementController.updatePaiement);
router.delete('/:id', authenticateJWT, authorizeRole(['CAISSIER', 'ADMIN']), PaiementController.deletePaiement);

export default router;
