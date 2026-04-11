import { DateRangeFilter } from "./date-range-filter.dto";
import { PaginationFilters } from "./pagination-filters.dto";
import { TextFilter } from "./text-filter.dto";

export interface SearchEventsFilters extends PaginationFilters, DateRangeFilter, TextFilter {
    eventCategoryIds?: number[];
    performerId?: number;
    trendingEvents?: boolean;
}