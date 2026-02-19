import { EventItemDTO } from "@/models/event-item.dto";
import { SizeVariant, StyleVariant } from "@/types/variants";

export interface EventCardGridProps {
    title?: string;
    eventCards: readonly EventItemDTO[];

    sizeVariant: SizeVariant;
    styleVariant: StyleVariant;
    showCardBadge?: boolean;
    showCardActions?: boolean;
}