"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authenticateJWT_middleware_1 = require("../middleware/authenticateJWT.middleware");
const superAdmin_controller_1 = require("../controllers/superAdmin.controller");
const router = express_1.default.Router();
// Route pour récupérer le super admin principal
router.get('/main', authenticateJWT_middleware_1.authenticateJWT, superAdmin_controller_1.getMainSuperAdmin);
exports.default = router;
