"use client";

import { Box, SxProps, Theme } from "@mui/material";

import styles from "./FullWidthSection.module.scss";
import { FullWidthSectionProps } from "./FullWidthSection.type";

export default function FullWidthSection({
    children,
    variant = "default",
    backgroundColor,
    image,
    height,
    fullBleed = false,
}: FullWidthSectionProps) {
    const sx: SxProps<Theme> = {
        px: fullBleed ? 0 : { xs: 2, md: 4, lg: 4, xl: 38 },
    };

    switch (variant) {
        case "color":
            sx.backgroundColor = backgroundColor || "transparent";
            break;

        case "imageFull":
            sx.backgroundImage = `url('${image}')`;
            sx.backgroundSize = "cover";
            sx.backgroundPosition = "center";
            sx.backgroundRepeat = "no-repeat";
            break;

        case "imageFixedHeight":
            sx.backgroundImage = `url('${image}')`;
            sx.backgroundSize = height ? height : "cover";
            sx.backgroundPosition = "top";
            sx.backgroundRepeat = "no-repeat";
            break;

        case "default":
        default:
            break;
    }

    return (
        <Box className={styles.section} sx={sx}>
            {children}
        </Box>
    );
}