"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaiementRepository = void 0;
const db_1 = __importDefault(require("../config/db"));
const pagination_utils_1 = require("../utils/pagination.utils");
class PaiementRepository {
    async create(data) {
        return db_1.default.paiement.create({ data });
    }
    async findById(id) {
        return db_1.default.paiement.findUnique({ where: { id } });
    }
    async findAll(pagination) {
        const total = await db_1.default.paiement.count();
        const items = await db_1.default.paiement.findMany({
            skip: pagination?.page ? (pagination.page - 1) * (pagination.limit || 10) : undefined,
            take: pagination?.limit,
        });
        return pagination ? (0, pagination_utils_1.paginateResults)(items, total, pagination) : items;
    }
    async update(id, data) {
        return db_1.default.paiement.update({ where: { id }, data });
    }
    async delete(id) {
        return db_1.default.paiement.delete({ where: { id } });
    }
}
exports.PaiementRepository = PaiementRepository;
