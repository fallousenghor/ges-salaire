"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const authenticateJWT_middleware_1 = require("../middleware/authenticateJWT.middleware");
const router = (0, express_1.Router)();
const authController = new auth_controller_1.AuthController();
// Connexion
router.post('/login', authController.login);
// Changement de mot de passe
router.post('/change-password', authenticateJWT_middleware_1.authenticateJWT, authController.changePassword);
// Vérification du token
router.get('/verify-token', authenticateJWT_middleware_1.authenticateJWT, authController.verifyToken);
// Switch en mode admin
router.post('/switch-to-admin/:entrepriseId', authenticateJWT_middleware_1.authenticateJWT, authController.switchToAdmin);
exports.default = router;
