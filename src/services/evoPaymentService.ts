import { requestAxios } from "@/helpers/axiosHelper";
import type {
  CheckoutSessionResponse,
  ConfirmCheckoutRequest,
  ConfirmCheckoutResponse,
  CreateCheckoutSessionRequest,
  InitiateCheckoutRequest,
  InitiateCheckoutResponse,
  RetrieveOrderResponse,
} from "@/types/hostedCheckout";

const PATH: string = "payments";

export async function createCheckoutSession(
  request: CreateCheckoutSessionRequest,
): Promise<CheckoutSessionResponse> {
  return requestAxios<CreateCheckoutSessionRequest, CheckoutSessionResponse>(
    "POST",
    `${PATH}/create-checkout-session`,
    request,
  );
}

export async function retrieveOrder(
  orderRefId: string,
): Promise<RetrieveOrderResponse> {
  return requestAxios<null, RetrieveOrderResponse>(
    "GET",
    `${PATH}/retrieve-order/${orderRefId}`,
  );
}

export async function initiateCheckout(
  request: InitiateCheckoutRequest,
): Promise<InitiateCheckoutResponse> {
  return requestAxios<InitiateCheckoutRequest, InitiateCheckoutResponse>(
    "POST",
    `${PATH}/initiate-checkout`,
    request,
  );
}

export async function confirmCheckout(
  request: ConfirmCheckoutRequest,
): Promise<ConfirmCheckoutResponse> {
  return requestAxios<ConfirmCheckoutRequest, ConfirmCheckoutResponse>(
    "POST",
    `${PATH}/confirm-checkout`,
    request,
  );
}
