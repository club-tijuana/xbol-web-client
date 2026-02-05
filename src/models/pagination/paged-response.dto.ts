export interface PagedResponse<T> {
    items: readonly T[];
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
}