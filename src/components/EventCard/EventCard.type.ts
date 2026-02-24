import { EventItemDTO } from "@/models/event-item.dto";
import { ResponsiveNumber } from "@/types/responsive";

// TODO: Refactor EventCard to use variants instead of multiple visual props.
// This component is tightly coupled with EventCardGrid design configuration.
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
    imageHeights?: ResponsiveNumber;
}