"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const paiement_controller_1 = require("../controllers/paiement.controller");
const authenticateJWT_middleware_1 = require("../middleware/authenticateJWT.middleware");
const authorizeRole_middleware_1 = require("../middleware/authorizeRole.middleware");
const router = (0, express_1.Router)();
/**
 * @swagger
 * /paiement/payslip/{payslipId}/paginated:
 *   get:
 *     summary: Liste paginée des paiements d'un bulletin de paie
 *     tags:
 *       - Paiement
 *     parameters:
 *       - in: path
 *         name: payslipId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du bulletin de paie
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
 *         description: Liste paginée des paiements
 */
router.get('/payslip/:payslipId/paginated', authenticateJWT_middleware_1.authenticateJWT, (0, authorizeRole_middleware_1.authorizeRole)(['CAISSIER', 'ADMIN']), paiement_controller_1.PaiementController.getPaiementsByPayslipPaginated);
/**
 * @swagger
 * /paiement:
 *   post:
 *     summary: Créer un nouveau paiement
 *     tags:
 *       - Paiement
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               payslipId:
 *                 type: integer
 *               montant:
 *                 type: number
 *               mode:
 *                 type: string
 *                 enum: [ESPECES, VIREMENT, ORANGE_MONEY, WAVE, AUTRE]
 *               datePaiement:
 *                 type: string
 *                 format: date-time
 *               statut:
 *                 type: string
 *                 enum: [EN_ATTENTE, PARTIEL, PAYE]
 *     responses:
 *       201:
 *         description: Paiement créé
 */
router.post('/', authenticateJWT_middleware_1.authenticateJWT, (0, authorizeRole_middleware_1.authorizeRole)(['CAISSIER', 'ADMIN']), paiement_controller_1.PaiementController.createPaiement);
router.get('/payslip/:payslipId', authenticateJWT_middleware_1.authenticateJWT, (0, authorizeRole_middleware_1.authorizeRole)(['CAISSIER', 'ADMIN']), paiement_controller_1.PaiementController.getPaiementsByPayslip);
router.get('/:id', authenticateJWT_middleware_1.authenticateJWT, (0, authorizeRole_middleware_1.authorizeRole)(['CAISSIER', 'ADMIN']), paiement_controller_1.PaiementController.getPaiementById);
// router.get('/:id/pdf', ...) corrigé plus tard si generateRecuPDF existe
router.put('/:id', authenticateJWT_middleware_1.authenticateJWT, (0, authorizeRole_middleware_1.authorizeRole)(['CAISSIER', 'ADMIN']), paiement_controller_1.PaiementController.updatePaiement);
/**
 * @swagger
 * /paiement/stats/entreprise/{entrepriseId}/mois-courant:
 *   get:
 *     summary: Récupère les statistiques du mois en cours pour une entreprise
 *     tags:
 *       - Paiement
 *     parameters:
 *       - in: path
 *         name: entrepriseId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'entreprise
 *     responses:
 *       200:
 *         description: Statistiques récupérées avec succès
 */
router.get('/stats/entreprise/:entrepriseId/mois-courant', authenticateJWT_middleware_1.authenticateJWT, paiement_controller_1.PaiementController.getCurrentMonthStats);
/**
 * @swagger
 * /paiement/{id}/statut:
 *   patch:
 *     summary: Met à jour le statut d'un paiement
 *     tags:
 *       - Paiement
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du paiement
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               statut:
 *                 type: string
 *                 enum: [EN_ATTENTE, PARTIEL, PAYE]
 *     responses:
 *       200:
 *         description: Statut du paiement mis à jour
 */
router.patch('/:id/statut', authenticateJWT_middleware_1.authenticateJWT, (0, authorizeRole_middleware_1.authorizeRole)(['CAISSIER', 'ADMIN']), paiement_controller_1.PaiementController.updatePaiementStatus);
router.delete('/:id', authenticateJWT_middleware_1.authenticateJWT, (0, authorizeRole_middleware_1.authorizeRole)(['CAISSIER', 'ADMIN']), paiement_controller_1.PaiementController.deletePaiement);
exports.default = router;
