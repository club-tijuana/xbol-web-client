import { MyEventSeatDTO } from "./my-event-seat.dto";
import { SeatDTO } from "./seat.dto";

export interface SeasonToRenovateDTO {
    relatedOrderId: number;
    previousSeasonId: number;
    seasonId: number;
    previousSeats: Array<MyEventSeatDTO>;
    previousSeatPrices?: Array<SeatDTO>;
}