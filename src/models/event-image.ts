import { DEFAULT_EVENT_IMAGE } from "@/config/defaults";
import { publicEnv } from "@/config/env";

function normalizeBasePath(basePath?: string): string {
  const trimmedBasePath = basePath?.trim().replace(/^\/+|\/+$/g, "") ?? "";

  return trimmedBasePath ? `/${trimmedBasePath}` : "";
}

const defaultEventImage = `${normalizeBasePath(publicEnv.NEXT_PUBLIC_BASE_PATH)}${DEFAULT_EVENT_IMAGE}`;
const configuredEventImage =
  publicEnv.NEXT_PUBLIC_DEFAULT_EVENT_IMAGE === DEFAULT_EVENT_IMAGE
    ? defaultEventImage
    : publicEnv.NEXT_PUBLIC_DEFAULT_EVENT_IMAGE;

export function eventImageOrDefault(imageUrl?: string | null): string {
  return imageUrl?.trim() || configuredEventImage;
}
