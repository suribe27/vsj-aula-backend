import {
  Category,
  CategoryFilters,
  CreateCategoryData,
  UpdateCategoryData,
} from '../models/category';
import { PaginatedResult, PaginationParams } from '../models/shared';

export interface CategoryRepository {
  findAll(filters: CategoryFilters, params: PaginationParams): Promise<PaginatedResult<Category>>;
  findById(id: number): Promise<Category | null>;
  findByName(name: string): Promise<Category | null>;
  create(data: CreateCategoryData): Promise<Category>;
  update(id: number, data: UpdateCategoryData): Promise<Category>;
  deactivate(id: number): Promise<void>;
  countActiveServices(id: number): Promise<number>;
}
