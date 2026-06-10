import { formatDate } from "@/helpers/formatDateHelper";

import { EventItemDTO, getEventPosterImageUrl } from "./event-item.dto";
import { EventCardVM } from "./views/event-card.vm";

export interface ScheduleItemDTO {
    id: number;
    event: EventItemDTO;
    startDate: Date;
}

export const mapScheduleToCardVM = (s: ScheduleItemDTO): EventCardVM => ({
    eventId: s.event.id,
    scheduleId: s.id,
    posterImageUrl: getEventPosterImageUrl(s.event),
    name: s.event.name,
    startDate: formatDate(s.startDate, "dateTime"),
    location: s.event.location,
    categories: s.event.categories,
    isFavorite: s.event.isFavorite
});
