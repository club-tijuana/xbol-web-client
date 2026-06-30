import { Order } from "./order";

export interface UpdateSessionRequest {
    sessionId?: string;
    order?: Order;
}