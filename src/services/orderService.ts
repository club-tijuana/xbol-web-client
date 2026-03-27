import { requestAxios } from "@/helpers/axiosHelper";
import { OrderDTO } from "@/models/order.dto";
import { SeasonToRenovateDTO } from "@/models/season-to-renovate.dto";
import { store } from "@/store";

export async function getOrderSuccess(orderId: number): Promise<OrderDTO> {
    const state = store.getState();

    return requestAxios<null, OrderDTO>(
        "GET",
        `orders\\${orderId}`,
        undefined,
        state.auth.user?.token
    );
}

export async function getOrderToRenovate(orderId: number): Promise<SeasonToRenovateDTO> {
    const state = store.getState();

    return requestAxios<null, SeasonToRenovateDTO>(
        "GET",
        `orders\\renovate\\${orderId}`,
        undefined,
        state.auth.user?.token
    );
}