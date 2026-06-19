import { MyEventSeatDTO } from "./my-event-seat.dto";
import { SeatDTO } from "./seat.dto";

export interface BundleToRenovateDTO {
    relatedOrderId: number;
    previousBundleId: number;
    bundleId: number;
    bundleKey: string;
    previousSeats: Array<MyEventSeatDTO>;
    previousSeatPrices?: Array<SeatDTO>;
}