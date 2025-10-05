"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayRunController = void 0;
const payrun_service_1 = require("../services/payrun.service");
const errors_messages_1 = require("../utils/messages/errors_messages");
const success_code_1 = require("../utils/messages/success_code");
const errors_code_1 = require("../utils/messages/errors_code");
const payRunService = new payrun_service_1.PayRunService();
class PayRunController {
    static async getAllPayRuns(req, res) {
        try {
            // Si c'est un superadmin, retourner tous les cycles
            // Sinon, filtrer par l'entreprise de l'utilisateur
            const entrepriseId = req.user?.role === 'SUPER_ADMIN' ? undefined : req.user?.entrepriseId;
            const payRuns = await payRunService.getAllPayRuns(entrepriseId);
            res.json(payRuns);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : errors_messages_1.ERROR_MESSAGES.ERROR_SURVENUE;
            res.status(errors_code_1.ERROR_CODES.BAD_REQUEST).json({ error: message });
        }
    }
    static async updatePayRunStatus(req, res) {
        try {
            const { id } = req.params;
            const { statut } = req.body;
            if (!statut)
                return res.status(errors_code_1.ERROR_CODES.BAD_REQUEST).json({ error: 'Statut requis' });
            // Optionnel : vérifier la validité de la transition de statut ici
            const payRun = await payRunService.updatePayRunStatus(Number(id), statut);
            res.json(payRun);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : errors_messages_1.ERROR_MESSAGES.ERROR_SURVENUE;
            res.status(errors_code_1.ERROR_CODES.BAD_REQUEST).json({ error: message });
        }
    }
    static async createPayRun(req, res) {
        try {
            const { entrepriseId, periodeDebut, periodeFin, typePeriode, statut } = req.body;
            // Validation stricte des champs requis
            if (!entrepriseId || typeof entrepriseId !== 'number' || isNaN(entrepriseId)) {
                return res.status(errors_code_1.ERROR_CODES.BAD_REQUEST).json({ error: "L'identifiant de l'entreprise est requis et doit être un nombre." });
            }
            if (!periodeDebut || isNaN(Date.parse(periodeDebut))) {
                return res.status(errors_code_1.ERROR_CODES.BAD_REQUEST).json({ error: "La date de début est requise et doit être une date valide." });
            }
            if (!periodeFin || isNaN(Date.parse(periodeFin))) {
                return res.status(errors_code_1.ERROR_CODES.BAD_REQUEST).json({ error: "La date de fin est requise et doit être une date valide." });
            }
            const allowedTypes = ['MENSUEL', 'HEBDO', 'JOURNALIER'];
            if (!typePeriode || !allowedTypes.includes(typePeriode)) {
                return res.status(errors_code_1.ERROR_CODES.BAD_REQUEST).json({ error: "Le type de période est requis et doit être parmi : MENSUEL, HEBDO, JOURNALIER." });
            }
            const allowedStatuts = ['BROUILLON', 'APPROUVE', 'CLOTURE'];
            if (statut && !allowedStatuts.includes(statut)) {
                return res.status(errors_code_1.ERROR_CODES.BAD_REQUEST).json({ error: "Le statut doit être parmi : BROUILLON, APPROUVE, CLOTURE." });
            }
            // Conversion des dates en objets Date si besoin
            const data = {
                entrepriseId,
                periodeDebut: new Date(periodeDebut),
                periodeFin: new Date(periodeFin),
                typePeriode,
                statut,
            };
            const payRun = await payRunService.createPayRun(data);
            res.status(success_code_1.SUCCESS_CODES.CREATED).json(payRun);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : errors_messages_1.ERROR_MESSAGES.ERROR_SURVENUE;
            res.status(errors_code_1.ERROR_CODES.BAD_REQUEST).json({ error: message });
        }
    }
    static async getPayRunsByEntreprise(req, res) {
        try {
            const { entrepriseId } = req.params;
            const payRuns = await payRunService.getPayRunsByEntreprise(Number(entrepriseId));
            res.json(payRuns);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : errors_messages_1.ERROR_MESSAGES.ERROR_SURVENUE;
            res.status(errors_code_1.ERROR_CODES.BAD_REQUEST).json({ error: message });
        }
    }
    static async getPayRunById(req, res) {
        try {
            const { id } = req.params;
            const payRun = await payRunService.getPayRunById(Number(id));
            if (!payRun)
                return res.status(errors_code_1.ERROR_CODES.NOT_FOUND).json({ error: errors_messages_1.ERROR_MESSAGES.PAYRUN_NOT_FOUND });
            res.json(payRun);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : errors_messages_1.ERROR_MESSAGES.ERROR_SURVENUE;
            res.status(errors_code_1.ERROR_CODES.BAD_REQUEST).json({ error: message });
        }
    }
    static async updatePayRun(req, res) {
        try {
            const { id } = req.params;
            const payRun = await payRunService.updatePayRun(Number(id), req.body);
            res.json(payRun);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : errors_messages_1.ERROR_MESSAGES.ERROR_SURVENUE;
            res.status(errors_code_1.ERROR_CODES.BAD_REQUEST).json({ error: message });
        }
    }
    static async deletePayRun(req, res) {
        try {
            const { id } = req.params;
            await payRunService.deletePayRun(Number(id));
            res.status(success_code_1.SUCCESS_CODES.NO_CONTENT).send();
        }
        catch (error) {
            const message = error instanceof Error ? error.message : errors_messages_1.ERROR_MESSAGES.ERROR_SURVENUE;
            res.status(errors_code_1.ERROR_CODES.BAD_REQUEST).json({ error: message });
        }
    }
}
exports.PayRunController = PayRunController;
