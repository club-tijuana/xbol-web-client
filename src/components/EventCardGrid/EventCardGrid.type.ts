import { EventCardVM } from "@/models/views/event-card.vm";
import { SizeVariant, StyleVariant } from "@/types/variants";

export interface EventCardGridProps {
    title?: string;
    eventCards: readonly EventCardVM[];

    sizeVariant: SizeVariant;
    styleVariant: StyleVariant;
    showCardBadge?: boolean;
    showCardInfo?: boolean;
    showAllButton?: boolean;
}