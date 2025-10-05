"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaiementController = void 0;
const paiement_service_1 = require("../services/paiement.service");
const pdfUtil_1 = require("../utils/pdfUtil");
const success_code_1 = require("../utils/messages/success_code");
const errors_code_1 = require("../utils/messages/errors_code");
const errors_messages_1 = require("../utils/messages/errors_messages");
const paiementService = new paiement_service_1.PaiementService();
class PaiementController {
    static async generateRecuPDF(req, res) {
        try {
            const { id } = req.params;
            // Récupère le paiement, le payslip, l'employé et l'entreprise
            const paiement = await paiementService.getPaiementById(Number(id));
            if (!paiement)
                return res.status(404).json({ error: errors_messages_1.ERROR_MESSAGES.PAIMENT_NOT_FOUND });
            const payslip = await paiementService.getPayslipById(paiement.payslipId);
            if (!payslip)
                return res.status(404).json({ error: 'Payslip non trouvé' });
            const employe = await paiementService.getEmployeById(payslip.employeId);
            if (!employe)
                return res.status(404).json({ error: 'Employé non trouvé' });
            const entreprise = await paiementService.getEntrepriseById(employe.entrepriseId);
            if (!entreprise)
                return res.status(404).json({ error: 'Entreprise non trouvée' });
            (0, pdfUtil_1.generateRecuPDF)(res, paiement, employe, entreprise);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : errors_messages_1.ERROR_MESSAGES.ERROR_SURVENUE;
            res.status(errors_code_1.ERROR_CODES.BAD_REQUEST).json({ error: message });
        }
    }
    static async createPaiement(req, res) {
        try {
            const paiement = await paiementService.createPaiement(req.body);
            // Mettre à jour le statut du bulletin de paie à 'PAYE'
            if (paiement && paiement.payslipId) {
                // On importe dynamiquement le service Payslip pour éviter les cycles
                const { PayslipService } = require('../services/payslip.service');
                const payslipService = new PayslipService();
                await payslipService.updatePayslipStatus(paiement.payslipId, 'PAYE');
            }
            res.status(success_code_1.SUCCESS_CODES.CREATED).json(paiement);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : errors_messages_1.ERROR_MESSAGES.ERROR_SURVENUE;
            res.status(errors_code_1.ERROR_CODES.BAD_REQUEST).json({ error: message });
        }
    }
    static async getPaiementsByPayslip(req, res) {
        try {
            const { payslipId } = req.params;
            const paiements = await paiementService.getPaiementsByPayslip(Number(payslipId));
            res.json(paiements);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : errors_messages_1.ERROR_MESSAGES.ERROR_SURVENUE;
            res.status(errors_code_1.ERROR_CODES.BAD_REQUEST).json({ error: message });
        }
    }
    static async getPaiementById(req, res) {
        try {
            const { id } = req.params;
            const paiement = await paiementService.getPaiementById(Number(id));
            if (!paiement)
                return res.status(404).json({ error: errors_messages_1.ERROR_MESSAGES.PAIMENT_NOT_FOUND });
            res.json(paiement);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : errors_messages_1.ERROR_MESSAGES.ERROR_SURVENUE;
            res.status(errors_code_1.ERROR_CODES.BAD_REQUEST).json({ error: message });
        }
    }
    static async updatePaiement(req, res) {
        try {
            const { id } = req.params;
            const paiement = await paiementService.updatePaiement(Number(id), req.body);
            res.json(paiement);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : errors_messages_1.ERROR_MESSAGES.ERROR_SURVENUE;
            res.status(errors_code_1.ERROR_CODES.BAD_REQUEST).json({ error: message });
        }
    }
    static async deletePaiement(req, res) {
        try {
            const { id } = req.params;
            await paiementService.deletePaiement(Number(id));
            res.status(success_code_1.SUCCESS_CODES.NO_CONTENT).send();
        }
        catch (error) {
            const message = error instanceof Error ? error.message : errors_messages_1.ERROR_MESSAGES.ERROR_SURVENUE;
            res.status(errors_code_1.ERROR_CODES.BAD_REQUEST).json({ error: message });
        }
    }
    static async getCurrentMonthStats(req, res) {
        try {
            const { entrepriseId } = req.params;
            const stats = await paiementService.getCurrentMonthStats(Number(entrepriseId));
            res.json(stats);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : errors_messages_1.ERROR_MESSAGES.ERROR_SURVENUE;
            res.status(errors_code_1.ERROR_CODES.BAD_REQUEST).json({ error: message });
        }
    }
    // Liste paginée des paiements par payslip
    static async getPaiementsByPayslipPaginated(req, res) {
        try {
            const { payslipId } = req.params;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const result = await paiementService.getPaiementsByPayslipPaginated(Number(payslipId), page, limit);
            res.json(result);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : errors_messages_1.ERROR_MESSAGES.ERROR_SURVENUE;
            res.status(errors_code_1.ERROR_CODES.BAD_REQUEST).json({ error: message });
        }
    }
    static async updatePaiementStatus(req, res) {
        try {
            const { id } = req.params;
            const { statut } = req.body;
            if (!statut)
                return res.status(errors_code_1.ERROR_CODES.BAD_REQUEST).json({ error: 'Statut requis' });
            const paiement = await paiementService.updatePaiementStatus(Number(id), statut);
            res.json(paiement);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : errors_messages_1.ERROR_MESSAGES.ERROR_SURVENUE;
            res.status(errors_code_1.ERROR_CODES.BAD_REQUEST).json({ error: message });
        }
    }
}
exports.PaiementController = PaiementController;
