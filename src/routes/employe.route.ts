
import { Router } from 'express';
import { EmployeController } from '../controllers/employe.controller';

import { authenticateJWT } from '../middleware/authenticateJWT.middleware';
import { authorizeRole } from '../middleware/authorizeRole.middleware';

const router = Router();

router.post('/', authenticateJWT, authorizeRole(['ADMIN']), EmployeController.createEmploye);
router.get('/entreprise/:entrepriseId', authenticateJWT, authorizeRole(['ADMIN']), EmployeController.getEmployesByEntreprise);
router.get('/:id', authenticateJWT, authorizeRole(['ADMIN']), EmployeController.getEmployeById);
router.put('/:id', authenticateJWT, authorizeRole(['ADMIN']), EmployeController.updateEmploye);
router.delete('/:id', authenticateJWT, authorizeRole(['ADMIN']), EmployeController.deleteEmploye);

export default router;
