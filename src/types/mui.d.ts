import "@mui/material/styles";
import "@mui/material/Chip";
import "@mui/material/SvgIcon";
import "@mui/material/IconButton";

declare module "@mui/material/styles" {
    interface Theme {
        customLayout: {
            contentMaxWidth: number;
        };
    }

    interface ThemeOptions {
        customLayout?: {
            contentMaxWidth?: number;
        };
    }

    interface Palette {
        layout: {
            header: string;
            footer: string;
        }
    }

    interface PaletteOptions {
        layout?: {
            header: string;
            footer: string;
        }
    }

    interface TypeText {
        muted: string;
        neutral: string;
        text: string;
    }

    interface TypeTextOptions {
        muted?: string;
        neutral?: string;
        text: string;
    }

    interface TypographyVariants {
        bodyXs: React.CSSProperties;
        captionLg: React.CSSProperties;
        labelSm: React.CSSProperties;
        bodyLg: React.CSSProperties;
        titleMd: React.CSSProperties;
        titleXl: React.CSSProperties;
        hero: React.CSSProperties;
    }

    interface TypographyVariantsOptions {
        bodyXs?: React.CSSProperties;
        captionLg?: React.CSSProperties;
        labelSm?: React.CSSProperties;
        bodyLg?: React.CSSProperties;
        titleMd?: React.CSSProperties;
        titleXl?: React.CSSProperties;
        hero?: React.CSSProperties;
    }
}

declare module "@mui/material/styles" {
    interface Palette {
        neutral: Palette["primary"];
        muted: Palette["primary"];
    }

    interface PaletteOptions {
        neutral?: PaletteOptions["primary"];
        muted?: PaletteOptions["primary"];
    }
}

declare module "@mui/material/Typography" {
    interface TypographyPropsVariantOverrides {
        bodyXs: true;
        captionLg: true;
        labelSm: true;
        bodyLg: true;
        titleMd: true;
        titleXl: true;
        hero: true;
    }

    interface TypographyPropsColorOverrides {
        muted: true;
        neutral: true;
        text: true;
    }
}

declare module "@mui/material/Chip" {
    interface ChipPropsColorOverrides {
        muted: true;
        neutral: true;
    }
}

declare module "@mui/material/SvgIcon" {
    interface SvgIconPropsColorOverrides {
        neutral: true;
        muted: true;
    }
}

declare module "@mui/material/IconButton" {
    interface IconButtonPropsColorOverrides {
        neutral: true;
        muted: true;
    }
}

export { };