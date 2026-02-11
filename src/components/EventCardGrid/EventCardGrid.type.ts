import { EventItemDTO } from "@/models/event-item.dto";

export interface EventCardGridProps {
    title?: string;
    titleAlign?: CanvasTextAlign;
    columns: number;
    spacing: number;
    itemSize: number;
    eventCards: readonly EventItemDTO[];

    size?: "sm" | "lg";
    cardTitleAlign?: CanvasTextAlign;
    cardTitleColor?: string;
    cardDescriptionAlign?: CanvasTextAlign;
    cardDescriptionColor?: string;
    showCardBadge?: boolean;
    cardBadgeType?: "light" | "dark";
    showCardActions?: boolean;
    cardImageHeight?: number;
    showAllButton?: boolean;
}