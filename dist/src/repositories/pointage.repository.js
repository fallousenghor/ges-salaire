"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PointageRepository = void 0;
const db_1 = __importDefault(require("../config/db"));
class PointageRepository {
    async create(employeId, date = new Date()) {
        return db_1.default.pointage.create({ data: { employeId, date } });
    }
    async countByEmploye(employeId) {
        return db_1.default.pointage.count({ where: { employeId } });
    }
    async getByEmploye(employeId) {
        return db_1.default.pointage.findMany({ where: { employeId } });
    }
}
exports.PointageRepository = PointageRepository;
