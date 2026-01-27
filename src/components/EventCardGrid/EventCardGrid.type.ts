import { EventCardDto } from "@/models/event-card.dto";

export interface EventCardGridProps {
    title: string;
    titleAlign?: CanvasTextAlign,
    columns: number;
    spacing: number;
    itemSize: number;
    eventCards: EventCardDto[];

    size?: "sm" | "lg";
    cardTitleAlign?: CanvasTextAlign;
    cardDescriptionAlign?: CanvasTextAlign;
    cardDescriptionClass?: string;
}