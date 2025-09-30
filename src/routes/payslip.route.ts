
import { Router } from 'express';
import { PayslipController } from '../controllers/payslip.controller';

import { authenticateJWT } from '../middleware/authenticateJWT.middleware';
import { authorizeRole } from '../middleware/authorizeRole.middleware';

const router = Router();


router.post('/', authenticateJWT, authorizeRole(['ADMIN']), PayslipController.createPayslip);
router.get('/employe/:employeId', authenticateJWT, authorizeRole(['ADMIN']), PayslipController.getPayslipsByEmploye);
router.get('/payrun/:payrunId', authenticateJWT, authorizeRole(['ADMIN']), PayslipController.getPayslipsByPayrun);
router.get('/:id', authenticateJWT, authorizeRole(['ADMIN']), PayslipController.getPayslipById);
router.put('/:id', authenticateJWT, authorizeRole(['ADMIN']), PayslipController.updatePayslip);
router.delete('/:id', authenticateJWT, authorizeRole(['ADMIN']), PayslipController.deletePayslip);

export default router;
