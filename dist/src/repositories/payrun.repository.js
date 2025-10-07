"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayRunRepository = void 0;
const db_1 = __importDefault(require("../config/db"));
class PayRunRepository {
    async create(data) {
        return db_1.default.payRun.create({ data });
    }
    async findById(id) {
        return db_1.default.payRun.findUnique({ where: { id } });
    }
    async findAll() {
        return db_1.default.payRun.findMany();
    }
    async update(id, data) {
        return db_1.default.payRun.update({ where: { id }, data });
    }
    async delete(id) {
        return db_1.default.payRun.delete({ where: { id } });
    }
}
exports.PayRunRepository = PayRunRepository;
