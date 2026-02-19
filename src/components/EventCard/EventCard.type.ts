import { EventItemDTO } from "@/models/event-item.dto";
import { SizeVariant, StyleVariant } from "@/types/variants";

export interface EventCardProps {
    eventCard: EventItemDTO;
    sizeVariant: SizeVariant;
    styleVariant: StyleVariant;

    showBadge?: boolean;
    showActions?: boolean;
}