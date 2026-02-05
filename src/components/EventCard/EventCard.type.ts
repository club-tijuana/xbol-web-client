import { EventItemDTO } from "@/models/event-item.dto";

export interface EventCardProps {
    eventCard: EventItemDTO;
    size: "sm" | "lg";

    titleClass?: string;
    titleAlign?: CanvasTextAlign,
    descriptionClass?: string;
    descriptionAlign?: CanvasTextAlign;
}