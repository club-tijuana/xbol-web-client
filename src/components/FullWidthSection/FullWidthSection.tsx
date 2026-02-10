import { Box } from "@mui/material";

import styles from "./FullWidthSection.module.scss";
import { FullWidthSectionProps } from "./FullWidthSection.type";

export default function FullWidthSection({ children, backgroundColor, backgroundImage, backgroundImageFull = true, ignoreParentPadding = true, backgroundSize = undefined }: FullWidthSectionProps) {
    return (
        <Box className={styles.section} sx={{
            backgroundImage: `url('${backgroundImage}')`,
            backgroundColor: backgroundColor,
            px: ignoreParentPadding ? undefined : { xs: 2, md: 4, lg: 4, xl: 38 },
            backgroundSize: backgroundImageFull ? "cover" : (backgroundSize === undefined ? "contain" : backgroundSize),
            backgroundPosition: backgroundImageFull ? "center" : "top",
            backgroundRepeat: backgroundImageFull ? "repeat" : "no-repeat"
        }}>
            {children}
        </Box>
    );
}