import { Request, Response } from 'express';
import { PaiementService } from '../services/paiement.service';
import { SUCCESS_CODES } from '../utils/messages/success_code';
import { ERROR_CODES } from '../utils/messages/errors_code';
import { ERROR_MESSAGES } from '../utils/messages/errors_messages';

const paiementService = new PaiementService();

export class PaiementController {
  static async createPaiement(req: Request, res: Response) {
    try {
      const paiement = await paiementService.createPaiement(req.body);
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
}
