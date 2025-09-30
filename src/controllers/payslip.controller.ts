import { Request, Response } from 'express';
import { PayslipService } from '../services/payslip.service';
import { SUCCESS_CODES } from '../utils/messages/success_code';
import { ERROR_CODES } from '../utils/messages/errors_code';
import { ERROR_MESSAGES } from '../utils/messages/errors_messages';

const payslipService = new PayslipService();

export class PayslipController {
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

  static async getPayslipsByPayrun(req: Request, res: Response) {
    try {
      const { payrunId } = req.params;
      const payslips = await payslipService.getPayslipsByPayrun(Number(payrunId));
      res.json(payslips);
    } catch (error) {
      const message = error instanceof Error ? error.message : ERROR_MESSAGES.ERROR_SURVENUE;
      res.status(ERROR_CODES.BAD_REQUEST).json({ error: message });
    }
  }

  static async getPayslipById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const payslip = await payslipService.getPayslipById(Number(id));
      if (!payslip) return res.status(404).json({ error: ERROR_MESSAGES.PAYSLIP_NOT_FOUND});
      res.json(payslip);
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
