import { EventScheduleSectionPricesDTO } from "./event-schedule-section-prices.dto";

export interface EventScheduleDTO {
    id: number;
    date: Date;
    location: string;
    sectionPrices: Array<EventScheduleSectionPricesDTO>;
}