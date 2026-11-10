import { z } from 'zod';
import { ValidationError } from '../../application/errors/AppError';

/** Valida datos de la petición con un esquema de Zod y lanza 400 con el detalle por campo. */
export function parse<T extends z.ZodType>(schema: T, data: unknown): z.infer<T> {
  const result = schema.safeParse(data);
  if (!result.success) {
    const details: Record<string, string[]> = {};
    for (const issue of result.error.issues) {
      const field = issue.path.join('.') || 'body';
      details[field] = [...(details[field] ?? []), issue.message];
    }
    const firstMessage = result.error.issues[0]?.message ?? 'Datos inválidos';
    throw new ValidationError(firstMessage, details);
  }
  return result.data;
}
