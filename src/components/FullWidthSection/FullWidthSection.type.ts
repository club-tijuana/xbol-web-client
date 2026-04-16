import { StaticImageData } from "next/image";
import React from "react";

export type FullWidthSectionVariant =
    | "default"
    | "color"
    | "colorFixedHeight"
    | "imageFull"
    | "imageFixedHeight"

export interface FullWidthSectionProps {
    children: React.ReactNode;
    variant?: FullWidthSectionVariant;

    backgroundColor?: string;
    image?: string | StaticImageData;
    height?: number;
    fullBleed?: boolean;
    disableMaxWidth?: boolean;
}