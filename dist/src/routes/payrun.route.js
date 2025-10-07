"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authenticateJWT_middleware_1 = require("../middleware/authenticateJWT.middleware");
const authorizeRole_middleware_1 = require("../middleware/authorizeRole.middleware");
const payrun_controller_1 = require("../controllers/payrun.controller");
const router = (0, express_1.Router)();
router.get('/', authenticateJWT_middleware_1.authenticateJWT, (0, authorizeRole_middleware_1.authorizeRole)(['ADMIN', 'CAISSIER']), payrun_controller_1.PayRunController.getAllPayRuns);
router.post('/', authenticateJWT_middleware_1.authenticateJWT, (0, authorizeRole_middleware_1.authorizeRole)(['ADMIN']), payrun_controller_1.PayRunController.createPayRun);
router.get('/entreprise/:entrepriseId', authenticateJWT_middleware_1.authenticateJWT, (0, authorizeRole_middleware_1.authorizeRole)(['ADMIN']), payrun_controller_1.PayRunController.getPayRunsByEntreprise);
router.get('/:id', authenticateJWT_middleware_1.authenticateJWT, (0, authorizeRole_middleware_1.authorizeRole)(['ADMIN']), payrun_controller_1.PayRunController.getPayRunById);
router.put('/:id', authenticateJWT_middleware_1.authenticateJWT, (0, authorizeRole_middleware_1.authorizeRole)(['ADMIN']), payrun_controller_1.PayRunController.updatePayRun);
/**
 * @swagger
 * /payrun/{id}/statut:
 *   patch:
 *     summary: Met à jour le statut d'un payrun
 *     tags:
 *       - PayRun
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du payrun
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               statut:
 *                 type: string
 *                 enum: [BROUILLON, APPROUVE, CLOTURE]
 *     responses:
 *       200:
 *         description: Statut mis à jour
 */
router.patch('/:id/statut', authenticateJWT_middleware_1.authenticateJWT, (0, authorizeRole_middleware_1.authorizeRole)(['ADMIN']), payrun_controller_1.PayRunController.updatePayRunStatus);
router.delete('/:id', authenticateJWT_middleware_1.authenticateJWT, (0, authorizeRole_middleware_1.authorizeRole)(['ADMIN']), payrun_controller_1.PayRunController.deletePayRun);
exports.default = router;
