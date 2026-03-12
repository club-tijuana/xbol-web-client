import { BaseFilters } from "./base-filters.dto";

export interface EventsFilters extends BaseFilters {
    eventCategoryId?: number;
}