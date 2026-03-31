import { SeatDTO } from "./seat.dto";
import { SectionDTO } from "./section.dto";

export interface SeatAvailabilityDTO {
    sections: SectionDTO[];
    seatOverrides: SeatDTO[];
}