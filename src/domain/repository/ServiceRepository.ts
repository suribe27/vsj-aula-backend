import {
  CreateServiceData,
  Service,
  ServiceFilters,
  UpdateServiceData,
} from '../models/service';
import { PaginatedResult, PaginationParams } from '../models/shared';

export interface ServiceRepository {
  findAll(filters: ServiceFilters, params: PaginationParams): Promise<PaginatedResult<Service>>;
  findById(id: number): Promise<Service | null>;
  create(data: CreateServiceData): Promise<Service>;
  update(id: number, data: UpdateServiceData): Promise<Service>;
  deactivate(id: number): Promise<void>;
}
