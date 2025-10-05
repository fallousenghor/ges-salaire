
import { Router } from 'express';
import { authenticateJWT } from '../middleware/authenticateJWT.middleware';
import { authorizeRole } from '../middleware/authorizeRole.middleware';
import { PayRunController } from '../controllers/payrun.controller';

const router = Router();

router.get('/', authenticateJWT, authorizeRole(['ADMIN', 'CAISSIER']), PayRunController.getAllPayRuns);


router.post('/', authenticateJWT, authorizeRole(['ADMIN']), PayRunController.createPayRun);
router.get('/entreprise/:entrepriseId', authenticateJWT, authorizeRole(['ADMIN']), PayRunController.getPayRunsByEntreprise);
router.get('/:id', authenticateJWT, authorizeRole(['ADMIN']), PayRunController.getPayRunById);
router.put('/:id', authenticateJWT, authorizeRole(['ADMIN']), PayRunController.updatePayRun);
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
router.patch('/:id/statut', authenticateJWT, authorizeRole(['ADMIN']), PayRunController.updatePayRunStatus);
router.delete('/:id', authenticateJWT, authorizeRole(['ADMIN']), PayRunController.deletePayRun);

export default router;
