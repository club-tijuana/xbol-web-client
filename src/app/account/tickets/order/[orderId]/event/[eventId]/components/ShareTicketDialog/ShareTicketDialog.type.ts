import { OrderType } from "@/models/enums/order-type.enum";

export interface ShareTicketDialogProps {
    ticketId: number;
    open: boolean;
    variant: "share" | "unshare";
    orderType: OrderType;
    onClose: (message?: string) => void;
}