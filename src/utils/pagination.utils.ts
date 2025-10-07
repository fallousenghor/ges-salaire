import { PaginationParams, PaginatedResult } from "../type/pagination.types";

export const getPaginationParams = (query: any): PaginationParams => {
  const page = Math.max(1, parseInt(query.page as string) || 1);
  const limit = Math.max(1, Math.min(100, parseInt(query.limit as string) || 10));
  return { page, limit };
};

export const paginateResults = <T>(
  items: T[],
  total: number,
  { page = 1, limit = 10 }: PaginationParams
): PaginatedResult<T> => {
  const totalPages = Math.ceil(total / limit);
  const hasMore = page < totalPages;

  return {
    items,
    total,
    page,
    totalPages,
    hasMore,
  };
};