import { OrderType } from "../enums/order-type.enum";

import { BaseFilters } from "./base-filters.dto";

export interface TicketsFilters extends BaseFilters {
    orderType?: OrderType,
    orderId?: number,
    eventId?: number
}