import { publicEnv } from "@/config/env";

function normalizePublicPrefix(prefix: string | undefined): string {
  const trimmedPrefix = (prefix ?? "").trim().replace(/^\/+|\/+$/g, "");

  return trimmedPrefix ? `/${trimmedPrefix}` : "";
}

const normalizedPublicPrefix =
  normalizePublicPrefix(publicEnv.NEXT_PUBLIC_BASE_PATH)
  || normalizePublicPrefix(publicEnv.NEXT_PUBLIC_ASSET_PREFIX);

export function getSessionApiPath(): string {
  return `${normalizedPublicPrefix}/api/auth/session/`;
}
