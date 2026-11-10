import {
  CreateServiceData,
  Service,
  ServiceFilters,
  UpdateServiceData,
} from '../../domain/models/service';
import { PaginatedResult, PaginationParams } from '../../domain/models/shared';
import { CategoryRepository } from '../../domain/repository/CategoryRepository';
import { ServiceRepository } from '../../domain/repository/ServiceRepository';
import { NotFoundError, ValidationError } from '../errors/AppError';
import { ImageFile, ImageStorage } from '../ports/ImageStorage';

const IMAGE_FOLDER = 'services';

export class ServiceUseCases {
  constructor(
    private readonly services: ServiceRepository,
    private readonly categories: CategoryRepository,
    private readonly storage: ImageStorage,
  ) {}

  list(filters: ServiceFilters, params: PaginationParams): Promise<PaginatedResult<Service>> {
    return this.services.findAll(filters, params);
  }

  async getById(id: number): Promise<Service> {
    const service = await this.services.findById(id);
    if (!service) {
      throw new NotFoundError('Servicio');
    }
    return service;
  }

  async create(data: CreateServiceData, image?: ImageFile): Promise<Service> {
    await this.ensureActiveCategory(data.categoryId);
    const imageUrl = image ? await this.storage.upload(image, IMAGE_FOLDER) : null;
    return this.services.create({ ...data, imageUrl });
  }

  async update(id: number, data: UpdateServiceData, image?: ImageFile): Promise<Service> {
    await this.getById(id);
    if (data.categoryId !== undefined) {
      await this.ensureActiveCategory(data.categoryId);
    }
    const changes: UpdateServiceData = { ...data };
    if (image) {
      changes.imageUrl = await this.storage.upload(image, IMAGE_FOLDER);
    }
    return this.services.update(id, changes);
  }

  async remove(id: number): Promise<void> {
    await this.getById(id);
    await this.services.deactivate(id);
  }

  private async ensureActiveCategory(categoryId: number): Promise<void> {
    const category = await this.categories.findById(categoryId);
    if (!category) {
      throw new ValidationError('La categoría indicada no existe o está inactiva', {
        categoryId: ['Categoría inválida'],
      });
    }
  }
}
