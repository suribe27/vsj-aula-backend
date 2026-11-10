import { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../../application/errors/AppError';
import { TokenService } from '../../application/ports/TokenService';

const BEARER_PREFIX = 'Bearer ';

export function createAuthenticate(tokens: TokenService) {
  return function authenticate(req: Request, _res: Response, next: NextFunction): void {
    const header = req.headers.authorization;
    if (!header || !header.startsWith(BEARER_PREFIX)) {
      throw new UnauthorizedError('Debes iniciar sesión para acceder a este recurso');
    }

    const payload = tokens.verify(header.slice(BEARER_PREFIX.length).trim());
    req.auth = { id: payload.sub, role: payload.role };
    next();
  };
}
