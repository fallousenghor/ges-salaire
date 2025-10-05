import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ERROR_MESSAGES } from '../utils/messages/errors_messages';



declare module 'express-serve-static-core' {
  interface Request {
    user?: { [key: string]: any; role?: string };
  }
}

export function authenticateJWT(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  let token = null;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.query.token) {
    token = req.query.token as string;
  } else if (req.body && req.body.token) {
    token = req.body.token;
  }
  if (!token) {
    return res.status(401).json({ success: false, message: ERROR_MESSAGES.TOKEN_MISSING });
  }
  try {
    const secret = process.env.JWT_SECRET || 'votre_secret';
    const decoded = jwt.verify(token, secret);
    if (typeof decoded === 'object' && decoded !== null) {
      req.user = decoded as { [key: string]: any; role?: string };
      next();
    } else {
      return res.status(401).json({ success: false, message: ERROR_MESSAGES.INVALID_TOKEN });
    }
  } catch (err) {
    return res.status(401).json({ success: false, message: ERROR_MESSAGES.INVALID_TOKEN });
  }
}
