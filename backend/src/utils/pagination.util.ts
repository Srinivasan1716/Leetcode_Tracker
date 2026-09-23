// Pagination utility helpers

export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

// Parse and normalize pagination query params
export const parsePagination = (query: Record<string, unknown>): PaginationParams => {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));
  const offset = (page - 1) * limit;
  return { page, limit, offset };
};

// Compute total pages from count and limit
export const computeTotalPages = (total: number, limit: number): number => {
  return Math.ceil(total / Math.max(1, limit));
};

// Check if there is a next page
export const hasNextPage = (page: number, total: number, limit: number): boolean => {
  return page < computeTotalPages(total, limit);
};

// Build pagination metadata object for API response
export const buildPaginationMeta = (page: number, limit: number, total: number) => ({
  page,
  limit,
  total,
  totalPages: computeTotalPages(total, limit),
  hasNext: hasNextPage(page, total, limit),
  hasPrev: page > 1
});
