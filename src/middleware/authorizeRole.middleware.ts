import { Request, Response, NextFunction } from 'express';
import { ERROR_MESSAGES } from '../utils/messages/errors_messages';
import { ERROR_CODES } from '../utils/messages/errors_code';

export function authorizeRole(roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user || !user.role) {
      return res.status(ERROR_CODES.UNAUTHORIZED).json({ success: false, message: ERROR_MESSAGES.TOKEN_MISSING });
    }
    if (user.role === 'SUPER_ADMIN' && !roles.includes('SUPER_ADMIN')) {
      return res.status(ERROR_CODES.FORBIDDEN).json({ success: false, message: ERROR_MESSAGES.RESERVE_ADMIN });
    }
    if (roles.includes(user.role)) {
      return next();
    }
    return res.status(ERROR_CODES.FORBIDDEN).json({ success: false, message: ERROR_MESSAGES.ERROR_SURVENUE });
  };
}
