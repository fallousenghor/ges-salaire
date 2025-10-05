
import { Router } from "express";


import { UserController } from "../controllers/user.controller";
import { AuthController } from "../controllers/auth.controller";
import { authenticateJWT } from '../middleware/authenticateJWT.middleware';

const userController = new UserController();
const auhtController = new AuthController();

export const router = Router();

router.post("/register", userController.createUser);
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
router.post("/login", auhtController.login);

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
router.post("/change-password", authenticateJWT, auhtController.changePassword);

export default router;