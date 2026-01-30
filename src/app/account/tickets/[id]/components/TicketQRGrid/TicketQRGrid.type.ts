import { MyTicketDto } from "@/models/my-ticket.dto";

export interface TicketQRGridProps {
    columnsXs?: number;
    columnsSm?: number;
    columnsMd?: number;
    columnsLg?: number;
    columnsXl?: number;
    spacing?: number;

    title?: string;
    tickets: MyTicketDto[];
}