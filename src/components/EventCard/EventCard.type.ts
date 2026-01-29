import { EventCardDto } from "@/models/event-card.dto";

export interface EventCardProps {
    eventCard: EventCardDto;
    size: "sm" | "lg";

    titleClass?: string;
    titleAlign?: CanvasTextAlign,
    descriptionClass?: string;
    descriptionAlign?: CanvasTextAlign;
}