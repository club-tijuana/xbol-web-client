export interface CreateCheckoutSessionRequest {
  returnUrl: string;
  amount: number;
  currency?: string;
  description?: string;
}

export interface CheckoutSessionResponse {
  merchantId: string;
  sessionId: string;
  successIndicator: string;
  apiVersion: string;
  gatewayBaseUrl: string;
  orderRefId: string;
  amount: string;
  currency: string;
}

export interface RetrieveOrderResponse {
  orderRefId: string;
  result: string;
  status?: string;
  gatewayCode?: string;
  totalCapturedAmount?: number;
  totalAuthorizedAmount?: number;
  currency?: string;
  cardNumberMasked?: string;
  cardBrand?: string;
}

export interface InitiateCheckoutRequest {
  eventScheduleId?: number;
  bundleId?: number;
  relatedOrderId?: number;
  holdToken: string | null;
  seats: { seatKey: string; priceListItemId: number }[];
  clientContact: {
    email: string;
    fullName: string;
    phoneNumber: string;
    phoneRegionCodeId?: number;
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
