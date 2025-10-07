"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayslipService = void 0;
const db_1 = __importDefault(require("../config/db"));
const pagination_utils_1 = require("../utils/pagination.utils");
class PayslipService {
    async getAllPayslipsPaginated(entrepriseId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const where = entrepriseId ? {
            employe: {
                entrepriseId
            }
        } : undefined;
        const [items, total] = await Promise.all([
            db_1.default.payslip.findMany({
                where,
                include: {
                    employe: true,
                    payrun: true
                },
                orderBy: {
                    createdAt: 'desc'
                },
                skip,
                take: limit
            }),
            db_1.default.payslip.count({ where })
        ]);
        const totalPages = Math.ceil(total / limit);
        const hasMore = page < totalPages;
        return {
            items,
            total,
            page,
            totalPages,
            hasMore
        };
    }
    async getAllPayslips(entrepriseId) {
        return db_1.default.payslip.findMany({
            where: entrepriseId ? {
                employe: {
                    entrepriseId
                }
            } : undefined,
            include: {
                employe: true,
                payrun: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }
    async getPayslipsByEmployePaginated(employeId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [payslips, total] = await Promise.all([
            db_1.default.payslip.findMany({ where: { employeId }, skip, take: limit }),
            db_1.default.payslip.count({ where: { employeId } })
        ]);
        return { payslips, total, page, limit };
    }
    async updatePayslipStatus(id, statut) {
        // Cast statut to Prisma enum
        return db_1.default.payslip.update({ where: { id }, data: { statut: statut } });
    }
    // Utilitaires pour PDF
    async getEmployeById(id) {
        return db_1.default.employe.findUnique({ where: { id } });
    }
    async getEntrepriseById(id) {
        return db_1.default.entreprise.findUnique({ where: { id } });
    }
    async createPayslip(data) {
        return db_1.default.payslip.create({ data });
    }
    async getPayslipsByEmploye(employeId) {
        return db_1.default.payslip.findMany({ where: { employeId } });
    }
    async getPayslipsByPayrun(payrunId, pagination) {
        const total = await db_1.default.payslip.count({
            where: { payrunId }
        });
        const items = await db_1.default.payslip.findMany({
            where: { payrunId },
            include: { employe: true },
            skip: pagination?.page ? (pagination.page - 1) * (pagination.limit || 10) : undefined,
            take: pagination?.limit,
            orderBy: { createdAt: 'desc' }
        });
        return pagination ? (0, pagination_utils_1.paginateResults)(items, total, pagination) : items;
    }
    async getPayslipById(id) {
        return db_1.default.payslip.findUnique({ where: { id } });
    }
    async updatePayslip(id, data) {
        return db_1.default.payslip.update({ where: { id }, data });
    }
    async payPayslip(id) {
        // Set statut to 'PAYE' to mark as paid
        return db_1.default.payslip.update({ where: { id }, data: { statut: 'PAYE' } });
    }
    async deletePayslip(id) {
        return db_1.default.payslip.delete({ where: { id } });
    }
}
exports.PayslipService = PayslipService;
