import { MyEventDTO } from "@/models/my-event.dto";

export interface TicketTabsProps {
    myEvents?: MyEventDTO[] | null;
    mySeasons?: MyEventDTO[] | null;

    onEventLoadMore?: () => void;
    onSeasonLoadMore?: () => void;
}