export interface ReservationFilters {
    seasonId?: number;
    scheduleId?: number;
    sectionId?: number;
    zoneId?: number;
    priceRange?: PriceRange;
}

export interface PriceRange {
    min?: number;
    max?: number;
}