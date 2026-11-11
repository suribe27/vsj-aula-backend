import {
  Evaluation,
  EvaluationFilters,
  RiskSummary,
  SaveEvaluationData,
  UpdateEvaluationData,
} from '../models/evaluation';
import { PaginatedResult, PaginationParams } from '../models/shared';

export interface EvaluationRepository {
  findAll(
    filters: EvaluationFilters,
    params: PaginationParams,
  ): Promise<PaginatedResult<Evaluation>>;
  findById(id: number): Promise<Evaluation | null>;
  create(data: SaveEvaluationData): Promise<Evaluation>;
  update(id: number, data: UpdateEvaluationData): Promise<Evaluation>;
  deactivate(id: number): Promise<void>;
  countByRiskLevel(): Promise<RiskSummary>;
}
