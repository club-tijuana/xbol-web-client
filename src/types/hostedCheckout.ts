export interface InitiateCheckoutRequest {
  eventScheduleId: number;
  holdToken: string | null;
  seats: { seatKey: string; priceListItemId: number }[];
  clientContact: {
    email: string;
    fullName: string;
    phoneNumber: string;
  };
  returnUrl: string;
  currency: string;
}

export interface InitiateCheckoutResponse {
  localOrderId: number;
  sessionId: string;
  successIndicator: string;
  orderRefId: string;
  amount: string;
  currency: string;
  merchantId: string;
  apiVersion: string;
  gatewayBaseUrl: string;
}

export interface ConfirmCheckoutRequest {
  localOrderId: number;
  orderRefId: string;
  resultIndicator: string | null;
}

export interface ConfirmCheckoutResponse {
  orderId: number;
  orderStatus: string;
  paymentStatus: string;
  ticketsIssued: number;
  reference: string | null;
}
