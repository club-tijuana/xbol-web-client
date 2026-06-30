import { FeeItemDTO } from "./fee-item.dto";
import { MyEventSeatDTO } from "./my-event-seat.dto";

export interface MyEventDetailDTO {
  orderId: number;
  eventId: number;
  eventKey: string;
  eventImage: string;
  folio: string;
  name: string;
  date: Date;
  location: string;
  subTotal: number;
  totalFees: number;
  totalTaxes: number;
  total: number;
  currency: string;
  seats: Array<MyEventSeatDTO>;
  selectedSeats: Array<string>;
  fees: Array<FeeItemDTO>;
}
