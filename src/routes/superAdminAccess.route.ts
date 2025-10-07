import express from 'express';
import { grantSuperAdminAccess, getSuperAdminAccess } from '../controllers/superAdminAccess.controller';
import { authenticateJWT } from '../middleware/authenticateJWT.middleware';
import { authorizeRole } from '../middleware/authorizeRole.middleware';

const router = express.Router();

router.post('/grant-access',
  authenticateJWT,
  authorizeRole(['ADMIN', 'SUPER_ADMIN']),
  grantSuperAdminAccess
);

router.get('/:entrepriseId',
  authenticateJWT,
  authorizeRole(['ADMIN', 'SUPER_ADMIN']),
  getSuperAdminAccess
);

export default router;