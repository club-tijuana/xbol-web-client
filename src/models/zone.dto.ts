import { FeeItemDTO } from "./fee-item.dto";

export interface ZoneDTO {
    id: number;
    name: string;
    displayName: string;
    price?: number;
    priceListItemId?: number;
    fees?: Array<FeeItemDTO>;
}