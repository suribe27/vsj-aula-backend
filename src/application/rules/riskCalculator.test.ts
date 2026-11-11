import { describe, expect, it } from 'vitest';
import { calculateRisk } from './riskCalculator';

const healthy = {
  averageGrade: 4.2,
  failedSubjects: 0,
  sleepQuality: 5,
  stressLevel: 1,
  motivation: 5,
  socialSupport: 5,
};

describe('calculateRisk', () => {
  it('da riesgo bajo y ninguna remisión a un estudiante sin alertas', () => {
    expect(calculateRisk(healthy)).toEqual({
      riskScore: 0,
      riskLevel: 'LOW',
      recommendedFocus: null,
    });
  });

  it('da riesgo crítico con enfoque emocional cuando todo el bienestar está en alerta', () => {
    const result = calculateRisk({
      ...healthy,
      averageGrade: 2.8,
      sleepQuality: 1,
      stressLevel: 5,
      motivation: 1,
      socialSupport: 1,
    });
    expect(result.riskLevel).toBe('CRITICAL');
    expect(result.recommendedFocus).toBe('EMOTIONAL');
  });

  it('recomienda apoyo académico cuando pesan más las notas', () => {
    const result = calculateRisk({
      ...healthy,
      averageGrade: 2.5,
      failedSubjects: 3,
      stressLevel: 3,
    });
    expect(result.riskLevel).toBe('HIGH');
    expect(result.recommendedFocus).toBe('ACADEMIC');
  });

  it('limita los puntos por materias perdidas', () => {
    const many = calculateRisk({ ...healthy, failedSubjects: 10 });
    const two = calculateRisk({ ...healthy, failedSubjects: 2 });
    expect(many.riskScore).toBe(two.riskScore);
  });
});
