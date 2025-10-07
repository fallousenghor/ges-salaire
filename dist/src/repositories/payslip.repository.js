"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayslipRepository = void 0;
const db_1 = __importDefault(require("../config/db"));
const pagination_utils_1 = require("../utils/pagination.utils");
class PayslipRepository {
    async create(data) {
        return db_1.default.payslip.create({ data });
    }
    async findById(id) {
        return db_1.default.payslip.findUnique({ where: { id } });
    }
    async findAll(pagination) {
        const total = await db_1.default.payslip.count();
        const items = await db_1.default.payslip.findMany({
            skip: pagination?.page ? (pagination.page - 1) * (pagination.limit || 10) : undefined,
            take: pagination?.limit,
        });
        return pagination ? (0, pagination_utils_1.paginateResults)(items, total, pagination) : items;
    }
    async update(id, data) {
        return db_1.default.payslip.update({ where: { id }, data });
    }
    async delete(id) {
        return db_1.default.payslip.delete({ where: { id } });
    }
}
exports.PayslipRepository = PayslipRepository;
