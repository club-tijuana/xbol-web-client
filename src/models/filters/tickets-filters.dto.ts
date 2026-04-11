import { OrderType } from "../enums/order-type.enum";

import { PaginationFilters } from "./pagination-filters.dto";

export interface TicketsFilters extends PaginationFilters {
    orderType?: OrderType,
    orderId?: number,
    eventId?: number
}