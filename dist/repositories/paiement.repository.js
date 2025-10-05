"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaiementRepository = void 0;
const db_1 = __importDefault(require("../config/db"));
class PaiementRepository {
    async create(data) {
        return db_1.default.paiement.create({ data });
    }
    async findById(id) {
        return db_1.default.paiement.findUnique({ where: { id } });
    }
    async findAll() {
        return db_1.default.paiement.findMany();
    }
    async update(id, data) {
        return db_1.default.paiement.update({ where: { id }, data });
    }
    async delete(id) {
        return db_1.default.paiement.delete({ where: { id } });
    }
}
exports.PaiementRepository = PaiementRepository;
