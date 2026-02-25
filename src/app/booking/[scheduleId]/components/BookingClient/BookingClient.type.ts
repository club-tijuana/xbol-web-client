import { EventItemDTO } from "@/models/event-item.dto";

export interface BookingClientProps {
    scheduleId: string;
    event: EventItemDTO;
}