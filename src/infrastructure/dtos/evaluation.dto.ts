import { z } from 'zod';
import { paginationQuerySchema } from './common.dto';

const scale = (label: string) =>
  z
    .number({ error: `${label} es obligatorio y debe ser un número` })
    .int(`${label} debe ser un entero`)
    .min(1, `${label} debe estar entre 1 y 5`)
    .max(5, `${label} debe estar entre 1 y 5`);

export const evaluationAnswersSchema = z.object({
  averageGrade: z
    .number({ error: 'El promedio es obligatorio y debe ser un número' })
    .min(0, 'El promedio debe estar entre 0 y 5')
    .max(5, 'El promedio debe estar entre 0 y 5'),
  failedSubjects: z
    .number({ error: 'Las materias perdidas son obligatorias' })
    .int('Las materias perdidas deben ser un entero')
    .min(0, 'Las materias perdidas no pueden ser negativas')
    .max(10, 'Las materias perdidas no pueden ser más de 10'),
  sleepQuality: scale('La calidad del sueño'),
  stressLevel: scale('El nivel de estrés'),
  motivation: scale('La motivación'),
  socialSupport: scale('El apoyo social'),
});

export const listEvaluationsQuerySchema = paginationQuerySchema.extend({
  riskLevel: z
    .enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], {
      error: 'riskLevel debe ser LOW, MEDIUM, HIGH o CRITICAL',
    })
    .optional(),
});

export type EvaluationAnswersDto = z.infer<typeof evaluationAnswersSchema>;
export type ListEvaluationsQuery = z.infer<typeof listEvaluationsQuerySchema>;
