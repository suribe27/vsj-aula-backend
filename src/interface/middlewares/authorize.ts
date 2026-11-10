import { NextFunction, Request, Response } from 'express';
import { ForbiddenError, UnauthorizedError } from '../../application/errors/AppError';
import { Role } from '../../domain/models/user';

/** Se usa después de authenticate: deja pasar solo a los roles indicados. */
export function authorize(...allowed: Role[]) {
  return function checkRole(req: Request, _res: Response, next: NextFunction): void {
    if (!req.auth) {
      throw new UnauthorizedError();
    }
    if (!allowed.includes(req.auth.role)) {
      throw new ForbiddenError();
    }
    next();
  };
}
