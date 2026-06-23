import { publicEnv } from "@/config/env";
import { getPublicAppBasePath } from "@/utils/routing/basePath";

const normalizedPublicPrefix = getPublicAppBasePath(
  publicEnv.NEXT_PUBLIC_BASE_PATH,
  publicEnv.NEXT_PUBLIC_ASSET_PREFIX,
);

export function getSessionApiPath(): string {
  return `${normalizedPublicPrefix}/api/auth/session/`;
}
