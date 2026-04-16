import { HoldToken } from "@seatsio/seatsio-react";

import { requestAxios } from "@/helpers/axiosHelper";
import { HoldSeasonSeatsRequest } from "@/models/requests/hold-season-seats-request.dto";
import { store } from "@/store";

const PATH: string = "hold-seats";

export async function holdToken(signal?: AbortSignal) {
    const state = store.getState();

    return requestAxios<undefined, HoldToken>(
        "POST",
        `${PATH}/hold-token`,
        undefined,
        state.auth.user?.token,
        { signal }
    );
}

export async function seasonHoldToken(
    holdSeatsRequest: HoldSeasonSeatsRequest,
    signal?: AbortSignal,
) {
    const state = store.getState();

    return requestAxios<HoldSeasonSeatsRequest, HoldToken>(
        "POST",
        `${PATH}/season-hold-token`,
        holdSeatsRequest,
        state.auth.user?.token,
        { signal }
    );
}