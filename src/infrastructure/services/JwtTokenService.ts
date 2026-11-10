import jwt, { SignOptions } from 'jsonwebtoken';
import { UnauthorizedError } from '../../application/errors/AppError';
import { TokenPayload, TokenService } from '../../application/ports/TokenService';
import { Role } from '../../domain/models/user';

const ROLES: Role[] = ['ADMIN', 'USER'];

export class JwtTokenService implements TokenService {
  constructor(
    private readonly secret: string,
    private readonly expiresIn: string,
  ) {}

  sign(payload: TokenPayload): string {
    const options = { expiresIn: this.expiresIn } as SignOptions;
    return jwt.sign({ sub: String(payload.sub), role: payload.role }, this.secret, options);
  }

  verify(token: string): TokenPayload {
    try {
      const decoded = jwt.verify(token, this.secret);
      if (typeof decoded === 'string' || !decoded.sub || !ROLES.includes(decoded.role)) {
        throw new UnauthorizedError('Token inválido');
      }
      return { sub: Number(decoded.sub), role: decoded.role as Role };
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedError('La sesión expiró, inicia sesión de nuevo');
      }
      throw new UnauthorizedError('Token inválido');
    }
  }
}
