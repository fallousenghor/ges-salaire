import { Request, Response } from 'express';
import { PayRunService } from '../services/payrun.service';
import { ERROR_MESSAGES } from '../utils/messages/errors_messages';
import { SUCCESS_CODES } from '../utils/messages/success_code';
import { ERROR_CODES } from '../utils/messages/errors_code';

const payRunService = new PayRunService();

export class PayRunController {
  static async createPayRun(req: Request, res: Response) {
    try {
      const payRun = await payRunService.createPayRun(req.body);
      res.status(SUCCESS_CODES.CREATED).json(payRun);
    } catch (error) {
      const message = error instanceof Error ? error.message : ERROR_MESSAGES.ERROR_SURVENUE;
      res.status(ERROR_CODES.BAD_REQUEST).json({ error: message });
    }
  }

  static async getPayRunsByEntreprise(req: Request, res: Response) {
    try {
      const { entrepriseId } = req.params;
      const payRuns = await payRunService.getPayRunsByEntreprise(Number(entrepriseId));
      res.json(payRuns);
    } catch (error) {
      const message = error instanceof Error ? error.message : ERROR_MESSAGES.ERROR_SURVENUE;
      res.status(ERROR_CODES.BAD_REQUEST).json({ error: message });
    }
  }

  static async getPayRunById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const payRun = await payRunService.getPayRunById(Number(id));
      if (!payRun) return res.status(ERROR_CODES.NOT_FOUND).json({ error: ERROR_MESSAGES.PAYRUN_NOT_FOUND });
      res.json(payRun);
    } catch (error) {
      const message = error instanceof Error ? error.message : ERROR_MESSAGES.ERROR_SURVENUE;
      res.status(ERROR_CODES.BAD_REQUEST).json({ error: message });
    }
  }

  static async updatePayRun(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const payRun = await payRunService.updatePayRun(Number(id), req.body);
      res.json(payRun);
    } catch (error) {
      const message = error instanceof Error ? error.message : ERROR_MESSAGES.ERROR_SURVENUE;
      res.status(ERROR_CODES.BAD_REQUEST).json({ error: message });
    }
  }

  static async deletePayRun(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await payRunService.deletePayRun(Number(id));
      res.status(SUCCESS_CODES.NO_CONTENT).send();
    } catch (error) {
      const message = error instanceof Error ? error.message : ERROR_MESSAGES.ERROR_SURVENUE;
      res.status(ERROR_CODES.BAD_REQUEST).json({ error: message });
    }
  }
}
