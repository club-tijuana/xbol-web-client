import { EventCategory } from "../enums/event-category.enum";

import { BaseFilters } from "./base-filters.dto";

export interface EventsFilters extends BaseFilters {
    eventCategory: EventCategory | null;
}