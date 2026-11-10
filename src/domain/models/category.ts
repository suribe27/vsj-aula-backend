import { Status, SupportFocus } from './shared';

export interface Category {
  id: number;
  name: string;
  description: string;
  focus: SupportFocus;
  status: Status;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCategoryData {
  name: string;
  description: string;
  focus: SupportFocus;
}

export type UpdateCategoryData = Partial<CreateCategoryData>;

export interface CategoryFilters {
  search?: string;
  focus?: SupportFocus;
}
