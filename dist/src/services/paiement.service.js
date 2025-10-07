"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaiementService = void 0;
const db_1 = __importDefault(require("../config/db"));
class PaiementService {
    async getPaiementsByPayslipPaginated(payslipId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [paiements, total] = await Promise.all([
            db_1.default.paiement.findMany({ where: { payslipId }, skip, take: limit }),
            db_1.default.paiement.count({ where: { payslipId } })
        ]);
        return { paiements, total, page, limit };
    }
    // Utilitaires pour PDF
    async getPayslipById(id) {
        return db_1.default.payslip.findUnique({ where: { id } });
    }
    async getEmployeById(id) {
        return db_1.default.employe.findUnique({ where: { id } });
    }
    async getEntrepriseById(id) {
        return db_1.default.entreprise.findUnique({ where: { id } });
    }
    async createPaiement(data) {
        return db_1.default.paiement.create({ data });
    }
    async getPaiementsByPayslip(payslipId) {
        return db_1.default.paiement.findMany({ where: { payslipId } });
    }
    async getPaiementById(id) {
        return db_1.default.paiement.findUnique({ where: { id } });
    }
    async updatePaiement(id, data) {
        return db_1.default.paiement.update({ where: { id }, data });
    }
    async deletePaiement(id) {
        return db_1.default.paiement.delete({ where: { id } });
    }
    // Met à jour le statut d'un paiement (si champ statut existe)
    async updatePaiementStatus(id, statut) {
        return db_1.default.paiement.update({
            where: { id },
            data: { statut: statut },
        });
    }
    async getCurrentMonthStats(entrepriseId) {
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
        // Obtenir les employés actifs
        const actifs = await db_1.default.employe.count({
            where: {
                entrepriseId,
                actif: true
            }
        });
        // Obtenir les bulletins et paiements du mois en cours avec leurs relations
        const payslips = await db_1.default.payslip.findMany({
            where: {
                employe: {
                    entrepriseId
                },
                createdAt: {
                    gte: firstDayOfMonth,
                    lte: lastDayOfMonth
                }
            },
            select: {
                brut: true,
                netAPayer: true,
                paiements: {
                    select: {
                        montant: true
                    }
                }
            }
        });
        // Calculer les totaux
        const masseSalariale = payslips.reduce((sum, p) => sum + (p.brut || 0), 0);
        const montantPaye = payslips.reduce((sum, p) => sum + p.paiements.reduce((pSum, paiement) => pSum + (paiement.montant || 0), 0), 0);
        const montantRestant = payslips.reduce((sum, p) => sum + (p.netAPayer || 0), 0) - montantPaye;
        return {
            actifs,
            masseSalariale,
            montantPaye,
            montantRestant
        };
    }
}
exports.PaiementService = PaiementService;
