import React from "react";

export interface FullWidthSectionProps {
    children: React.ReactNode;

    backgroundColor?: string;
    backgroundImage?: string;
    backgroundImageFull?: boolean;
    backgroundSize?: number;
    ignoreParentPadding?: boolean;
}