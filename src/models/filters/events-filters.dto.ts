import { BaseFilters } from "./base-filters.dto";

export interface EventsFilters extends BaseFilters {
    eventCategoryIds?: number[];
    performerId?: number;
}