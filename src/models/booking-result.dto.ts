export interface BookingResult {
    bookingId?: number;
    orderId?: number;
    message: string;
    tickets: string[];
    clientPhone?: string;
    clientEmail?: string;
    localizer: string;
}