import { AuthUseCases } from './application/use-cases/AuthUseCases';
import { CategoryUseCases } from './application/use-cases/CategoryUseCases';
import { env } from './infrastructure/config/env';
import { prisma } from './infrastructure/database/prisma';
import { PrismaCategoryRepository } from './infrastructure/repository/PrismaCategoryRepository';
import { PrismaUserRepository } from './infrastructure/repository/PrismaUserRepository';
import { BcryptPasswordHasher } from './infrastructure/services/BcryptPasswordHasher';
import { JwtTokenService } from './infrastructure/services/JwtTokenService';
import { AuthController } from './interface/controllers/AuthController';
import { CategoryController } from './interface/controllers/CategoryController';
import { createAuthenticate } from './interface/middlewares/authenticate';

/** Punto de composición: aquí se conectan las implementaciones con los casos de uso. */
const tokenService = new JwtTokenService(env.jwtSecret, env.jwtExpiresIn);

const userRepository = new PrismaUserRepository(prisma);
const categoryRepository = new PrismaCategoryRepository(prisma);

export const container = {
  authenticate: createAuthenticate(tokenService),
  authController: new AuthController(
    new AuthUseCases(userRepository, new BcryptPasswordHasher(), tokenService),
  ),
  categoryController: new CategoryController(new CategoryUseCases(categoryRepository)),
};
