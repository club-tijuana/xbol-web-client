import { PriceRange } from "@/models/filters/reservation-filters.dto";

export interface PriceRangeFilterProps {
    value?: PriceRange;
    onChange: (value: PriceRange) => void;
}