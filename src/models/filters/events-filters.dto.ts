import { PaginationFilters } from "./pagination-filters.dto";
import { TextFilter } from "./text-filter.dto";

export interface EventsFilters extends PaginationFilters, TextFilter {
    eventCategoryId?: number;
}