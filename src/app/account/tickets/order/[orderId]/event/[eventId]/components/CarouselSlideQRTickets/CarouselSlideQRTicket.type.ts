import { MyTicketDto } from "@/models/my-ticket.dto";

export interface CarouselSlideQRTicketProps {
    ticket: MyTicketDto;
    isActive: boolean;
    onShare: (ticketId: number) => void;
    onUnshare: (ticketId: number) => void;
}