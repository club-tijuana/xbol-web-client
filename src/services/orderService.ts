import { requestAxios } from "@/helpers/axiosHelper";
import { OrderDTO } from "@/models/order.dto";
import { store } from "@/store";

export async function getOrderSuccess(orderId: number): Promise<OrderDTO> {
    const state = store.getState();

    console.log(state.auth.user?.token);

    return requestAxios<null, OrderDTO>(
        "GET",
        `orders\\${orderId}`,
        undefined,
        state.auth.user?.token
    );
}