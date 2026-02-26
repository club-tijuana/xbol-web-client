import { OrderType } from "./enums/order-type.enum";
import { OrderEventDTO } from "./order-event.dto";

export interface OrderDTO {
    id: number;
    folio: string;
    orderType: OrderType;
    subTotal: number;
    totalFees: number;
    totalTaxes: number;
    total: number;
    currency: string;
    events: OrderEventDTO[];
}