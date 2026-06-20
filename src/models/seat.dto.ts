import { FeeItemDTO } from "./fee-item.dto";

export interface SeatDTO {
    id: number;
    externalSeatObjectKey: string;
    priceOverride?: number;
    priceListItemId?: number;
    fees?: Array<FeeItemDTO>;
}