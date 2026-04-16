import { EventCardVM } from "@/models/views/event-card.vm";
import { SizeVariant, StyleVariant } from "@/types/variants";

// TODO: Refactor EventCard to use variants instead of multiple visual props.
// This component is tightly coupled with EventCardGrid design configuration.
export interface EventCardProps {
    eventCard: EventCardVM;
    sizeVariant: SizeVariant;
    styleVariant: StyleVariant;

    showBadge?: boolean;
    showActions?: boolean;
}