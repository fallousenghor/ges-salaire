import { Request, Response } from 'express';
import { PaiementService } from '../services/paiement.service';
import { generateRecuPDF } from '../utils/pdfUtil';
import { SUCCESS_CODES } from '../utils/messages/success_code';
import { ERROR_CODES } from '../utils/messages/errors_code';
import { ERROR_MESSAGES } from '../utils/messages/errors_messages';

const paiementService = new PaiementService();

export class PaiementController {
  static async generateRecuPDF(req: Request, res: Response) {
    try {
      const { id } = req.params;
      // Récupère le paiement, le payslip, l'employé et l'entreprise
      const paiement = await paiementService.getPaiementById(Number(id));
      if (!paiement) return res.status(404).json({ error: ERROR_MESSAGES.PAIMENT_NOT_FOUND });
      const payslip = await paiementService.getPayslipById(paiement.payslipId);
      if (!payslip) return res.status(404).json({ error: 'Payslip non trouvé' });
      const employe = await paiementService.getEmployeById(payslip.employeId);
      if (!employe) return res.status(404).json({ error: 'Employé non trouvé' });
      const entreprise = await paiementService.getEntrepriseById(employe.entrepriseId);
      if (!entreprise) return res.status(404).json({ error: 'Entreprise non trouvée' });
      generateRecuPDF(res, paiement, employe, entreprise);
    } catch (error) {
      const message = error instanceof Error ? error.message : ERROR_MESSAGES.ERROR_SURVENUE;
      res.status(ERROR_CODES.BAD_REQUEST).json({ error: message });
    }
  }

  static async createPaiement(req: Request, res: Response) {
    try {
      const paiement = await paiementService.createPaiement(req.body);
      // Mettre à jour le statut du bulletin de paie à 'PAYE'
      if (paiement && paiement.payslipId) {
        // On importe dynamiquement le service Payslip pour éviter les cycles
        const { PayslipService } = require('../services/payslip.service');
        const payslipService = new PayslipService();
        await payslipService.updatePayslipStatus(paiement.payslipId, 'PAYE');
      }
      res.status(SUCCESS_CODES.CREATED).json(paiement);
    } catch (error) {
      const message = error instanceof Error ? error.message : ERROR_MESSAGES.ERROR_SURVENUE;
      res.status(ERROR_CODES.BAD_REQUEST).json({ error: message });
    }
  }

  static async getPaiementsByPayslip(req: Request, res: Response) {
    try {
      const { payslipId } = req.params;
      const paiements = await paiementService.getPaiementsByPayslip(Number(payslipId));
      res.json(paiements);
    } catch (error) {
      const message = error instanceof Error ? error.message : ERROR_MESSAGES.ERROR_SURVENUE;
      res.status(ERROR_CODES.BAD_REQUEST).json({ error: message });
    }
  }

  static async getPaiementById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const paiement = await paiementService.getPaiementById(Number(id));
      if (!paiement) return res.status(404).json({ error: ERROR_MESSAGES.PAIMENT_NOT_FOUND });
      res.json(paiement);
    } catch (error) {
      const message = error instanceof Error ? error.message : ERROR_MESSAGES.ERROR_SURVENUE;
      res.status(ERROR_CODES.BAD_REQUEST).json({ error: message });
    }
  }

  static async updatePaiement(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const paiement = await paiementService.updatePaiement(Number(id), req.body);
      res.json(paiement);
    } catch (error) {
      const message = error instanceof Error ? error.message : ERROR_MESSAGES.ERROR_SURVENUE;
      res.status(ERROR_CODES.BAD_REQUEST).json({ error: message });
    }
  }

  static async deletePaiement(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await paiementService.deletePaiement(Number(id));
      res.status(SUCCESS_CODES.NO_CONTENT).send();
    } catch (error) {
      const message = error instanceof Error ? error.message : ERROR_MESSAGES.ERROR_SURVENUE;
      res.status(ERROR_CODES.BAD_REQUEST).json({ error: message });
    }
  }

  static async getCurrentMonthStats(req: Request, res: Response) {
    try {
      const { entrepriseId } = req.params;
      const stats = await paiementService.getCurrentMonthStats(Number(entrepriseId));
      res.json(stats);
    } catch (error) {
      const message = error instanceof Error ? error.message : ERROR_MESSAGES.ERROR_SURVENUE;
      res.status(ERROR_CODES.BAD_REQUEST).json({ error: message });
    }
  }

  // Liste paginée des paiements par payslip
  static async getPaiementsByPayslipPaginated(req: Request, res: Response) {
    try {
      const { payslipId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await paiementService.getPaiementsByPayslipPaginated(Number(payslipId), page, limit);
      res.json(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : ERROR_MESSAGES.ERROR_SURVENUE;
      res.status(ERROR_CODES.BAD_REQUEST).json({ error: message });
    }
  }

  static async updatePaiementStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { statut } = req.body;
      if (!statut) return res.status(ERROR_CODES.BAD_REQUEST).json({ error: 'Statut requis' });
      const paiement = await paiementService.updatePaiementStatus(Number(id), statut);
      res.json(paiement);
    } catch (error) {
      const message = error instanceof Error ? error.message : ERROR_MESSAGES.ERROR_SURVENUE;
      res.status(ERROR_CODES.BAD_REQUEST).json({ error: message });
    }
  }
}





