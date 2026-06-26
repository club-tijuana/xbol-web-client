import { DEFAULT_EVENT_IMAGE } from "@/config/defaults";
import { publicEnv } from "@/config/env";
import { normalizeBasePath } from "@/utils/routing/basePath";

const defaultEventImage = `${normalizeBasePath(publicEnv.NEXT_PUBLIC_BASE_PATH)}${DEFAULT_EVENT_IMAGE}`;
const configuredEventImage =
  publicEnv.NEXT_PUBLIC_DEFAULT_EVENT_IMAGE === DEFAULT_EVENT_IMAGE
    ? defaultEventImage
    : publicEnv.NEXT_PUBLIC_DEFAULT_EVENT_IMAGE;

export function eventImageOrDefault(imageUrl?: string | null): string {
  return imageUrl?.trim() || configuredEventImage;
}

export function heroImageOrDefault(
  imageUrl?: string | null,
  fallbackImageUrl?: string | null,
): string {
  return eventImageOrDefault(imageUrl?.trim() || fallbackImageUrl);
}
