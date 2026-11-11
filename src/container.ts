import { AuthUseCases } from './application/use-cases/AuthUseCases';
import { CategoryUseCases } from './application/use-cases/CategoryUseCases';
import { EvaluationUseCases } from './application/use-cases/EvaluationUseCases';
import { ServiceUseCases } from './application/use-cases/ServiceUseCases';
import { env } from './infrastructure/config/env';
import { prisma } from './infrastructure/database/prisma';
import { PrismaCategoryRepository } from './infrastructure/repository/PrismaCategoryRepository';
import { PrismaEvaluationRepository } from './infrastructure/repository/PrismaEvaluationRepository';
import { PrismaServiceRepository } from './infrastructure/repository/PrismaServiceRepository';
import { PrismaUserRepository } from './infrastructure/repository/PrismaUserRepository';
import { BcryptPasswordHasher } from './infrastructure/services/BcryptPasswordHasher';
import { JwtTokenService } from './infrastructure/services/JwtTokenService';
import { SupabaseImageStorage } from './infrastructure/services/SupabaseImageStorage';
import { AuthController } from './interface/controllers/AuthController';
import { CategoryController } from './interface/controllers/CategoryController';
import { EvaluationController } from './interface/controllers/EvaluationController';
import { ServiceController } from './interface/controllers/ServiceController';
import { createAuthenticate } from './interface/middlewares/authenticate';

/** Punto de composición: aquí se conectan las implementaciones con los casos de uso. */
const tokenService = new JwtTokenService(env.jwtSecret, env.jwtExpiresIn);
const imageStorage = new SupabaseImageStorage(
  env.supabase.url,
  env.supabase.serviceRoleKey,
  env.supabase.bucket,
);

const userRepository = new PrismaUserRepository(prisma);
const categoryRepository = new PrismaCategoryRepository(prisma);
const serviceRepository = new PrismaServiceRepository(prisma);
const evaluationRepository = new PrismaEvaluationRepository(prisma);

export const container = {
  authenticate: createAuthenticate(tokenService),
  authController: new AuthController(
    new AuthUseCases(userRepository, new BcryptPasswordHasher(), tokenService),
  ),
  categoryController: new CategoryController(new CategoryUseCases(categoryRepository)),
  serviceController: new ServiceController(
    new ServiceUseCases(serviceRepository, categoryRepository, imageStorage),
  ),
  evaluationController: new EvaluationController(
    new EvaluationUseCases(evaluationRepository, serviceRepository),
  ),
};
