
import { Router } from 'express';
import { PaiementController } from '../controllers/paiement.controller';
import { authenticateJWT } from '../middleware/authenticateJWT.middleware';
import { authorizeRole } from '../middleware/authorizeRole.middleware';

const router = Router();

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
router.get('/payslip/:payslipId/paginated', authenticateJWT, authorizeRole(['CAISSIER', 'ADMIN']), PaiementController.getPaiementsByPayslipPaginated);
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
router.post('/', authenticateJWT, authorizeRole(['CAISSIER', 'ADMIN']), PaiementController.createPaiement);
router.get('/payslip/:payslipId', authenticateJWT, authorizeRole(['CAISSIER', 'ADMIN']), PaiementController.getPaiementsByPayslip);
router.get('/:id', authenticateJWT, authorizeRole(['CAISSIER', 'ADMIN']), PaiementController.getPaiementById);
// router.get('/:id/pdf', ...) corrigé plus tard si generateRecuPDF existe
router.put('/:id', authenticateJWT, authorizeRole(['CAISSIER', 'ADMIN']), PaiementController.updatePaiement);

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
router.get('/stats/entreprise/:entrepriseId/mois-courant', authenticateJWT, PaiementController.getCurrentMonthStats);
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
router.patch('/:id/statut', authenticateJWT, authorizeRole(['CAISSIER', 'ADMIN']), PaiementController.updatePaiementStatus);
router.delete('/:id', authenticateJWT, authorizeRole(['CAISSIER', 'ADMIN']), PaiementController.deletePaiement);

export default router;
