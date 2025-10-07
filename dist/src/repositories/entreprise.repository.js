"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntrepriseRepository = void 0;
const db_1 = __importDefault(require("../config/db"));
const pagination_utils_1 = require("../utils/pagination.utils");
class EntrepriseRepository {
    async create(data) {
        return db_1.default.entreprise.create({ data });
    }
    async findById(id) {
        return db_1.default.entreprise.findUnique({ where: { id } });
    }
    async findAll(pagination) {
        const total = await db_1.default.entreprise.count();
        const items = await db_1.default.entreprise.findMany({
            skip: pagination?.page ? (pagination.page - 1) * (pagination.limit || 10) : undefined,
            take: pagination?.limit,
            include: {
                superAdminAccess: {
                    include: {
                        superAdmin: {
                            include: {
                                user: {
                                    select: {
                                        id: true,
                                        email: true,
                                        nom: true,
                                        prenom: true
                                    }
                                }
                            }
                        }
                    },
                    where: {
                        hasAccess: true
                    }
                }
            }
        });
        return pagination ? (0, pagination_utils_1.paginateResults)(items, total, pagination) : items;
    }
    async update(id, data) {
        return db_1.default.entreprise.update({ where: { id }, data });
    }
    async delete(id) {
        return db_1.default.entreprise.delete({ where: { id } });
    }
}
exports.EntrepriseRepository = EntrepriseRepository;
