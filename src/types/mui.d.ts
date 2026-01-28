import { CSSProperties } from "react";
import "@mui/material/styles";

declare module "@mui/material/styles" {
    interface TypographyVariants {
        body0: CSSProperties;
        md3: CSSProperties;
        xl: CSSProperties;
        xl2: CSSProperties;
    }

    interface TypographyVariantsOptions {
        body0?: CSSProperties;
        md3?: CSSProperties;
        xl?: CSSProperties;
        xl2?: CSSProperties;
    }
}

declare module "@mui/material/Typography" {
    interface TypographyPropsVariantOverrides {
        body0: true;
        md3: true;
        xl: true;
        xl2: true;
    }
}