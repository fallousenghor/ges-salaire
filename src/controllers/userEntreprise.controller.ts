import { Request, Response } from 'express';
import { UserEntrepriseService } from '../services/userEntreprise.service';
import { ERROR_CODES } from '../utils/messages/errors_code';
import { ERROR_MESSAGES } from '../utils/messages/errors_messages';
import { SUCCESS_CODES } from '../utils/messages/success_code';

const userEntrepriseService = new UserEntrepriseService();

export class UserEntrepriseController {
  static async addUserToEntreprise(req: Request, res: Response) {
    try {
      const { userId, entrepriseId, role } = req.body;
      const userEntreprise = await userEntrepriseService.addUserToEntreprise(userId, entrepriseId, role);
      res.status(SUCCESS_CODES.CREATED).json(userEntreprise);
    } catch (error) {
      const message = error instanceof Error ? error.message : ERROR_MESSAGES.ERROR_SURVENUE;
      res.status(ERROR_CODES.BAD_REQUEST).json({ error: message });
    }
  }

  static async getUsersByEntreprise(req: Request, res: Response) {
    try {
      const { entrepriseId } = req.params;
      const users = await userEntrepriseService.getUsersByEntreprise(Number(entrepriseId));
      res.json(users);
    } catch (error) {
      const message = error instanceof Error ? error.message : ERROR_MESSAGES.ERROR_SURVENUE;
      res.status(ERROR_CODES.BAD_REQUEST).json({ error: message });
    }
  }

  static async removeUserFromEntreprise(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await userEntrepriseService.removeUserFromEntreprise(Number(id));
      res.status(ERROR_CODES.NO_CONTENT).send();
    } catch (error) {
      const message = error instanceof Error ? error.message : ERROR_MESSAGES.ERROR_SURVENUE;
      res.status(ERROR_CODES.BAD_REQUEST).json({ error: message });
    }
  }
}
