import { Request, Response } from 'express';
import { CategoryUseCases } from '../../application/use-cases/CategoryUseCases';
import {
  createCategorySchema,
  listCategoriesQuerySchema,
  updateCategorySchema,
} from '../../infrastructure/dtos/category.dto';
import { idParamsSchema } from '../../infrastructure/dtos/common.dto';
import { parse } from '../http/validation';

export class CategoryController {
  constructor(private readonly categories: CategoryUseCases) {}

  list = async (req: Request, res: Response): Promise<void> => {
    const { page, limit, ...filters } = parse(listCategoriesQuerySchema, req.query);
    res.status(200).json(await this.categories.list(filters, { page, limit }));
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    const { id } = parse(idParamsSchema, req.params);
    res.status(200).json({ data: await this.categories.getById(id) });
  };

  create = async (req: Request, res: Response): Promise<void> => {
    const input = parse(createCategorySchema, req.body);
    res.status(201).json({ data: await this.categories.create(input) });
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const { id } = parse(idParamsSchema, req.params);
    const input = parse(updateCategorySchema, req.body);
    res.status(200).json({ data: await this.categories.update(id, input) });
  };

  remove = async (req: Request, res: Response): Promise<void> => {
    const { id } = parse(idParamsSchema, req.params);
    await this.categories.remove(id);
    res.status(204).send();
  };
}
