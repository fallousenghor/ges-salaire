"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayRunService = void 0;
const db_1 = __importDefault(require("../config/db"));
const payslip_service_1 = require("./payslip.service");
class PayRunService {
    async getAllPayRuns(entrepriseId) {
        return db_1.default.payRun.findMany({
            where: entrepriseId ? { entrepriseId } : undefined,
            orderBy: { createdAt: 'desc' }
        });
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
            if (employe.typeContrat === 'JOURNALIER')
                brut = tauxJournalier;
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
