import { MyTicketDto } from "@/models/my-ticket.dto";

export interface TicketCardProps {
    ticket: MyTicketDto;

    onOpen?: (ticketCode: string) => void;
    onSell?: (ticketCode: string) => void;
    onTransfer?: (ticketCode: string) => void;
}