import { requestAxios } from "@/helpers/axiosHelper";
import { OrderDTO } from "@/models/order.dto";
import { PaymentInfoRequest } from "@/models/requests/payment-info-request.dto";
import { SeoMetadataDTO } from "@/models/seo-metadata";

const PATH: string = "payment-links";

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