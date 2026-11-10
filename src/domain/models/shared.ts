export type Status = 'ACTIVE' | 'INACTIVE';

export type SupportFocus = 'ACADEMIC' | 'EMOTIONAL' | 'FINANCIAL';

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface Pagination {
  total: number;
  currentPage: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: Pagination;
}

export function buildPagination(total: number, params: PaginationParams): Pagination {
  return {
    total,
    currentPage: params.page,
    limit: params.limit,
    totalPages: Math.max(1, Math.ceil(total / params.limit)),
  };
}
