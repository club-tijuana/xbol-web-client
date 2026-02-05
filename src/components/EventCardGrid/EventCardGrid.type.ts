import { EventItemDTO } from "@/models/event-item.dto";

export interface EventCardGridProps {
    title: string;
    titleAlign?: CanvasTextAlign;
    columns: number;
    spacing: number;
    itemSize: number;
    eventCards: readonly EventItemDTO[];

    size?: "sm" | "lg";
    cardTitleAlign?: CanvasTextAlign;
    cardTitleClass?: string;
    cardDescriptionAlign?: CanvasTextAlign;
    cardDescriptionClass?: string;
}