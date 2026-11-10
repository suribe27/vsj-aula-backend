import { z } from 'zod';

export const idParamsSchema = z.object({
  id: z.coerce
    .number({ error: 'El id debe ser un número' })
    .int('El id debe ser un entero')
    .positive('El id debe ser positivo'),
});

export const paginationQuerySchema = z.object({
  page: z.coerce
    .number({ error: 'page debe ser un número' })
    .int('page debe ser un entero')
    .positive('page debe ser mayor que 0')
    .default(1),
  limit: z.coerce
    .number({ error: 'limit debe ser un número' })
    .int('limit debe ser un entero')
    .positive('limit debe ser mayor que 0')
    .max(50, 'limit no puede ser mayor que 50')
    .default(10),
});

export const supportFocusSchema = z.enum(['ACADEMIC', 'EMOTIONAL', 'FINANCIAL'], {
  error: 'El enfoque debe ser ACADEMIC, EMOTIONAL o FINANCIAL',
});

export const searchSchema = z.string().trim().min(1).max(100).optional();
