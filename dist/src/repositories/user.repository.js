"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const db_1 = __importDefault(require("../config/db"));
const pagination_utils_1 = require("../utils/pagination.utils");
class UserRepository {
    async create(data) {
        const { roles, statut, ...userData } = data;
        let userEntrepriseToCreate = [];
        if (Array.isArray(roles)) {
            for (const r of roles) {
                if (r.role === 'SUPER_ADMIN') {
                    userEntrepriseToCreate.push({ role: 'SUPER_ADMIN' });
                }
                else if (r.role === 'CAISSIER') {
                    // Si caissier, entrepriseId obligatoire
                    if (!r.entrepriseId) {
                        throw new Error('Le caissier doit être lié à une entreprise (entrepriseId obligatoire)');
                    }
                    userEntrepriseToCreate.push({ entrepriseId: r.entrepriseId, role: r.role });
                }
                else if (r.entrepriseId) {
                    userEntrepriseToCreate.push({ entrepriseId: r.entrepriseId, role: r.role });
                }
            }
        }
        return db_1.default.user.create({
            data: {
                ...userData,
                roles: userEntrepriseToCreate.length > 0 ? { create: userEntrepriseToCreate } : undefined,
            },
        });
    }
    async findSuperAdminAccess(params) {
        return db_1.default.superAdminAccess.findFirst({
            where: params.where
        });
    }
    async findById(id) {
        return db_1.default.user.findUnique({
            where: { id },
            include: { roles: true }
        });
    }
    async findAll(pagination) {
        const total = await db_1.default.user.count();
        const items = await db_1.default.user.findMany({
            include: { roles: true },
            skip: pagination?.page ? (pagination.page - 1) * (pagination.limit || 10) : undefined,
            take: pagination?.limit,
        });
        return pagination ? (0, pagination_utils_1.paginateResults)(items, total, pagination) : items;
    }
    async update(id, data) {
        const { roles, ...userData } = data;
        return db_1.default.user.update({
            where: { id },
            data: {
                ...userData,
                // roles: roles ? { set: roles } : undefined,
            },
            include: { roles: true },
        });
    }
    async delete(id) {
        return db_1.default.user.delete({ where: { id } });
    }
    async findByEmail(email) {
        return db_1.default.user.findUnique({ where: { email }, include: { roles: true } });
    }
}
exports.UserRepository = UserRepository;
