import { PointageService } from '../services/pointage.service';
const pointageService = new PointageService();
  // Liste paginée par entreprise


import { Request, Response } from 'express';
import { EmployeService } from '../services/employe.service';
import { ERROR_MESSAGES } from '../utils/messages/errors_messages';
import { ERROR_CODES } from '../utils/messages/errors_code';
import { SUCCESS_CODES } from '../utils/messages/success_code';

const employeService = new EmployeService();

export class EmployeController {
  // Nombre de pointages sur une période
  static async getNbPointages(req: Request, res: Response) {
    try {
      const { employeId } = req.params;
      const { start, end } = req.query;
      if (!employeId || !start || !end) return res.status(ERROR_CODES.BAD_REQUEST).json({ error: 'employeId, start et end requis' });
      const nb = await new PointageService().getNbPointages(Number(employeId), String(start), String(end));
      res.json(nb);
    } catch (error) {
      const message = error instanceof Error ? error.message : ERROR_MESSAGES.ERROR_SURVENUE;
      res.status(ERROR_CODES.BAD_REQUEST).json({ error: message });
    }
  }
  // Dernier pointage d'un employé
  static async getLastPointage(req: Request, res: Response) {
    try {
      const { employeId } = req.params;
      if (!employeId) return res.status(400).json({ error: 'employeId requis' });
      const pointage = await pointageService.getLastPointage(Number(employeId));
      res.json(pointage ? { date: pointage.date } : null);
    } catch (error) {
      const message = error instanceof Error ? error.message : ERROR_MESSAGES.ERROR_SURVENUE;
      res.status(ERROR_CODES.BAD_REQUEST).json({ error: message });
    }
  }
  // Pointage d'un employé
  static async pointerEmploye(req: Request, res: Response) {
    try {
      const { employeId } = req.params;
      if (!employeId) return res.status(ERROR_CODES.BAD_REQUEST).json({ error: 'employeId requis' });
      const pointage = await pointageService.pointer(Number(employeId));
      res.status(SUCCESS_CODES.CREATED).json(pointage);
    } catch (error) {
      const message = error instanceof Error ? error.message : ERROR_MESSAGES.ERROR_SURVENUE;
      res.status(ERROR_CODES.BAD_REQUEST).json({ error: message });
    }
  }
  // Liste paginée par entreprise
  static async getEmployesByEntreprisePaginated(req: Request, res: Response) {
    try {
      const { entrepriseId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await employeService.getEmployesByEntreprisePaginated(Number(entrepriseId), page, limit);
      res.json(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : ERROR_MESSAGES.ERROR_SURVENUE;
      res.status(400).json({ error: message });
    }
  }
  // Recherche/filtres avancés
  static async searchEmployes(req: Request, res: Response) {
    try {
      const { entrepriseId } = req.query;
      if (!entrepriseId) return res.status(ERROR_CODES.BAD_REQUEST).json({ error: 'entrepriseId requis' });
      const filters = {
        statut: req.query.statut as string,
        poste: req.query.poste as string,
        typeContrat: req.query.typeContrat as string,
        actif: req.query.actif !== undefined ? req.query.actif === 'true' : undefined,
      };
      const employes = await employeService.searchEmployes(Number(entrepriseId), filters);
      res.json(employes);
    } catch (error) {
      const message = error instanceof Error ? error.message : ERROR_MESSAGES.ERROR_SURVENUE;
      res.status(400).json({ error: message });
    }
  }

  // Activation/désactivation
  static async setEmployeActif(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { actif } = req.body;
      if (typeof actif !== 'boolean') return res.status(400).json({ error: 'actif (boolean) requis' });
      const employe = await employeService.setEmployeActif(Number(id), actif);
      res.json(employe);
    } catch (error) {
      const message = error instanceof Error ? error.message : ERROR_MESSAGES.ERROR_SURVENUE;
      res.status(400).json({ error: message });
    }
  }

  static async createEmploye(req: Request, res: Response) {
    try {
      const employe = await employeService.createEmploye(req.body);
      // Vérifier si le badge existe
      const badge = await import('../services/badge.service').then(mod => mod.createBadge ? mod.createBadge : null);
      let badgeCreated = false;
      if (badge) {
        // On tente de retrouver le badge créé
        const employeBadge = await import('../config/db').then(mod => mod.default.badge.findUnique({ where: { employeId: employe.id } }));
        badgeCreated = !!employeBadge;
      }
      if (!badgeCreated) {
        return res.status(201).json({ employe, warning: 'Employé créé mais badge non généré.' });
      }
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
