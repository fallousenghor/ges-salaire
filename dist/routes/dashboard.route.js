"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboard_controller_1 = require("../controllers/dashboard.controller");
const authenticateJWT_middleware_1 = require("../middleware/authenticateJWT.middleware");
const router = (0, express_1.Router)();
// Dashboard KPI route (accessible aux admins/caissiers/super-admin)
router.get('/kpi', authenticateJWT_middleware_1.authenticateJWT, dashboard_controller_1.dashboardKPIController);
exports.default = router;
