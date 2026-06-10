import { HoldToken } from "@seatsio/seatsio-react";

import { requestAxios } from "@/helpers/axiosHelper";
import { HoldSeatsActionRequest } from "@/models/requests/hold-seats-action-request.dto";
import { ReleaseSeatsByKeyRequest } from "@/models/requests/release-seats-by-key-request.dto";

const PATH: string = "hold-seats";

export async function holdSeats(request: HoldSeatsActionRequest): Promise<HoldToken> {
    return requestAxios<HoldSeatsActionRequest, HoldToken>(
        "POST",
        `${PATH}/hold`,
        request
    );
}

export async function releaseSeats(request: ReleaseSeatsByKeyRequest): Promise<string[]> {
    return requestAxios<ReleaseSeatsByKeyRequest, string[]>(
        "POST",
        `${PATH}/release`,
        request
    );
}