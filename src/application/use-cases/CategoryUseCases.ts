import {
  Category,
  CategoryFilters,
  CreateCategoryData,
  UpdateCategoryData,
} from '../../domain/models/category';
import { PaginatedResult, PaginationParams } from '../../domain/models/shared';
import { CategoryRepository } from '../../domain/repository/CategoryRepository';
import { ConflictError, NotFoundError } from '../errors/AppError';

export class CategoryUseCases {
  constructor(private readonly categories: CategoryRepository) {}

  list(filters: CategoryFilters, params: PaginationParams): Promise<PaginatedResult<Category>> {
    return this.categories.findAll(filters, params);
  }

  async getById(id: number): Promise<Category> {
    const category = await this.categories.findById(id);
    if (!category) {
      throw new NotFoundError('Categoría');
    }
    return category;
  }

  async create(data: CreateCategoryData): Promise<Category> {
    await this.ensureNameIsFree(data.name);
    return this.categories.create(data);
  }

  async update(id: number, data: UpdateCategoryData): Promise<Category> {
    await this.getById(id);
    if (data.name) {
      await this.ensureNameIsFree(data.name, id);
    }
    return this.categories.update(id, data);
  }

  async remove(id: number): Promise<void> {
    await this.getById(id);
    const activeServices = await this.categories.countActiveServices(id);
    if (activeServices > 0) {
      throw new ConflictError(
        `No se puede eliminar: la categoría tiene ${activeServices} servicio(s) activo(s)`,
      );
    }
    await this.categories.deactivate(id);
  }

  private async ensureNameIsFree(name: string, currentId?: number): Promise<void> {
    const existing = await this.categories.findByName(name);
    if (existing && existing.id !== currentId) {
      throw new ConflictError('Ya existe una categoría con ese nombre');
    }
  }
}
