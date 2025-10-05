"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntrepriseRepository = void 0;
const db_1 = __importDefault(require("../config/db"));
class EntrepriseRepository {
    async create(data) {
        return db_1.default.entreprise.create({ data });
    }
    async findById(id) {
        return db_1.default.entreprise.findUnique({ where: { id } });
    }
    async findAll() {
        return db_1.default.entreprise.findMany();
    }
    async update(id, data) {
        return db_1.default.entreprise.update({ where: { id }, data });
    }
    async delete(id) {
        return db_1.default.entreprise.delete({ where: { id } });
    }
}
exports.EntrepriseRepository = EntrepriseRepository;
