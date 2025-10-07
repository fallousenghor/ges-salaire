"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserEntrepriseController = void 0;
const userEntreprise_service_1 = require("../services/userEntreprise.service");
const errors_code_1 = require("../utils/messages/errors_code");
const errors_messages_1 = require("../utils/messages/errors_messages");
const success_code_1 = require("../utils/messages/success_code");
const userEntrepriseService = new userEntreprise_service_1.UserEntrepriseService();
class UserEntrepriseController {
    static async addUserToEntreprise(req, res) {
        try {
            const { userId, entrepriseId, role } = req.body;
            const userEntreprise = await userEntrepriseService.addUserToEntreprise(userId, entrepriseId, role);
            res.status(success_code_1.SUCCESS_CODES.CREATED).json(userEntreprise);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : errors_messages_1.ERROR_MESSAGES.ERROR_SURVENUE;
            res.status(errors_code_1.ERROR_CODES.BAD_REQUEST).json({ error: message });
        }
    }
    static async getUsersByEntreprise(req, res) {
        try {
            const { entrepriseId } = req.params;
            const users = await userEntrepriseService.getUsersByEntreprise(Number(entrepriseId));
            res.json(users);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : errors_messages_1.ERROR_MESSAGES.ERROR_SURVENUE;
            res.status(errors_code_1.ERROR_CODES.BAD_REQUEST).json({ error: message });
        }
    }
    static async removeUserFromEntreprise(req, res) {
        try {
            const { id } = req.params;
            await userEntrepriseService.removeUserFromEntreprise(Number(id));
            res.status(errors_code_1.ERROR_CODES.NO_CONTENT).send();
        }
        catch (error) {
            const message = error instanceof Error ? error.message : errors_messages_1.ERROR_MESSAGES.ERROR_SURVENUE;
            res.status(errors_code_1.ERROR_CODES.BAD_REQUEST).json({ error: message });
        }
    }
}
exports.UserEntrepriseController = UserEntrepriseController;
