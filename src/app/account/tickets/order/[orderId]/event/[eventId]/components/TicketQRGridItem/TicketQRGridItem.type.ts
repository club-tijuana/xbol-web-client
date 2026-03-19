import { OrderType } from "@/models/enums/order-type.enum";
import { MyTicketDto } from "@/models/my-ticket.dto";

export interface TicketQRGridItemProps {
    ticket: MyTicketDto;
    onShare: (ticketId: number, orderType: OrderType) => void;
    onUnshare: (ticketId: number, orderType: OrderType) => void;
}