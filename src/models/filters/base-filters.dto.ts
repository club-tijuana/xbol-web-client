export interface BaseFilters {
    page: number;
    pageSize: number;
    sortBy?: string;
    sortDesc?: string;
    textFilter?: string;
}