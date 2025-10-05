"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayslipController = void 0;
const payslip_service_1 = require("../services/payslip.service");
const success_code_1 = require("../utils/messages/success_code");
const errors_code_1 = require("../utils/messages/errors_code");
const errors_messages_1 = require("../utils/messages/errors_messages");
const pdfUtil_1 = require("../utils/pdfUtil");
const payslipService = new payslip_service_1.PayslipService();
class PayslipController {
    // Endpoint to handle payment, only if payslip is approved
    static async payPayslip(req, res) {
        try {
            const { id } = req.params;
            // Fetch payslip
            const payslip = await payslipService.getPayslipById(Number(id));
            if (!payslip) {
                return res.status(404).json({ error: errors_messages_1.ERROR_MESSAGES.PAYSLIP_NOT_FOUND });
            }
            // Refuse if already paid
            if (payslip.statut === 'PAYE') {
                return res.status(403).json({ error: "Le bulletin a déjà été payé." });
            }
            // Vérifie l'approbation admin (champ booléen approuveAdmin attendu sur le modèle Payslip)
            if (!payslip.approuveAdmin) {
                return res.status(403).json({ error: "Le bulletin doit être approuvé par l'administrateur avant paiement." });
            }
            // Marque comme payé
            const paidPayslip = await payslipService.payPayslip(Number(id));
            res.json({ message: 'Paiement effectué avec succès', payslip: paidPayslip });
        }
        catch (error) {
            const message = error instanceof Error ? error.message : errors_messages_1.ERROR_MESSAGES.ERROR_SURVENUE;
            res.status(errors_code_1.ERROR_CODES.BAD_REQUEST).json({ error: message });
        }
    }
    static async getPayslipById(req, res) {
        try {
            const { id } = req.params;
            const payslip = await payslipService.getPayslipById(Number(id));
            if (!payslip)
                return res.status(404).json({ error: errors_messages_1.ERROR_MESSAGES.PAYSLIP_NOT_FOUND });
            res.json(payslip);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : errors_messages_1.ERROR_MESSAGES.ERROR_SURVENUE;
            res.status(errors_code_1.ERROR_CODES.BAD_REQUEST).json({ error: message });
        }
    }
    static async getPayslipsByPayrun(req, res) {
        try {
            const { payrunId } = req.params;
            if (!payrunId)
                return res.status(errors_code_1.ERROR_CODES.BAD_REQUEST).json({ error: 'payrunId requis' });
            const payslips = await payslipService.getPayslipsByPayrun(Number(payrunId));
            res.json(payslips);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : errors_messages_1.ERROR_MESSAGES.ERROR_SURVENUE;
            res.status(errors_code_1.ERROR_CODES.BAD_REQUEST).json({ error: message });
        }
    }
    static async downloadPayslipPDF(req, res) {
        try {
            const { id } = req.params;
            const payslip = await payslipService.getPayslipById(Number(id));
            if (!payslip)
                return res.status(404).json({ error: errors_messages_1.ERROR_MESSAGES.PAYSLIP_NOT_FOUND });
            const employe = await payslipService.getEmployeById(payslip.employeId);
            if (!employe || !employe.entrepriseId)
                return res.status(404).json({ error: 'Employé ou entreprise introuvable' });
            const entreprise = await payslipService.getEntrepriseById(employe.entrepriseId);
            if (!entreprise)
                return res.status(404).json({ error: 'Entreprise introuvable' });
            (0, pdfUtil_1.generatePayslipPDF)(res, payslip, employe, entreprise);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : errors_messages_1.ERROR_MESSAGES.ERROR_SURVENUE;
            res.status(errors_code_1.ERROR_CODES.BAD_REQUEST).json({ error: message });
        }
    }
    static async getAllPayslips(req, res) {
        try {
            // Si c'est un superadmin, retourner tous les bulletins
            // Sinon, filtrer par l'entreprise de l'utilisateur
            const entrepriseId = req.user?.role === 'SUPER_ADMIN' ? undefined : req.user?.entrepriseId;
            const payslips = await payslipService.getAllPayslips(entrepriseId);
            res.json(payslips);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : errors_messages_1.ERROR_MESSAGES.ERROR_SURVENUE;
            res.status(errors_code_1.ERROR_CODES.BAD_REQUEST).json({ error: message });
        }
    }
    static async getPayslipsByEmployePaginated(req, res) {
        try {
            const { employeId } = req.params;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const result = await payslipService.getPayslipsByEmployePaginated(Number(employeId), page, limit);
            res.json(result);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : errors_messages_1.ERROR_MESSAGES.ERROR_SURVENUE;
            res.status(errors_code_1.ERROR_CODES.BAD_REQUEST).json({ error: message });
        }
    }
    static async updatePayslipStatus(req, res) {
        try {
            const { id } = req.params;
            const { statut } = req.body;
            if (!statut)
                return res.status(errors_code_1.ERROR_CODES.BAD_REQUEST).json({ error: 'Statut requis' });
            const payslip = await payslipService.updatePayslipStatus(Number(id), statut);
            res.json(payslip);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : errors_messages_1.ERROR_MESSAGES.ERROR_SURVENUE;
            res.status(errors_code_1.ERROR_CODES.BAD_REQUEST).json({ error: message });
        }
    }
    static async createPayslip(req, res) {
        try {
            const payslip = await payslipService.createPayslip(req.body);
            res.status(success_code_1.SUCCESS_CODES.CREATED).json(payslip);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : errors_messages_1.ERROR_MESSAGES.ERROR_SURVENUE;
            res.status(errors_code_1.ERROR_CODES.BAD_REQUEST).json({ error: message });
        }
    }
    static async getPayslipsByEmploye(req, res) {
        try {
            const { employeId } = req.params;
            const payslips = await payslipService.getPayslipsByEmploye(Number(employeId));
            res.json(payslips);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : errors_messages_1.ERROR_MESSAGES.ERROR_SURVENUE;
            res.status(errors_code_1.ERROR_CODES.BAD_REQUEST).json({ error: message });
        }
    }
    static async updatePayslip(req, res) {
        try {
            const { id } = req.params;
            const payslip = await payslipService.updatePayslip(Number(id), req.body);
            res.json(payslip);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : errors_messages_1.ERROR_MESSAGES.ERROR_SURVENUE;
            res.status(errors_code_1.ERROR_CODES.BAD_REQUEST).json({ error: message });
        }
    }
    static async deletePayslip(req, res) {
        try {
            const { id } = req.params;
            await payslipService.deletePayslip(Number(id));
            res.status(success_code_1.SUCCESS_CODES.NO_CONTENT).send();
        }
        catch (error) {
            const message = error instanceof Error ? error.message : errors_messages_1.ERROR_MESSAGES.ERROR_SURVENUE;
            res.status(errors_code_1.ERROR_CODES.BAD_REQUEST).json({ error: message });
        }
    }
}
exports.PayslipController = PayslipController;
