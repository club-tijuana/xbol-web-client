import { requestAxios } from "@/helpers/axiosHelper";
import { BundleItemDTO } from "@/models/bundle-item.dto";
import { SeoMetadataDTO } from "@/models/seo-metadata";
import { store } from "@/store";

const PATH: string = "bundles";

export async function getBundleBanner(): Promise<BundleItemDTO> {
    const state = store.getState();

    return requestAxios<null, BundleItemDTO>(
        "GET",
        `${PATH}`,
        undefined,
        state.auth.user?.token,
        { params: { includeMedia: true } }
    );
}

export async function getBundleMetadataAsync(bundleId: number): Promise<SeoMetadataDTO> {
    return requestAxios<null, SeoMetadataDTO>(
        "GET",
        `${PATH}/${bundleId}/metadata`
    );
}

export async function getBlockedSeatsAsync(bundleId: number): Promise<Array<string>> {
    const state = store.getState();

    return requestAxios<null, Array<string>>(
        "GET",
        `${PATH}/${bundleId}/blocked-seats`,
        undefined,
        state.auth.user?.token,
    );
}