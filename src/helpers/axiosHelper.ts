import axios, { AxiosRequestConfig } from "axios";
import qs from "qs";

import { publicEnv } from "@/config/env";

if (process.env.NODE_ENV === "development") {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

const BASE_URL = publicEnv.NEXT_PUBLIC_API_BASE_URL;

export async function requestAxios<TPayload, TResult>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  path: string,
  payload?: TPayload,
  token?: string,
  options?: {
    isBlob?: boolean;
    params?: Record<string, unknown>;
  },
): Promise<TResult> {
  const authorizationToken = token
    ? await import("@/services/firebaseClient").then(({ getFreshFirebaseToken }) =>
      getFreshFirebaseToken(token),
    )
    : undefined;

  const config: AxiosRequestConfig = {
    url: `${BASE_URL}${path}`,
    method,
    headers: {
      Accept: "application/json",
      ...(payload ? { "Content-Type": "application/json" } : {}),
      ...(authorizationToken ? { Authorization: `Bearer ${authorizationToken}` } : {}),
    },
    data: payload,
    params: options?.params,
    paramsSerializer: (params) =>
      qs.stringify(params, { arrayFormat: "repeat" }),
    responseType: options?.isBlob ? "blob" : "json",
  };

  const response = await axios.request<TResult>(config);

  return response.data;
}
