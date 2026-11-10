import { Status, SupportFocus } from './shared';

export interface ServiceCategorySummary {
  id: number;
  name: string;
  focus: SupportFocus;
}

export interface Service {
  id: number;
  name: string;
  description: string;
  location: string;
  schedule: string;
  contact: string | null;
  imageUrl: string | null;
  status: Status;
  categoryId: number;
  category: ServiceCategorySummary;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateServiceData {
  name: string;
  description: string;
  location: string;
  schedule: string;
  contact?: string | null;
  imageUrl?: string | null;
  categoryId: number;
}

export type UpdateServiceData = Partial<CreateServiceData>;

export interface ServiceFilters {
  search?: string;
  categoryId?: number;
  focus?: SupportFocus;
}
