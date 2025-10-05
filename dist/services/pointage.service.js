"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PointageService = void 0;
const pointage_repository_1 = require("../repositories/pointage.repository");
const db_1 = __importDefault(require("../config/db"));
const pointageRepository = new pointage_repository_1.PointageRepository();
class PointageService {
    async getNbPointages(employeId, start, end) {
        return db_1.default.pointage.count({
            where: {
                employeId,
                date: {
                    gte: new Date(start),
                    lte: new Date(end)
                }
            }
        });
    }
    async getLastPointage(employeId) {
        const pointages = await pointageRepository.getByEmploye(employeId);
        if (!pointages.length)
            return null;
        // Récupère le plus récent
        return pointages.reduce((latest, p) => new Date(p.date) > new Date(latest.date) ? p : latest, pointages[0]);
    }
    async pointer(employeId) {
        // Enregistre le pointage du jour
        return pointageRepository.create(employeId);
    }
    async getNbJoursTravailles(employeId) {
        return pointageRepository.countByEmploye(employeId);
    }
}
exports.PointageService = PointageService;
