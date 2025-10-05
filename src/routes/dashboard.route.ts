import { Router } from 'express';
import { dashboardKPIController } from '../controllers/dashboard.controller';
import { authenticateJWT } from '../middleware/authenticateJWT.middleware';

const router = Router();

// Dashboard KPI route (accessible aux admins/caissiers/super-admin)
router.get('/kpi', authenticateJWT, dashboardKPIController);

export default router;
