import { z } from 'zod';
import { paginationQuerySchema, searchSchema, supportFocusSchema } from './common.dto';

/** Los campos llegan como texto porque el formulario se envía como multipart/form-data. */
export const createServiceSchema = z.object({
  name: z
    .string({ error: 'El nombre es obligatorio' })
    .trim()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(120, 'El nombre no puede superar 120 caracteres'),
  description: z
    .string({ error: 'La descripción es obligatoria' })
    .trim()
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(1000, 'La descripción no puede superar 1000 caracteres'),
  location: z
    .string({ error: 'El lugar es obligatorio' })
    .trim()
    .min(3, 'El lugar debe tener al menos 3 caracteres')
    .max(150),
  schedule: z
    .string({ error: 'El horario es obligatorio' })
    .trim()
    .min(3, 'El horario debe tener al menos 3 caracteres')
    .max(150),
  contact: z
    .string()
    .trim()
    .max(150, 'El contacto no puede superar 150 caracteres')
    .transform((value) => value || null)
    .optional(),
  categoryId: z.coerce
    .number({ error: 'La categoría es obligatoria' })
    .int('La categoría no es válida')
    .positive('La categoría no es válida'),
});

export const updateServiceSchema = createServiceSchema.partial();

export const listServicesQuerySchema = paginationQuerySchema.extend({
  search: searchSchema,
  categoryId: z.coerce.number().int().positive('categoryId debe ser positivo').optional(),
  focus: supportFocusSchema.optional(),
});

export type CreateServiceDto = z.infer<typeof createServiceSchema>;
export type UpdateServiceDto = z.infer<typeof updateServiceSchema>;
export type ListServicesQuery = z.infer<typeof listServicesQuerySchema>;
