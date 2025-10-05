"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userEntreprise_controller_1 = require("../controllers/userEntreprise.controller");
const router = (0, express_1.Router)();
router.post('/', userEntreprise_controller_1.UserEntrepriseController.addUserToEntreprise);
router.get('/:entrepriseId', userEntreprise_controller_1.UserEntrepriseController.getUsersByEntreprise);
router.delete('/:id', userEntreprise_controller_1.UserEntrepriseController.removeUserFromEntreprise);
exports.default = router;
