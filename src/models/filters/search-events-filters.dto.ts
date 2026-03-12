import { BaseFilters } from "./base-filters.dto";

export interface SearchEventsFilters extends BaseFilters {
    eventCategoryIds?: number[];
    performerId?: number;
    trendingEvents?: boolean;
}