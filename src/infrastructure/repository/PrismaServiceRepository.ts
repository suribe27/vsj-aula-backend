import { Prisma, PrismaClient } from '@prisma/client';
import {
  CreateServiceData,
  Service,
  ServiceFilters,
  UpdateServiceData,
} from '../../domain/models/service';
import { buildPagination, PaginatedResult, PaginationParams } from '../../domain/models/shared';
import { ServiceRepository } from '../../domain/repository/ServiceRepository';

const withCategory = {
  category: { select: { id: true, name: true, focus: true } },
} as const;

export class PrismaServiceRepository implements ServiceRepository {
  constructor(private readonly db: PrismaClient) {}

  async findAll(
    filters: ServiceFilters,
    params: PaginationParams,
  ): Promise<PaginatedResult<Service>> {
    const where: Prisma.ServiceWhereInput = {
      status: 'ACTIVE',
      categoryId: filters.categoryId,
      category: { status: 'ACTIVE', focus: filters.focus },
      OR: filters.search
        ? [
            { name: { contains: filters.search, mode: 'insensitive' } },
            { description: { contains: filters.search, mode: 'insensitive' } },
          ]
        : undefined,
    };
    const [total, data] = await this.db.$transaction([
      this.db.service.count({ where }),
      this.db.service.findMany({
        where,
        include: withCategory,
        orderBy: { createdAt: 'desc' },
        skip: (params.page - 1) * params.limit,
        take: params.limit,
      }),
    ]);
    return { data, pagination: buildPagination(total, params) };
  }

  findById(id: number): Promise<Service | null> {
    return this.db.service.findFirst({ where: { id, status: 'ACTIVE' }, include: withCategory });
  }

  create(data: CreateServiceData): Promise<Service> {
    return this.db.service.create({ data, include: withCategory });
  }

  update(id: number, data: UpdateServiceData): Promise<Service> {
    return this.db.service.update({ where: { id }, data, include: withCategory });
  }

  async deactivate(id: number): Promise<void> {
    await this.db.service.update({ where: { id }, data: { status: 'INACTIVE' } });
  }
}
