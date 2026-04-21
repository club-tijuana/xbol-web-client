import { requestAxios } from "@/helpers/axiosHelper";
import { MyTicketDto } from "@/models/my-ticket.dto";
import { ShareTicket } from "@/models/requests/share-ticket.dto";
import { UnshareTicket } from "@/models/requests/unshare-ticket.dto";
import { store } from "@/store";

const PATH = "tickets";

export async function shareTicket(request: ShareTicket): Promise<MyTicketDto> {
    const state = store.getState();

    return requestAxios<ShareTicket, MyTicketDto>(
        "POST",
        `${PATH}/share`,
        request,
        state.auth.user?.token,
    )
}

export async function unshareTicket(request: UnshareTicket): Promise<unknown> {
    const state = store.getState();

    return requestAxios<UnshareTicket, null>(
        "POST",
        `${PATH}/unshare`,
        request,
        state.auth.user?.token,
    )
}