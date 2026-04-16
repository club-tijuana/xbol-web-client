import { EventCardVM } from "@/models/views/event-card.vm";
import { SizeVariant, StyleVariant } from "@/types/variants";


// TODO: This component has grown too many visual props.
// Refactor this component to use variants (large/medium/small) instead of multiple styles props.
export interface EventCardGridProps {
    title?: string;
    eventCards: readonly EventCardVM[];

    sizeVariant: SizeVariant;
    styleVariant: StyleVariant;
    showCardBadge?: boolean;
    showCardActions?: boolean;
    showAllButton?: boolean;
}