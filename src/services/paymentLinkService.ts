import { requestAxios } from "@/helpers/axiosHelper";
import { OrderDTO } from "@/models/order.dto";
import { PaymentInfoRequest } from "@/models/requests/payment-info-request.dto";
import { SeoMetadataDTO } from "@/models/seo-metadata";

const PATH: string = "payment-links";

export interface InitiatePaymentLinkCheckoutRequest {
    returnUrl: string;
    currency: string;
}

export interface InitiatePaymentLinkCheckoutResponse {
    sessionId: string;
    successIndicator: string;
    orderRefId: string;
    merchantId: string;
    apiVersion: string;
    gatewayBaseUrl: string;
    amount: string;
    currency: string;
}

export interface ConfirmPaymentLinkCheckoutRequest {
    orderRefId: string;
    resultIndicator: string;
    successIndicator: string;
}

export async function getOrderToPayAsync(code: string): Promise<OrderDTO> {
    return requestAxios<null, OrderDTO>(
        "GET",
        `${PATH}/${code}`
    );
}

export async function payOrderAsync(code: string, request: PaymentInfoRequest): Promise<number> {
    return requestAxios<PaymentInfoRequest, number>(
        "POST",
        `${PATH}/pay/${code}`,
        request
    );
}

export async function getEventMetadataByPaymentCodeAsync(code: string): Promise<SeoMetadataDTO> {
    return requestAxios<null, SeoMetadataDTO>(
        "GET",
        `${PATH}/metadata/${code}`
    );
}

export async function initiatePaymentLinkCheckoutAsync(
    code: string,
    request: InitiatePaymentLinkCheckoutRequest
): Promise<InitiatePaymentLinkCheckoutResponse> {
    return requestAxios<InitiatePaymentLinkCheckoutRequest, InitiatePaymentLinkCheckoutResponse>(
        "POST",
        `${PATH}/initiate-checkout/${code}`,
        request
    );
}

export async function confirmPaymentLinkCheckoutAsync(
    code: string,
    request: ConfirmPaymentLinkCheckoutRequest
): Promise<number> {
    return requestAxios<ConfirmPaymentLinkCheckoutRequest, number>(
        "POST",
        `${PATH}/confirm-checkout/${code}`,
        request
    );
}