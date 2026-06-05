import { requestAxios } from "@/helpers/axiosHelper";
import { PhoneRegionCodeResponse } from "@/models/phone-region-code-response.dto";

const PATH: string = "phone-region-codes";

export async function getPhoneRegionCodes(): Promise<PhoneRegionCodeResponse[] | undefined> {
    return requestAxios<undefined, PhoneRegionCodeResponse[] | undefined>(
        "GET",
        PATH
    );
}