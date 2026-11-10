import { Request } from 'express';
import { UnauthorizedError } from '../../application/errors/AppError';
import { AuthUser } from '../../domain/models/user';

/** Devuelve el usuario autenticado; solo se usa en rutas protegidas por authenticate. */
export function requesterOf(req: Request): AuthUser {
  if (!req.auth) {
    throw new UnauthorizedError();
  }
  return req.auth;
}
