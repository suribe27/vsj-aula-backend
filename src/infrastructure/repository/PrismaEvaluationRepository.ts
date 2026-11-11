import { Evaluation as EvaluationRow, Prisma, PrismaClient } from '@prisma/client';
import {
  Evaluation,
  EvaluationFilters,
  RiskLevel,
  RiskSummary,
  SaveEvaluationData,
  UpdateEvaluationData,
} from '../../domain/models/evaluation';
import { buildPagination, PaginatedResult, PaginationParams } from '../../domain/models/shared';
import { EvaluationRepository } from '../../domain/repository/EvaluationRepository';

const RISK_LEVELS: RiskLevel[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

function toDomain(row: EvaluationRow): Evaluation {
  return { ...row, averageGrade: row.averageGrade.toNumber() };
}

export class PrismaEvaluationRepository implements EvaluationRepository {
  constructor(private readonly db: PrismaClient) {}

  async findAll(
    filters: EvaluationFilters,
    params: PaginationParams,
  ): Promise<PaginatedResult<Evaluation>> {
    const where: Prisma.EvaluationWhereInput = {
      status: 'ACTIVE',
      userId: filters.userId,
      riskLevel: filters.riskLevel,
    };
    const [total, rows] = await this.db.$transaction([
      this.db.evaluation.count({ where }),
      this.db.evaluation.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (params.page - 1) * params.limit,
        take: params.limit,
      }),
    ]);
    return { data: rows.map(toDomain), pagination: buildPagination(total, params) };
  }

  async findById(id: number): Promise<Evaluation | null> {
    const row = await this.db.evaluation.findFirst({ where: { id, status: 'ACTIVE' } });
    return row ? toDomain(row) : null;
  }

  async create(data: SaveEvaluationData): Promise<Evaluation> {
    return toDomain(await this.db.evaluation.create({ data }));
  }

  async update(id: number, data: UpdateEvaluationData): Promise<Evaluation> {
    return toDomain(await this.db.evaluation.update({ where: { id }, data }));
  }

  async deactivate(id: number): Promise<void> {
    await this.db.evaluation.update({ where: { id }, data: { status: 'INACTIVE' } });
  }

  async countByRiskLevel(): Promise<RiskSummary> {
    const groups = await this.db.evaluation.groupBy({
      by: ['riskLevel'],
      where: { status: 'ACTIVE' },
      _count: { _all: true },
    });
    const summary = Object.fromEntries(RISK_LEVELS.map((level) => [level, 0])) as RiskSummary;
    for (const group of groups) {
      summary[group.riskLevel] = group._count._all;
    }
    return summary;
  }
}
