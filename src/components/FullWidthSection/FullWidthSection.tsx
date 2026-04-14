"use client";

import { Box, CSSObject, SxProps, Theme } from "@mui/material";

import { theme } from "@/theme/theme";

import styles from "./FullWidthSection.module.scss";
import { FullWidthSectionProps } from "./FullWidthSection.type";

export default function FullWidthSection({
    children,
    variant = "default",
    backgroundColor,
    image,
    height,
    fullBleed = false,
    disableMaxWidth = false
}: FullWidthSectionProps) {

    const sx: SxProps<Theme> = {
        position: "relative",
        px: fullBleed ? 0 : { xs: 2, md: 4, lg: 4, xl: 4 }
    };

    const imageUrl = typeof image === "string" ? image : image?.src;

    let before: CSSObject | undefined;

    switch (variant) {
        case "colorFixedHeight":
            before = {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: height ? `${height}px` : "300px",
                backgroundColor: backgroundColor,
                zIndex: 0,
            };
            break;

        case "imageFixedHeight":
            before = {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: height ? `${height}px` : "300px",
                backgroundImage: `url('${imageUrl}')`,
                backgroundSize: "cover",
                backgroundPosition: "top",
                backgroundRepeat: "no-repeat",
                zIndex: 0,
            };
            break;

        case "color":
            sx.backgroundColor = backgroundColor || "transparent";
            break;

        case "imageFull":
            sx.backgroundImage = `url('${imageUrl}')`;
            sx.backgroundSize = "cover";
            sx.backgroundPosition = "center";
            sx.backgroundRepeat = "no-repeat";
            break;
    }

    const finalSx: SxProps<Theme> = before ? { ...sx, "&::before": before } : sx;

    const contentSx: SxProps<Theme> = {
        position: "relative",
        zIndex: 1,
        width: "100%",
        mx: "auto",
        px: fullBleed ? 0 : { xs: 2, md: 4, lg: 4 },
        ...(disableMaxWidth ? {} : { maxWidth: theme.customLayout.contentMaxWidth })
    };

    return (
        <Box className={styles.section} sx={finalSx}>
            <Box sx={contentSx}>
                {children}
            </Box>
        </Box>
    );
}
