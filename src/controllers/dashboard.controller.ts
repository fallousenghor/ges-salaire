import { Request, Response } from 'express';
import { getDashboardKPI } from '../services/dashboard.service';


export const dashboardKPIController = async (req: Request, res: Response) => {
  try {
    // On suppose que l'entreprise est déterminée par le token ou un paramètre
    const entrepriseId = req.query.entrepriseId ? Number(req.query.entrepriseId) : undefined;
    if (!entrepriseId) {
      return res.status(400).json({ error: 'entrepriseId requis' });
    }
    const kpi = await getDashboardKPI(entrepriseId);
    res.json(kpi);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur', details: error });
  }
};
