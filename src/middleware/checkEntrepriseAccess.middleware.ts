import { Request, Response, NextFunction } from 'express';
import { ERROR_MESSAGES } from '../utils/messages/errors_messages';

export function checkEntrepriseAccess(req: Request, res: Response, next: NextFunction) {
  // Si c'est un super admin, autoriser l'accès
  if (req.user && req.user.role === 'SUPER_ADMIN') {
    return next();
  }

  // Pour les autres utilisateurs, vérifier si l'entreprise demandée est la leur
  if (req.user && req.user.entrepriseId) {
    const requestedEntrepriseId = parseInt(req.params.id);
    if (requestedEntrepriseId === req.user.entrepriseId) {
      return next();
    }
  }

  return res.status(403).json({ 
    success: false, 
    message: ERROR_MESSAGES.ACCES_INTERDIT 
  });
}