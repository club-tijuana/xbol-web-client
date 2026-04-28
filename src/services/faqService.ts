import { requestAxios } from "@/helpers/axiosHelper";
import { FaqDTO } from "@/models/faq.dto";

export async function getFAQs(): Promise<FaqDTO[]> {
    return requestAxios<null, FaqDTO[]>(
        "GET",
        "faqs"
    );
}