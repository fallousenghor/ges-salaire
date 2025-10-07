"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const superAdminAccess_controller_1 = require("../controllers/superAdminAccess.controller");
const authenticateJWT_middleware_1 = require("../middleware/authenticateJWT.middleware");
const authorizeRole_middleware_1 = require("../middleware/authorizeRole.middleware");
const router = express_1.default.Router();
router.post('/grant-access', authenticateJWT_middleware_1.authenticateJWT, (0, authorizeRole_middleware_1.authorizeRole)(['ADMIN', 'SUPER_ADMIN']), superAdminAccess_controller_1.grantSuperAdminAccess);
router.get('/:entrepriseId', authenticateJWT_middleware_1.authenticateJWT, (0, authorizeRole_middleware_1.authorizeRole)(['ADMIN', 'SUPER_ADMIN']), superAdminAccess_controller_1.getSuperAdminAccess);
exports.default = router;
