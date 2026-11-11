import { EvaluationAnswers, RiskLevel, RiskResult } from '../../domain/models/evaluation';
import { SupportFocus } from '../../domain/models/shared';

const MAX_ACADEMIC_POINTS = 50;
const MAX_WELLBEING_POINTS = 50;
const SCALE_MAX = 5;
const SCALE_MIN = 1;

function academicPoints(answers: EvaluationAnswers): number {
  let points = 0;
  if (answers.averageGrade < 3.0) {
    points += 30;
  } else if (answers.averageGrade < 3.5) {
    points += 15;
  }
  points += Math.min(answers.failedSubjects * 10, 20);
  return Math.min(points, MAX_ACADEMIC_POINTS);
}

/**
 * Cada pregunta va de 1 a 5. En sueño, motivación y apoyo social un 5 es bueno;
 * en estrés un 5 es malo. Se convierte todo a "puntos de alerta" de 0 a 4.
 */
function wellbeingPoints(answers: EvaluationAnswers): number {
  const alerts =
    SCALE_MAX - answers.sleepQuality +
    (answers.stressLevel - SCALE_MIN) +
    (SCALE_MAX - answers.motivation) +
    (SCALE_MAX - answers.socialSupport);
  const maxAlerts = 4 * (SCALE_MAX - SCALE_MIN);
  return Math.round((alerts / maxAlerts) * MAX_WELLBEING_POINTS);
}

function levelFor(score: number): RiskLevel {
  if (score >= 75) return 'CRITICAL';
  if (score >= 50) return 'HIGH';
  if (score >= 25) return 'MEDIUM';
  return 'LOW';
}

export function calculateRisk(answers: EvaluationAnswers): RiskResult {
  const academic = academicPoints(answers);
  const wellbeing = wellbeingPoints(answers);
  const riskScore = academic + wellbeing;
  const riskLevel = levelFor(riskScore);

  const needsReferral = riskLevel === 'HIGH' || riskLevel === 'CRITICAL';
  const recommendedFocus: SupportFocus | null = needsReferral
    ? wellbeing >= academic
      ? 'EMOTIONAL'
      : 'ACADEMIC'
    : null;

  return { riskScore, riskLevel, recommendedFocus };
}
