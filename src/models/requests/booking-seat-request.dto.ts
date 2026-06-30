import { FeeItemDTO } from "../fee-item.dto";

export interface BookingSeatRequest {
    seatKey: string;
    seatPrice: number;
    priceListItemId: number;
    fees?: Array<FeeItemDTO>;
}