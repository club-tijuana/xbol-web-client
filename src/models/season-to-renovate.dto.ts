import { MyEventSeatDTO } from "./my-event-seat.dto";

export interface SeasonToRenovateDTO {
    relatedOrderId: number;
    previousSeasonId: number;
    seasonId: number;
    previousSeats: Array<MyEventSeatDTO>;
}