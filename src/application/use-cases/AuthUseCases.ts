import { User } from '../../domain/models/user';
import { UserRepository } from '../../domain/repository/UserRepository';
import { ConflictError, NotFoundError, UnauthorizedError } from '../errors/AppError';
import { PasswordHasher } from '../ports/PasswordHasher';
import { TokenService } from '../ports/TokenService';

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResult {
  user: User;
  token: string;
}

const INVALID_CREDENTIALS = 'Credenciales inválidas';

export class AuthUseCases {
  constructor(
    private readonly users: UserRepository,
    private readonly hasher: PasswordHasher,
    private readonly tokens: TokenService,
  ) {}

  async register(input: RegisterInput): Promise<AuthResult> {
    const email = input.email.toLowerCase();
    const existing = await this.users.findByEmail(email);
    if (existing) {
      throw new ConflictError('Ya existe una cuenta con ese correo');
    }

    const password = await this.hasher.hash(input.password);
    const user = await this.users.create({ name: input.name, email, password, role: 'USER' });
    return { user, token: this.tokens.sign({ sub: user.id, role: user.role }) };
  }

  async login(input: LoginInput): Promise<AuthResult> {
    const found = await this.users.findByEmail(input.email.toLowerCase());
    if (!found || found.status !== 'ACTIVE') {
      throw new UnauthorizedError(INVALID_CREDENTIALS);
    }

    const matches = await this.hasher.compare(input.password, found.password);
    if (!matches) {
      throw new UnauthorizedError(INVALID_CREDENTIALS);
    }

    const user: User = {
      id: found.id,
      name: found.name,
      email: found.email,
      role: found.role,
      status: found.status,
      createdAt: found.createdAt,
    };
    return { user, token: this.tokens.sign({ sub: user.id, role: user.role }) };
  }

  async profile(userId: number): Promise<User> {
    const user = await this.users.findById(userId);
    if (!user) {
      throw new NotFoundError('Usuario');
    }
    return user;
  }
}
