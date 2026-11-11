import {
  AnonymousEvaluation,
  Evaluation,
  EvaluationAnswers,
  RiskLevel,
  RiskSummary,
} from '../../domain/models/evaluation';
import { Service } from '../../domain/models/service';
import { PaginatedResult, PaginationParams } from '../../domain/models/shared';
import { AuthUser as Requester } from '../../domain/models/user';
import { EvaluationRepository } from '../../domain/repository/EvaluationRepository';
import { ServiceRepository } from '../../domain/repository/ServiceRepository';
import { ForbiddenError, NotFoundError } from '../errors/AppError';
import { calculateRisk } from '../rules/riskCalculator';

export interface EvaluationWithRecommendations {
  evaluation: AnonymousEvaluation;
  recommendedServices: Service[];
}

const RECOMMENDED_SERVICES_LIMIT = 3;

function anonymize(evaluation: Evaluation): AnonymousEvaluation {
  const { userId: _userId, ...rest } = evaluation;
  return rest;
}

export class EvaluationUseCases {
  constructor(
    private readonly evaluations: EvaluationRepository,
    private readonly services: ServiceRepository,
  ) {}

  /** Un estudiante ve solo las suyas; Bienestar ve todas, sin datos personales. */
  async list(
    requester: Requester,
    riskLevel: RiskLevel | undefined,
    params: PaginationParams,
  ): Promise<PaginatedResult<AnonymousEvaluation>> {
    const userId = requester.role === 'ADMIN' ? undefined : requester.id;
    const result = await this.evaluations.findAll({ userId, riskLevel }, params);
    return { data: result.data.map(anonymize), pagination: result.pagination };
  }

  async getById(id: number, requester: Requester): Promise<EvaluationWithRecommendations> {
    const evaluation = await this.findAccessible(id, requester);
    return this.withRecommendations(evaluation);
  }

  async create(
    answers: EvaluationAnswers,
    requester: Requester,
  ): Promise<EvaluationWithRecommendations> {
    const risk = calculateRisk(answers);
    const evaluation = await this.evaluations.create({ ...answers, ...risk, userId: requester.id });
    return this.withRecommendations(evaluation);
  }

  async update(
    id: number,
    answers: EvaluationAnswers,
    requester: Requester,
  ): Promise<EvaluationWithRecommendations> {
    const current = await this.findAccessible(id, requester);
    if (current.userId !== requester.id) {
      throw new ForbiddenError('Solo el estudiante que respondió puede editar su evaluación');
    }
    const risk = calculateRisk(answers);
    const updated = await this.evaluations.update(id, { ...answers, ...risk });
    return this.withRecommendations(updated);
  }

  async remove(id: number, requester: Requester): Promise<void> {
    await this.findAccessible(id, requester);
    await this.evaluations.deactivate(id);
  }

  summary(): Promise<RiskSummary> {
    return this.evaluations.countByRiskLevel();
  }

  private async findAccessible(id: number, requester: Requester): Promise<Evaluation> {
    const evaluation = await this.evaluations.findById(id);
    if (!evaluation) {
      throw new NotFoundError('Evaluación');
    }
    if (requester.role !== 'ADMIN' && evaluation.userId !== requester.id) {
      throw new NotFoundError('Evaluación');
    }
    return evaluation;
  }

  private async withRecommendations(
    evaluation: Evaluation,
  ): Promise<EvaluationWithRecommendations> {
    const recommendedServices = evaluation.recommendedFocus
      ? (
          await this.services.findAll(
            { focus: evaluation.recommendedFocus },
            { page: 1, limit: RECOMMENDED_SERVICES_LIMIT },
          )
        ).data
      : [];
    return { evaluation: anonymize(evaluation), recommendedServices };
  }
}
