import { Box } from "@mui/material";

import { FullWidthSectionProps } from "./FullWidthSection.type";

export default function FullWidthSection({ children, backgroundColor, backgroundImage }: FullWidthSectionProps) {
    return (
        <Box sx={{
            width: "100vw",
            ml: "calc(50% - 50vw)",
            backgroundImage: `url('${backgroundImage}')`,
            backgroundColor: backgroundColor,
            backgroundSize: "cover",
            backgroundPosition: "center",
            overflowX: "hidden",
        }}>
            {children}
        </Box>
    );
}