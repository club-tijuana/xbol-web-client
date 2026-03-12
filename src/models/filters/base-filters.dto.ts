export interface BaseFilters {
    page: number;
    pageSize: number;
    sortBy?: string;
    sortDesc?: string;
    textFilter?: string;
    rangeDateFrom?: string | null;
    rangeDateTo?: string | null;
}