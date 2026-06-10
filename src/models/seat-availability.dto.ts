import { SeatDTO } from "./seat.dto";
import { ZoneDTO } from "./zone.dto";

export interface SeatAvailabilityDTO {
    zones: ZoneDTO[];
    seatOverrides: SeatDTO[];
}