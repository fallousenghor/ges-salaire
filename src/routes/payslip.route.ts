
import { Router } from 'express';
import { PayslipController } from '../controllers/payslip.controller';
import { authenticateJWT } from '../middleware/authenticateJWT.middleware';
import { authorizeRole } from '../middleware/authorizeRole.middleware';

const router = Router();

/**
 * @swagger
 * /payslip/employe/{employeId}/paginated:
 *   get:
 *     summary: Liste paginée des bulletins de paie d'un employé
 *     tags:
 *       - Payslip
 *     parameters:
 *       - in: path
 *         name: employeId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'employé
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page de pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Nombre d'éléments par page
 *     responses:
 *       200:
 *         description: Liste paginée des bulletins de paie
 */
router.get('/', authenticateJWT, authorizeRole(['ADMIN', 'CAISSIER']), PayslipController.getAllPayslips);
router.get('/s', authenticateJWT, authorizeRole(['ADMIN', 'CAISSIER']), PayslipController.getAllPayslips);
router.get('/employe/:employeId/paginated', authenticateJWT, authorizeRole(['ADMIN', 'CAISSIER']), PayslipController.getPayslipsByEmployePaginated);
router.post('/', authenticateJWT, authorizeRole(['ADMIN']), PayslipController.createPayslip);
router.get('/employe/:employeId', authenticateJWT, authorizeRole(['ADMIN', 'CAISSIER']), PayslipController.getPayslipsByEmploye);
router.get('/payrun/:payrunId', authenticateJWT, authorizeRole(['ADMIN', 'CAISSIER']), PayslipController.getPayslipsByPayrun);
router.get('/:id', authenticateJWT, authorizeRole(['ADMIN', 'CAISSIER']), PayslipController.getPayslipById);
router.get('/:id/pdf', authenticateJWT, authorizeRole(['ADMIN', 'SUPER_ADMIN', 'CAISSIER']), PayslipController.downloadPayslipPDF);
router.put('/:id', authenticateJWT, authorizeRole(['ADMIN']), PayslipController.updatePayslip);
router.patch('/:id/statut', authenticateJWT, authorizeRole(['ADMIN']), PayslipController.updatePayslipStatus);
router.delete('/:id', authenticateJWT, authorizeRole(['ADMIN']), PayslipController.deletePayslip);

export default router;
