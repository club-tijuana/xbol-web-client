import { EventCardVM } from "@/models/views/event-card.vm";
import { SizeVariant, StyleVariant } from "@/types/variants";

export interface EventCardProps {
    eventCard: EventCardVM;
    sizeVariant: SizeVariant;
    styleVariant: StyleVariant;

    showBadge?: boolean;
    showActions?: boolean;
}