
import { Router } from "express";


import { UserController } from "../controllers/user.controller";
import { AuthController } from "../controllers/auth.controller";
import { authenticateJWT } from '../middleware/authenticateJWT.middleware';

const userController = new UserController();
const auhtController = new AuthController();

export const router = Router();

router.post("/register", userController.createUser);
router.post("/login", auhtController.login);

router.post("/change-password", authenticateJWT, auhtController.changePassword);

export default router;