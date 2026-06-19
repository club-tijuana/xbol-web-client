import { requestAxios } from "@/helpers/axiosHelper";
import { BundleToRenovateDTO } from "@/models/bundle-to-renovate.dto";
import { OrderDTO } from "@/models/order.dto";
import { SeoMetadataDTO } from "@/models/seo-metadata";
import { store } from "@/store";

export async function getOrderSuccess(orderId: number): Promise<OrderDTO> {
    const state = store.getState();

    return requestAxios<null, OrderDTO>(
        "GET",
        `orders/${orderId}`,
        undefined,
        state.auth.user?.token
    );
}

export async function getOrderToRenovate(orderId: number): Promise<BundleToRenovateDTO> {
    const state = store.getState();

    return requestAxios<null, BundleToRenovateDTO>(
        "GET",
        `orders/renovate/${orderId}`,
        undefined,
        state.auth.user?.token
    );
}

export async function getOrderMetadata(orderId: number): Promise<SeoMetadataDTO> {
    return requestAxios<null, SeoMetadataDTO>(
        "GET",
        `orders/${orderId}/metadata`
    );
}

export async function getRenovationMetadataAsync(orderId: number): Promise<SeoMetadataDTO> {
    return requestAxios<null, SeoMetadataDTO>(
        "GET",
        `orders/renovate/${orderId}/metadata`
    );
}