import "@mui/material/styles";

declare module "@mui/material/styles" {
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