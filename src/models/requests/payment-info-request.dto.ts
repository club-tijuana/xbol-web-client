export interface PaymentInfoRequest {
    isCourtesy?: boolean;
    cardAmount?: number;
    cashAmount?: number;
    dolarAmount?: number;
    exchangeRate?: number;
    creditAmount?: number;
    otherAmount?: number;
}