import { DEFAULT_EVENT_IMAGE } from "@/config/defaults";

const configuredEventImage = process.env.NEXT_PUBLIC_DEFAULT_EVENT_IMAGE
  || DEFAULT_EVENT_IMAGE;

export function eventImageOrDefault(imageUrl?: string | null): string {
  return imageUrl?.trim() || configuredEventImage;
}
