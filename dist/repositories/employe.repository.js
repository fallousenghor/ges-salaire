"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeRepository = void 0;
const db_1 = __importDefault(require("../config/db"));
class EmployeRepository {
    async create(data) {
        return db_1.default.employe.create({ data });
    }
    async findById(id) {
        return db_1.default.employe.findUnique({ where: { id } });
    }
    async findAll() {
        return db_1.default.employe.findMany();
    }
    async update(id, data) {
        return db_1.default.employe.update({ where: { id }, data });
    }
    async delete(id) {
        return db_1.default.employe.delete({ where: { id } });
    }
}
exports.EmployeRepository = EmployeRepository;
