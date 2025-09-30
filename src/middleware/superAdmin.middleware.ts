
import { Request, Response, NextFunction } from 'express';
import { ERROR_MESSAGES } from '../utils/messages/errors_messages';


export function superAdminMiddleware(req: Request, res: Response, next: NextFunction) {
  if (req.user && req.user.role === 'SUPER_ADMIN') {
    return next();
  }
  return res.status(403).json({ success: false, message: ERROR_MESSAGES.RESERVE_ADMIN });
}
