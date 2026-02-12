import { ResponsiveStyleValue } from "@mui/system";

import { MyTicketDto } from "@/models/my-ticket.dto";

export interface TicketQRGridProps {
    columns: ResponsiveStyleValue<number>;
    spacing?: number;

    title?: string;
    tickets: MyTicketDto[];
}