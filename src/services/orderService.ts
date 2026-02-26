import { requestAxios } from "@/helpers/axiosHelper";
import { OrderDTO } from "@/models/order.dto";

export async function getOrderSuccess(orderId: number): Promise<OrderDTO> {
    return requestAxios<null, OrderDTO>(
        "GET",
        `orders\\${orderId}`
    );
}