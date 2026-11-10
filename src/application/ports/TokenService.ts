import { Role } from '../../domain/models/user';

export interface TokenPayload {
  sub: number;
  role: Role;
}

export interface TokenService {
  sign(payload: TokenPayload): string;
  verify(token: string): TokenPayload;
}
