import { Prisma, PrismaClient } from '@prisma/client';
import {
  Category,
  CategoryFilters,
  CreateCategoryData,
  UpdateCategoryData,
} from '../../domain/models/category';
import { buildPagination, PaginatedResult, PaginationParams } from '../../domain/models/shared';
import { CategoryRepository } from '../../domain/repository/CategoryRepository';

export class PrismaCategoryRepository implements CategoryRepository {
  constructor(private readonly db: PrismaClient) {}

  async findAll(
    filters: CategoryFilters,
    params: PaginationParams,
  ): Promise<PaginatedResult<Category>> {
    const where: Prisma.CategoryWhereInput = {
      status: 'ACTIVE',
      focus: filters.focus,
      name: filters.search ? { contains: filters.search, mode: 'insensitive' } : undefined,
    };
    const [total, data] = await this.db.$transaction([
      this.db.category.count({ where }),
      this.db.category.findMany({
        where,
        orderBy: { name: 'asc' },
        skip: (params.page - 1) * params.limit,
        take: params.limit,
      }),
    ]);
    return { data, pagination: buildPagination(total, params) };
  }

  findById(id: number): Promise<Category | null> {
    return this.db.category.findFirst({ where: { id, status: 'ACTIVE' } });
  }

  findByName(name: string): Promise<Category | null> {
    return this.db.category.findFirst({
      where: { name: { equals: name, mode: 'insensitive' } },
    });
  }

  create(data: CreateCategoryData): Promise<Category> {
    return this.db.category.create({ data });
  }

  update(id: number, data: UpdateCategoryData): Promise<Category> {
    return this.db.category.update({ where: { id }, data });
  }

  async deactivate(id: number): Promise<void> {
    await this.db.category.update({ where: { id }, data: { status: 'INACTIVE' } });
  }

  countActiveServices(id: number): Promise<number> {
    return this.db.service.count({ where: { categoryId: id, status: 'ACTIVE' } });
  }
}
