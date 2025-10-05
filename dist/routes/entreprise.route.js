"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const entreprise_controller_1 = require("../controllers/entreprise.controller");
const superAdmin_middleware_1 = require("../middleware/superAdmin.middleware");
const authenticateJWT_middleware_1 = require("../middleware/authenticateJWT.middleware");
const checkEntrepriseAccess_middleware_1 = require("../middleware/checkEntrepriseAccess.middleware");
const upload_1 = require("../config/upload");
const router = (0, express_1.Router)();
const entrepriseController = new entreprise_controller_1.EntrepriseController();
// Routes qui nécessitent d'être super admin
router.post('/', authenticateJWT_middleware_1.authenticateJWT, superAdmin_middleware_1.superAdminMiddleware, upload_1.upload.single('logo'), entrepriseController.createEntreprise);
router.get('/', authenticateJWT_middleware_1.authenticateJWT, superAdmin_middleware_1.superAdminMiddleware, entrepriseController.getAllEntreprises);
router.put('/:id/fermer', authenticateJWT_middleware_1.authenticateJWT, superAdmin_middleware_1.superAdminMiddleware, entrepriseController.fermerEntreprise);
router.delete('/:id', authenticateJWT_middleware_1.authenticateJWT, superAdmin_middleware_1.superAdminMiddleware, entrepriseController.deleteEntreprise);
// Routes qui nécessitent d'être soit super admin soit utilisateur de l'entreprise
router.get('/:id', authenticateJWT_middleware_1.authenticateJWT, checkEntrepriseAccess_middleware_1.checkEntrepriseAccess, entrepriseController.getEntrepriseById);
// Accept logo upload on update as well (multipart/form-data)
router.put('/:id', authenticateJWT_middleware_1.authenticateJWT, checkEntrepriseAccess_middleware_1.checkEntrepriseAccess, upload_1.upload.single('logo'), entrepriseController.updateEntreprise);
exports.default = router;
