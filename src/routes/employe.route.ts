import { Router } from 'express';
import { EmployeController } from '../controllers/employe.controller';
import { authenticateJWT } from '../middleware/authenticateJWT.middleware';
import { authorizeRole } from '../middleware/authorizeRole.middleware';

const router = Router();
// Nombre de pointages sur une période
router.get('/:employeId/pointages', authenticateJWT, authorizeRole(['ADMIN']), EmployeController.getNbPointages);
// ...existing code...
router.post('/:employeId/pointer', authenticateJWT, authorizeRole(['ADMIN']), EmployeController.pointerEmploye);
// Dernier pointage d'un employé
router.get('/:employeId/last-pointage', authenticateJWT, authorizeRole(['ADMIN']), EmployeController.getLastPointage);

/**
 * @swagger
 * /employe/entreprise/{entrepriseId}/paginated:
 *   get:
 *     summary: Liste paginée des employés d'une entreprise
 *     tags:
 *       - Employe
 *     parameters:
 *       - in: path
 *         name: entrepriseId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'entreprise
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
 *         description: Liste paginée des employés
 */
router.get('/entreprise/:entrepriseId/paginated', authenticateJWT, authorizeRole(['ADMIN']), EmployeController.getEmployesByEntreprisePaginated);
/**
 * @swagger
 * /employe:
 *   post:
 *     summary: Créer un nouvel employé
 *     tags:
 *       - Employe
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               entrepriseId:
 *                 type: integer
 *               nomComplet:
 *                 type: string
 *               poste:
 *                 type: string
 *               typeContrat:
 *                 type: string
 *                 enum: [JOURNALIER, FIXE, HONORAIRE]
 *               salaireFixe:
 *                 type: number
 *               tauxJournalier:
 *                 type: number
 *               honoraire:
 *                 type: number
 *               coordonneesBancaires:
 *                 type: string
 *               statut:
 *                 type: string
 *                 enum: [ACTIF, INACTIF, VACATAIRE]
 *               actif:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Employé créé
 */
router.post('/', authenticateJWT, authorizeRole(['ADMIN']), EmployeController.createEmploye);
// Liste par entreprise (simple)
router.get('/entreprise/:entrepriseId', authenticateJWT, authorizeRole(['ADMIN']), EmployeController.getEmployesByEntreprise);
/**
 * @swagger
 * /employe/search:
 *   get:
 *     summary: Recherche/filtres avancés sur les employés
 *     tags:
 *       - Employe
 *     parameters:
 *       - in: query
 *         name: entrepriseId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de l'entreprise
 *       - in: query
 *         name: statut
 *         schema:
 *           type: string
 *           enum: [ACTIF, INACTIF, VACATAIRE]
 *         description: Statut de l'employé
 *       - in: query
 *         name: poste
 *         schema:
 *           type: string
 *         description: Poste de l'employé
 *       - in: query
 *         name: typeContrat
 *         schema:
 *           type: string
 *           enum: [JOURNALIER, FIXE, HONORAIRE]
 *         description: Type de contrat
 *       - in: query
 *         name: actif
 *         schema:
 *           type: boolean
 *         description: Actif ou non
 *     responses:
 *       200:
 *         description: Liste filtrée des employés
 */
router.get('/search', authenticateJWT, authorizeRole(['ADMIN', 'CAISSIER']), EmployeController.searchEmployes);
// Activation/désactivation
router.patch('/:id/actif', authenticateJWT, authorizeRole(['ADMIN']), EmployeController.setEmployeActif);
// Détail
router.get('/:id', authenticateJWT, authorizeRole(['ADMIN']), EmployeController.getEmployeById);
// Modification
router.put('/:id', authenticateJWT, authorizeRole(['ADMIN']), EmployeController.updateEmploye);
// Suppression
router.delete('/:id', authenticateJWT, authorizeRole(['ADMIN']), EmployeController.deleteEmploye);

export default router;
