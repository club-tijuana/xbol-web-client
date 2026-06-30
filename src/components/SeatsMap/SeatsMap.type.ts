import { CategoryFilter, Pricing } from "@seatsio/seatsio-react";

import { BookingSeatRequest } from "@/models/requests/booking-seat-request.dto";
import { BookingStep } from "@/types/bookingStep";

export interface SeatsMapProps {
  eventKey: string;
  pricing?: Pricing;
  initialSeats?: Array<BookingSeatRequest>;
  selectedZone?: string;
  mode?: "normal" | "print";
  categoryFilter?: CategoryFilter;
  channels?: string[];
  blockSameSeats?: boolean;
  bookingStep?: BookingStep;
  isRenewalWindow?: boolean;

  onSeatsChange?: () => void;
}
