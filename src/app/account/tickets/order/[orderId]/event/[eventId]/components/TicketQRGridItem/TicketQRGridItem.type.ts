import { MyTicketDto } from "@/models/my-ticket.dto";

export interface TicketQRGridItemProps {
    ticket: MyTicketDto;
    onShare: (ticketId: number) => void;
    onUnshare: (ticketId: number) => void;
}