"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const payslip_controller_1 = require("../controllers/payslip.controller");
const authenticateJWT_middleware_1 = require("../middleware/authenticateJWT.middleware");
const authorizeRole_middleware_1 = require("../middleware/authorizeRole.middleware");
const router = (0, express_1.Router)();
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
router.get('/', authenticateJWT_middleware_1.authenticateJWT, (0, authorizeRole_middleware_1.authorizeRole)(['ADMIN', 'CAISSIER']), payslip_controller_1.PayslipController.getAllPayslips);
router.get('/s', authenticateJWT_middleware_1.authenticateJWT, (0, authorizeRole_middleware_1.authorizeRole)(['ADMIN', 'CAISSIER']), payslip_controller_1.PayslipController.getAllPayslips);
router.get('/employe/:employeId/paginated', authenticateJWT_middleware_1.authenticateJWT, (0, authorizeRole_middleware_1.authorizeRole)(['ADMIN', 'CAISSIER']), payslip_controller_1.PayslipController.getPayslipsByEmployePaginated);
router.post('/', authenticateJWT_middleware_1.authenticateJWT, (0, authorizeRole_middleware_1.authorizeRole)(['ADMIN']), payslip_controller_1.PayslipController.createPayslip);
router.get('/employe/:employeId', authenticateJWT_middleware_1.authenticateJWT, (0, authorizeRole_middleware_1.authorizeRole)(['ADMIN', 'CAISSIER']), payslip_controller_1.PayslipController.getPayslipsByEmploye);
router.get('/payrun/:payrunId', authenticateJWT_middleware_1.authenticateJWT, (0, authorizeRole_middleware_1.authorizeRole)(['ADMIN', 'CAISSIER']), payslip_controller_1.PayslipController.getPayslipsByPayrun);
router.get('/:id', authenticateJWT_middleware_1.authenticateJWT, (0, authorizeRole_middleware_1.authorizeRole)(['ADMIN', 'CAISSIER']), payslip_controller_1.PayslipController.getPayslipById);
router.get('/:id/pdf', authenticateJWT_middleware_1.authenticateJWT, (0, authorizeRole_middleware_1.authorizeRole)(['ADMIN', 'SUPER_ADMIN', 'CAISSIER']), payslip_controller_1.PayslipController.downloadPayslipPDF);
router.put('/:id', authenticateJWT_middleware_1.authenticateJWT, (0, authorizeRole_middleware_1.authorizeRole)(['ADMIN']), payslip_controller_1.PayslipController.updatePayslip);
router.patch('/:id/statut', authenticateJWT_middleware_1.authenticateJWT, (0, authorizeRole_middleware_1.authorizeRole)(['ADMIN']), payslip_controller_1.PayslipController.updatePayslipStatus);
router.delete('/:id', authenticateJWT_middleware_1.authenticateJWT, (0, authorizeRole_middleware_1.authorizeRole)(['ADMIN']), payslip_controller_1.PayslipController.deletePayslip);
exports.default = router;
