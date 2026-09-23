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
