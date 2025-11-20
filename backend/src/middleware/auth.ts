import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from '../entities/User';

export interface AuthRequest extends Request {
  user?: { id: string; role: UserRole; username: string };
}

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

export function generateToken(payload: { id: string; role: UserRole; username: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '12h' });
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header) {
    res.status(401).json({ message: 'No se envió token de autenticación' });
    return;
  }

  const [, token] = header.split(' ');
  if (!token) {
    res.status(401).json({ message: 'Token inválido' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload & {
      id: string;
      role: UserRole;
      username: string;
    };
    if (!decoded?.id || !decoded?.role) {
      res.status(401).json({ message: 'Token inválido' });
      return;
    }
    req.user = { id: decoded.id, role: decoded.role, username: decoded.username };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido' });
  }
}

export function requireRoles(roles: UserRole[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ message: 'No tienes permisos para realizar esta acción' });
      return;
    }
    next();
  };
}
