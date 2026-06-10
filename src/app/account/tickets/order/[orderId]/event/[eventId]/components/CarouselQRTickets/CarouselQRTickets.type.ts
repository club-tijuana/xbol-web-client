import { MyTicketDto } from "@/models/my-ticket.dto";

export interface CarouselQRTicketsProps {
    tickets: MyTicketDto[];
    isTabActive: boolean;
    canLoadMore?: boolean;

    onShare: (ticketId: number) => void;
    onUnshare: (ticketId: number) => void;
    onTicketsLoadMore: () => void;
}