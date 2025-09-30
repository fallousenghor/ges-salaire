import { Router } from 'express';

import { authenticateJWT } from '../middleware/authenticateJWT.middleware';
import { authorizeRole } from '../middleware/authorizeRole.middleware';
import { PayRunController } from '../controllers/payrun.controller';

const router = Router();


router.post('/', authenticateJWT, authorizeRole(['ADMIN']), PayRunController.createPayRun);
router.get('/entreprise/:entrepriseId', authenticateJWT, authorizeRole(['ADMIN']), PayRunController.getPayRunsByEntreprise);
router.get('/:id', authenticateJWT, authorizeRole(['ADMIN']), PayRunController.getPayRunById);
router.put('/:id', authenticateJWT, authorizeRole(['ADMIN']), PayRunController.updatePayRun);
router.delete('/:id', authenticateJWT, authorizeRole(['ADMIN']), PayRunController.deletePayRun);

export default router;
