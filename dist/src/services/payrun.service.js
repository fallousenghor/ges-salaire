"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayRunService = void 0;
const db_1 = __importDefault(require("../config/db"));
const payslip_service_1 = require("./payslip.service");
const pagination_utils_1 = require("../utils/pagination.utils");
class PayRunService {
    async getAllPayRuns(entrepriseId, pagination) {
        const where = entrepriseId ? { entrepriseId } : undefined;
        const total = await db_1.default.payRun.count({ where });
        const items = await db_1.default.payRun.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip: pagination?.page ? (pagination.page - 1) * (pagination.limit || 10) : undefined,
            take: pagination?.limit,
        });
        return pagination ? (0, pagination_utils_1.paginateResults)(items, total, pagination) : items;
    }
    async updatePayRunStatus(id, statut) {
        return db_1.default.payRun.update({ where: { id }, data: { statut: statut } });
    }
    async createPayRun(data) {
        // Retirer typePeriode du payload car il n'existe pas dans le modèle Prisma PayRun
        const { typePeriode, ...rest } = data;
        // Création du cycle de paie
        const payRun = await db_1.default.payRun.create({ data: rest });
        // Récupérer les employés de l'entreprise
        const employes = await db_1.default.employe.findMany({ where: { entrepriseId: rest.entrepriseId, actif: true } });
        // Générer un bulletin de paie pour chaque employé
        const payslipService = new payslip_service_1.PayslipService();
        for (const employe of employes) {
            // Calculs simplifiés, à adapter selon la logique métier
            const salaireFixe = employe.salaireFixe || 0;
            const tauxJournalier = employe.tauxJournalier || 0;
            const honoraire = employe.honoraire || 0;
            let brut = salaireFixe;
            if (employe.typeContrat === 'JOURNALIER') {
                // Calculer le nombre de jours pointés dans le cycle
                const nbJoursTravailles = await db_1.default.pointage.count({
                    where: {
                        employeId: employe.id,
                        date: {
                            gte: new Date(rest.periodeDebut),
                            lte: new Date(rest.periodeFin)
                        }
                    }
                });
                brut = tauxJournalier * nbJoursTravailles;
            }
            if (employe.typeContrat === 'HONORAIRE')
                brut = honoraire;
            // Deductions et net à payer à adapter selon la logique métier
            const deductions = 0;
            const netAPayer = brut - deductions;
            await payslipService.createPayslip({
                employeId: employe.id,
                payrunId: payRun.id,
                brut,
                deductions,
                netAPayer,
                statut: 'EN_ATTENTE',
            });
        }
        return payRun;
    }
    async getPayRunsByEntreprise(entrepriseId) {
        return db_1.default.payRun.findMany({ where: { entrepriseId } });
    }
    async getPayRunById(id) {
        return db_1.default.payRun.findUnique({ where: { id } });
    }
    async updatePayRun(id, data) {
        return db_1.default.payRun.update({ where: { id }, data });
    }
    async deletePayRun(id) {
        return db_1.default.payRun.delete({ where: { id } });
    }
}
exports.PayRunService = PayRunService;
