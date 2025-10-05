"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_controller_1 = require("../controllers/auth.controller");
const authenticateJWT_middleware_1 = require("../middleware/authenticateJWT.middleware");
const userController = new user_controller_1.UserController();
const auhtController = new auth_controller_1.AuthController();
exports.router = (0, express_1.Router)();
exports.router.post("/register", userController.createUser);
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Authentification utilisateur (login)
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               motDePasse:
 *                 type: string
 *     responses:
 *       200:
 *         description: Connexion réussie, retourne un token JWT
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *       401:
 *         description: Identifiants invalides
 */
exports.router.post("/login", auhtController.login);
/**
 * @swagger
 * /user/change-password:
 *   post:
 *     summary: Changer le mot de passe utilisateur
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ancienMotDePasse:
 *                 type: string
 *               nouveauMotDePasse:
 *                 type: string
 *     responses:
 *       200:
 *         description: Mot de passe changé avec succès
 *       401:
 *         description: Token manquant ou invalide
 */
exports.router.post("/change-password", authenticateJWT_middleware_1.authenticateJWT, auhtController.changePassword);
exports.default = exports.router;
