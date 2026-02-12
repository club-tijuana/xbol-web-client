import React from "react";

export type FullWidthSectionVariant =
    | "default"
    | "color"
    | "imageFull"
    | "imageFixedHeight"

export interface FullWidthSectionProps {
    children: React.ReactNode;
    variant?: FullWidthSectionVariant;

    backgroundColor?: string;
    image?: string;
    height?: number;
    fullBleed?: boolean;
}