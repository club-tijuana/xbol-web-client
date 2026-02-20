import axios, { AxiosRequestConfig } from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function requestAxios<TPayload, TResult>(
    method: "GET" | "POST" | "PUT" | "DELETE",
    path: string,
    payload?: TPayload,
    token?: string,
    options?: { isBlob?: boolean }
): Promise<TResult> {
    const config: AxiosRequestConfig = {
        url: `${BASE_URL}${path}`,
        method,
        headers: {
            "Accept": "application/json",
            ...(payload ? { "Content-Type": "application/json" } : {}),
            ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        data: payload,
        responseType: options?.isBlob ? "blob" : "json"
    };

    const response = await axios.request<TResult>(config);

    return response.data;
}