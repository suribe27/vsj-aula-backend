import { PrismaClient } from '@prisma/client';
import { CreateUserData, User, UserWithPassword } from '../../domain/models/user';
import { UserRepository } from '../../domain/repository/UserRepository';

const publicFields = {
  id: true,
  name: true,
  email: true,
  role: true,
  status: true,
  createdAt: true,
} as const;

export class PrismaUserRepository implements UserRepository {
  constructor(private readonly db: PrismaClient) {}

  findByEmail(email: string): Promise<UserWithPassword | null> {
    return this.db.user.findUnique({
      where: { email },
      select: { ...publicFields, password: true },
    });
  }

  findById(id: number): Promise<User | null> {
    return this.db.user.findFirst({ where: { id, status: 'ACTIVE' }, select: publicFields });
  }

  create(data: CreateUserData): Promise<User> {
    return this.db.user.create({ data, select: publicFields });
  }
}
