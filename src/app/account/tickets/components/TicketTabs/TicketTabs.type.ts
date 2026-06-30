import { MyEventDTO } from "@/models/my-event.dto";

export interface TicketTabsProps {
    myEvents?: MyEventDTO[] | null;
    mySeasons?: MyEventDTO[] | null;
    eventsLoaded?: boolean;
    seasonsLoaded?: boolean;
    eventsError?: string | null;
    seasonsError?: string | null;

    onEventLoadMore?: () => void;
    onSeasonLoadMore?: () => void;
}
