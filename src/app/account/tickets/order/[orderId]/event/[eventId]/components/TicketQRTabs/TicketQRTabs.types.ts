import { MyTicketDto } from "@/models/my-ticket.dto";

export interface TicketQRTabsProps {
    tickets: MyTicketDto[];
    canLoadMore?: boolean;

    onLoadAll?: () => void;
    onLoadMore?: () => void;
}