import { Request, Response } from 'express';
import { PayRunService } from '../services/payrun.service';
import { ERROR_MESSAGES } from '../utils/messages/errors_messages';
import { SUCCESS_CODES } from '../utils/messages/success_code';
import { ERROR_CODES } from '../utils/messages/errors_code';

const payRunService = new PayRunService();

export class PayRunController {
  static async getAllPayRuns(req: Request, res: Response) {
    try {
      // Si c'est un superadmin, retourner tous les cycles
      // Sinon, filtrer par l'entreprise de l'utilisateur
      const entrepriseId = req.user?.role === 'SUPER_ADMIN' ? undefined : req.user?.entrepriseId;
      const payRuns = await payRunService.getAllPayRuns(entrepriseId);
      res.json(payRuns);
    } catch (error) {
      const message = error instanceof Error ? error.message : ERROR_MESSAGES.ERROR_SURVENUE;
      res.status(ERROR_CODES.BAD_REQUEST).json({ error: message });
    }
  }
  static async updatePayRunStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { statut } = req.body;
      if (!statut) return res.status(ERROR_CODES.BAD_REQUEST).json({ error: 'Statut requis' });
      // Optionnel : vérifier la validité de la transition de statut ici
      const payRun = await payRunService.updatePayRunStatus(Number(id), statut);
      res.json(payRun);
    } catch (error) {
      const message = error instanceof Error ? error.message : ERROR_MESSAGES.ERROR_SURVENUE;
      res.status(ERROR_CODES.BAD_REQUEST).json({ error: message });
    }
  }
  static async createPayRun(req: Request, res: Response) {
    try {
      const { entrepriseId, periodeDebut, periodeFin, typePeriode, statut } = req.body;
      // Validation stricte des champs requis
      if (!entrepriseId || typeof entrepriseId !== 'number' || isNaN(entrepriseId)) {
        return res.status(ERROR_CODES.BAD_REQUEST).json({ error: "L'identifiant de l'entreprise est requis et doit être un nombre." });
      }
      if (!periodeDebut || isNaN(Date.parse(periodeDebut))) {
        return res.status(ERROR_CODES.BAD_REQUEST).json({ error: "La date de début est requise et doit être une date valide." });
      }
      if (!periodeFin || isNaN(Date.parse(periodeFin))) {
        return res.status(ERROR_CODES.BAD_REQUEST).json({ error: "La date de fin est requise et doit être une date valide." });
      }
      const allowedTypes = ['MENSUEL', 'HEBDO', 'JOURNALIER'];
      if (!typePeriode || !allowedTypes.includes(typePeriode)) {
        return res.status(ERROR_CODES.BAD_REQUEST).json({ error: "Le type de période est requis et doit être parmi : MENSUEL, HEBDO, JOURNALIER." });
      }
      const allowedStatuts = ['BROUILLON', 'APPROUVE', 'CLOTURE'];
      if (statut && !allowedStatuts.includes(statut)) {
        return res.status(ERROR_CODES.BAD_REQUEST).json({ error: "Le statut doit être parmi : BROUILLON, APPROUVE, CLOTURE." });
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
