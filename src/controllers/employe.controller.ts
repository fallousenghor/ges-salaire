import { Request, Response } from 'express';
import { EmployeService } from '../services/employe.service';
import { ERROR_MESSAGES } from '../utils/messages/errors_messages';

const employeService = new EmployeService();

export class EmployeController {
  static async createEmploye(req: Request, res: Response) {
    try {
      const employe = await employeService.createEmploye(req.body);
      res.status(201).json(employe);
    } catch (error) {
      const message = error instanceof Error ? error.message : ERROR_MESSAGES.ERROR_SURVENUE;
      res.status(400).json({ error: message });
    }
  }

  static async getEmployesByEntreprise(req: Request, res: Response) {
    try {
      const { entrepriseId } = req.params;
      const employes = await employeService.getEmployesByEntreprise(Number(entrepriseId));
      res.json(employes);
    } catch (error) {
      const message = error instanceof Error ? error.message : ERROR_MESSAGES.ERROR_SURVENUE;
      res.status(400).json({ error: message });
    }
  }

  static async getEmployeById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const employe = await employeService.getEmployeById(Number(id));
      if (!employe) return res.status(404).json({ error: ERROR_MESSAGES.EMPLOYE_NOT_FOUND });
      res.json(employe);
    } catch (error) {
      const message = error instanceof Error ? error.message : ERROR_MESSAGES.ERROR_SURVENUE;
      res.status(400).json({ error: message });
    }
  }

  static async updateEmploye(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const employe = await employeService.updateEmploye(Number(id), req.body);
      res.json(employe);
    } catch (error) {
      const message = error instanceof Error ? error.message : ERROR_MESSAGES.ERROR_SURVENUE;
      res.status(400).json({ error: message });
    }
  }

  static async deleteEmploye(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await employeService.deleteEmploye(Number(id));
      res.status(204).send();
    } catch (error) {
      const message = error instanceof Error ? error.message : ERROR_MESSAGES.ERROR_SURVENUE;
      res.status(400).json({ error: message });
    }
  }
}
