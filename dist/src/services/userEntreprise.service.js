"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserEntrepriseService = void 0;
const db_1 = __importDefault(require("../config/db"));
class UserEntrepriseService {
    async addUserToEntreprise(userId, entrepriseId, role) {
        return db_1.default.userEntreprise.create({
            data: {
                userId,
                entrepriseId,
                role,
            },
        });
    }
    async getUsersByEntreprise(entrepriseId) {
        return db_1.default.userEntreprise.findMany({
            where: { entrepriseId },
            include: { user: true },
        });
    }
    async removeUserFromEntreprise(userEntrepriseId) {
        return db_1.default.userEntreprise.delete({
            where: { id: userEntrepriseId },
        });
    }
}
exports.UserEntrepriseService = UserEntrepriseService;
