import { ResponsiveStyleValue } from "@mui/system";

import { EventItemDTO } from "@/models/event-item.dto";
import { ResponsiveNumber } from "@/types/responsive";

// TODO: This component has grown too many visual props.
// Refactor this component to use variants (large/medium/small) instead of multiple styles props.
export interface EventCardGridProps {
    title?: string;
    titleAlign?: CanvasTextAlign;
    columns: ResponsiveStyleValue<number>;
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
    cardImageHeights?: ResponsiveNumber;
    showAllButton?: boolean;
}