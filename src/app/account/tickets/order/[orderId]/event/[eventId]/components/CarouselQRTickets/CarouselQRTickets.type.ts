import { MyTicketDto } from "@/models/my-ticket.dto";

export interface CarouselQRTicketsProps {
    tickets: MyTicketDto[];
    isTabActive: boolean;
    onShare: (ticketId: number) => void;
    onUnshare: (ticketId: number) => void;
}