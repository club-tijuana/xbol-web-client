import { MyEventDTO } from "@/models/my-event.dto";

export interface TicketListProps {
    listKey?: string;
    title: string;
    tickets?: MyEventDTO[] | null;
}