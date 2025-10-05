import { Request, Response } from 'express';
import { PayslipService } from '../services/payslip.service';
import { SUCCESS_CODES } from '../utils/messages/success_code';
import { ERROR_CODES } from '../utils/messages/errors_code';
import { ERROR_MESSAGES } from '../utils/messages/errors_messages';
import { generatePayslipPDF } from '../utils/pdfUtil';

const payslipService = new PayslipService();

export class PayslipController {
  // Endpoint to handle payment, only if payslip is approved
  static async payPayslip(req: Request, res: Response) {
    try {
      const { id } = req.params;
      // Fetch payslip
      const payslip = await payslipService.getPayslipById(Number(id));
      if (!payslip) {
        return res.status(404).json({ error: ERROR_MESSAGES.PAYSLIP_NOT_FOUND });
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
    } catch (error) {
      const message = error instanceof Error ? error.message : ERROR_MESSAGES.ERROR_SURVENUE;
      res.status(ERROR_CODES.BAD_REQUEST).json({ error: message });
    }
  }
  static async getPayslipById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const payslip = await payslipService.getPayslipById(Number(id));
      if (!payslip) return res.status(404).json({ error: ERROR_MESSAGES.PAYSLIP_NOT_FOUND });
      res.json(payslip);
    } catch (error) {
      const message = error instanceof Error ? error.message : ERROR_MESSAGES.ERROR_SURVENUE;
      res.status(ERROR_CODES.BAD_REQUEST).json({ error: message });
    }
  }

  static async getPayslipsByPayrun(req: Request, res: Response) {
    try {
      const { payrunId } = req.params;
      if (!payrunId) return res.status(ERROR_CODES.BAD_REQUEST).json({ error: 'payrunId requis' });
      const payslips = await payslipService.getPayslipsByPayrun(Number(payrunId));
      res.json(payslips);
    } catch (error) {
      const message = error instanceof Error ? error.message : ERROR_MESSAGES.ERROR_SURVENUE;
      res.status(ERROR_CODES.BAD_REQUEST).json({ error: message });
    }
  }

  static async downloadPayslipPDF(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const payslip = await payslipService.getPayslipById(Number(id));
      if (!payslip) return res.status(404).json({ error: ERROR_MESSAGES.PAYSLIP_NOT_FOUND });
      const employe = await payslipService.getEmployeById(payslip.employeId);
      if (!employe || !employe.entrepriseId) return res.status(404).json({ error: 'Employé ou entreprise introuvable' });
      const entreprise = await payslipService.getEntrepriseById(employe.entrepriseId);
      if (!entreprise) return res.status(404).json({ error: 'Entreprise introuvable' });
      generatePayslipPDF(res, payslip, employe, entreprise);
    } catch (error) {
      const message = error instanceof Error ? error.message : ERROR_MESSAGES.ERROR_SURVENUE;
      res.status(ERROR_CODES.BAD_REQUEST).json({ error: message });
    }
  }

  static async getAllPayslips(req: Request, res: Response) {
    try {
      // Si c'est un superadmin, retourner tous les bulletins
      // Sinon, filtrer par l'entreprise de l'utilisateur
      const entrepriseId = req.user?.role === 'SUPER_ADMIN' ? undefined : req.user?.entrepriseId;
      const payslips = await payslipService.getAllPayslips(entrepriseId);
      res.json(payslips);
    } catch (error) {
      const message = error instanceof Error ? error.message : ERROR_MESSAGES.ERROR_SURVENUE;
      res.status(ERROR_CODES.BAD_REQUEST).json({ error: message });
    }
  }

  static async getPayslipsByEmployePaginated(req: Request, res: Response) {
    try {
      const { employeId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await payslipService.getPayslipsByEmployePaginated(Number(employeId), page, limit);
      res.json(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : ERROR_MESSAGES.ERROR_SURVENUE;
      res.status(ERROR_CODES.BAD_REQUEST).json({ error: message });
    }
  }

  static async updatePayslipStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { statut } = req.body;
      if (!statut) return res.status(ERROR_CODES.BAD_REQUEST).json({ error: 'Statut requis' });
      const payslip = await payslipService.updatePayslipStatus(Number(id), statut);
      res.json(payslip);
    } catch (error) {
      const message = error instanceof Error ? error.message : ERROR_MESSAGES.ERROR_SURVENUE;
      res.status(ERROR_CODES.BAD_REQUEST).json({ error: message });
    }
  }

  static async createPayslip(req: Request, res: Response) {
    try {
      const payslip = await payslipService.createPayslip(req.body);
      res.status(SUCCESS_CODES.CREATED).json(payslip);
    } catch (error) {
      const message = error instanceof Error ? error.message : ERROR_MESSAGES.ERROR_SURVENUE;
      res.status(ERROR_CODES.BAD_REQUEST).json({ error: message });
    }
  }

  static async getPayslipsByEmploye(req: Request, res: Response) {
    try {
      const { employeId } = req.params;
      const payslips = await payslipService.getPayslipsByEmploye(Number(employeId));
      res.json(payslips);
    } catch (error) {
      const message = error instanceof Error ? error.message : ERROR_MESSAGES.ERROR_SURVENUE;
      res.status(ERROR_CODES.BAD_REQUEST).json({ error: message });
    }
  }

  static async updatePayslip(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const payslip = await payslipService.updatePayslip(Number(id), req.body);
      res.json(payslip);
    } catch (error) {
      const message = error instanceof Error ? error.message : ERROR_MESSAGES.ERROR_SURVENUE;
      res.status(ERROR_CODES.BAD_REQUEST).json({ error: message });
    }
  }

  static async deletePayslip(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await payslipService.deletePayslip(Number(id));
      res.status(SUCCESS_CODES.NO_CONTENT).send();
    } catch (error) {
      const message = error instanceof Error ? error.message : ERROR_MESSAGES.ERROR_SURVENUE;
      res.status(ERROR_CODES.BAD_REQUEST).json({ error: message });
    }
  }
}
