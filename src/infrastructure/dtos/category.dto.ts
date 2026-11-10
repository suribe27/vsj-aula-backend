import { z } from 'zod';
import { paginationQuerySchema, searchSchema, supportFocusSchema } from './common.dto';

export const createCategorySchema = z.object({
  name: z
    .string({ error: 'El nombre es obligatorio' })
    .trim()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(80, 'El nombre no puede superar 80 caracteres'),
  description: z
    .string({ error: 'La descripción es obligatoria' })
    .trim()
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(300, 'La descripción no puede superar 300 caracteres'),
  focus: supportFocusSchema,
});

export const updateCategorySchema = createCategorySchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, 'Envía al menos un campo para actualizar');

export const listCategoriesQuerySchema = paginationQuerySchema.extend({
  search: searchSchema,
  focus: supportFocusSchema.optional(),
});

export type CreateCategoryDto = z.infer<typeof createCategorySchema>;
export type UpdateCategoryDto = z.infer<typeof updateCategorySchema>;
export type ListCategoriesQuery = z.infer<typeof listCategoriesQuerySchema>;
