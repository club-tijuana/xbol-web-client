import { Error } from "./error";
import { Order } from "./order";
import { Session } from "./session";

export interface SessionResponse {
    merchant: string;
    result: string;
    session: Session;
    error: Error;
    order: Order;
    orderRefId: string;
    transactionRefId: string;
}