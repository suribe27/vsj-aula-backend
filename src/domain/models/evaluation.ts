import { Status, SupportFocus } from './shared';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface EvaluationAnswers {
  averageGrade: number;
  failedSubjects: number;
  sleepQuality: number;
  stressLevel: number;
  motivation: number;
  socialSupport: number;
}

export interface RiskResult {
  riskScore: number;
  riskLevel: RiskLevel;
  recommendedFocus: SupportFocus | null;
}

export interface Evaluation extends EvaluationAnswers, RiskResult {
  id: number;
  status: Status;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

/** Vista que recibe Bienestar: nunca incluye datos del estudiante. */
export type AnonymousEvaluation = Omit<Evaluation, 'userId'>;

export type SaveEvaluationData = EvaluationAnswers & RiskResult & { userId: number };

export type UpdateEvaluationData = EvaluationAnswers & RiskResult;

export interface EvaluationFilters {
  userId?: number;
  riskLevel?: RiskLevel;
}

export type RiskSummary = Record<RiskLevel, number>;
