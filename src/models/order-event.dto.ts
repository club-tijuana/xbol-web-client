import { EventCategory } from "./enums/event-category.enum";
import { MyEventSeatDTO } from "./my-event-seat.dto";

export interface OrderEventDTO {
    id: number;
    eventKey: string;
    posterImageUrl: string;
    name: string;
    startDate: Date;
    location: string;
    eventCategory: EventCategory;
    seats: MyEventSeatDTO[];
}