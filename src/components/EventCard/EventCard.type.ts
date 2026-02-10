import { EventItemDTO } from "@/models/event-item.dto";

export interface EventCardProps {
    eventCard: EventItemDTO;
    size: "sm" | "lg";

    titleColor?: string;
    titleAlign?: CanvasTextAlign,
    descriptionColor?: string;
    descriptionAlign?: CanvasTextAlign;
    showBadge?: boolean;
    badgeType?: "light" | "dark";
    showActions?: boolean;
    imageHeight?: number;
}