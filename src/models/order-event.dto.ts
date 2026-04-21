import { EventCategoryDTO } from "./event-category.dto";
import { MyEventSeatDTO } from "./my-event-seat.dto";

export interface OrderEventDTO {
    id: number;
    eventKey: string;
    posterImageUrl: string;
    name: string;
    startDate: Date;
    location: string;
    seats: MyEventSeatDTO[];
    eventCategories?: EventCategoryDTO[];
}