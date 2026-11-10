import { AuthUseCases } from './application/use-cases/AuthUseCases';
import { env } from './infrastructure/config/env';
import { prisma } from './infrastructure/database/prisma';
import { PrismaUserRepository } from './infrastructure/repository/PrismaUserRepository';
import { BcryptPasswordHasher } from './infrastructure/services/BcryptPasswordHasher';
import { JwtTokenService } from './infrastructure/services/JwtTokenService';
import { AuthController } from './interface/controllers/AuthController';
import { createAuthenticate } from './interface/middlewares/authenticate';

/** Punto de composición: aquí se conectan las implementaciones con los casos de uso. */
const tokenService = new JwtTokenService(env.jwtSecret, env.jwtExpiresIn);

const userRepository = new PrismaUserRepository(prisma);

export const container = {
  authenticate: createAuthenticate(tokenService),
  authController: new AuthController(
    new AuthUseCases(userRepository, new BcryptPasswordHasher(), tokenService),
  ),
};
