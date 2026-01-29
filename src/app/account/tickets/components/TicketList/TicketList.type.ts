import { MyTicketDto } from "@/models/my-ticket.dto";

export interface TicketListProps {
    title: string;
    tickets: MyTicketDto[] | null;
}