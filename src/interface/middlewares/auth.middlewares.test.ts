import { NextFunction, Request, Response } from 'express';
import { describe, expect, it, vi } from 'vitest';
import { ForbiddenError, UnauthorizedError } from '../../application/errors/AppError';
import { TokenService } from '../../application/ports/TokenService';
import { createAuthenticate } from './authenticate';
import { authorize } from './authorize';

const response = {} as Response;

function requestWith(headers: Record<string, string>, auth?: Request['auth']): Request {
  return { headers, auth } as unknown as Request;
}

const tokens: TokenService = {
  sign: () => 'token',
  verify: (token) => {
    if (token !== 'valido') {
      throw new UnauthorizedError('Token inválido');
    }
    return { sub: 7, role: 'USER' };
  },
};

describe('authenticate', () => {
  const authenticate = createAuthenticate(tokens);

  it('responde 401 si no hay header Authorization', () => {
    expect(() => authenticate(requestWith({}), response, vi.fn())).toThrow(UnauthorizedError);
  });

  it('responde 401 si el token es inválido', () => {
    const req = requestWith({ authorization: 'Bearer falso' });
    expect(() => authenticate(req, response, vi.fn())).toThrow(UnauthorizedError);
  });

  it('agrega el usuario a la petición si el token es válido', () => {
    const req = requestWith({ authorization: 'Bearer valido' });
    const next = vi.fn() as NextFunction;
    authenticate(req, response, next);
    expect(req.auth).toEqual({ id: 7, role: 'USER' });
    expect(next).toHaveBeenCalledOnce();
  });
});

describe('authorize', () => {
  it('responde 403 si el rol no tiene permiso', () => {
    const req = requestWith({}, { id: 7, role: 'USER' });
    expect(() => authorize('ADMIN')(req, response, vi.fn())).toThrow(ForbiddenError);
  });

  it('deja pasar al rol permitido', () => {
    const req = requestWith({}, { id: 1, role: 'ADMIN' });
    const next = vi.fn() as NextFunction;
    authorize('ADMIN')(req, response, next);
    expect(next).toHaveBeenCalledOnce();
  });
});
