import { EventItemDTO } from "@/models/event-item.dto";

export interface EventCarouselProps {
  events: readonly EventItemDTO[];
  fallbackImageUrl?: string | null;
  fallbackMobileImageUrl?: string | null;
}
