import { MyTicketDto } from "@/models/my-ticket.dto";

export interface TicketTabsProps {
    myTickets: MyTicketDto[] | null;
    seasonTickets: MyTicketDto[] | null;
}