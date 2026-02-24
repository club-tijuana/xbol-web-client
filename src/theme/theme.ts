import { createTheme } from "@mui/material/styles";

import { colors } from "./colors";

export const theme = createTheme({
    customLayout: {
        contentMaxWidth: 1500,
    },

    palette: {
        layout: {
            header: colors.layout.header,
            footer: colors.layout.footer
        },
        primary: {
            main: colors.brand.primary,
        },
        secondary: {
            main: colors.brand.secondary,
        },
        background: {
            default: colors.light.background,
            paper: colors.light.surface,
        },
        text: {
            primary: colors.light.text,
            secondary: colors.light.secondary,
            muted: colors.light.muted,
            neutral: colors.light.neutral,
        },
        error: {
            main: colors.semantic.error,
        },
        warning: {
            main: colors.semantic.warning,
        },
        success: {
            main: colors.semantic.success,
        },
        info: {
            main: colors.semantic.info,
        },
        neutral: {
            main: colors.light.neutral
        },
        muted: {
            main: colors.light.muted,
        },
    },

    typography: {
        fontFamily: "Open Sans, sans-serif",

        h1: { fontSize: "40px", fontWeight: 700 },
        h2: { fontSize: "29px", fontWeight: 700 },
        h3: { fontSize: "26px", fontWeight: 600 },
        h4: { fontSize: "23px", fontWeight: 600 },
        h5: { fontSize: "20px", fontWeight: 600 },
        h6: { fontSize: "18px", fontWeight: 600 },

        subtitle1: { fontSize: "16px", fontWeight: 600 },
        subtitle2: { fontSize: "14px", fontWeight: 600 },

        body1: { fontSize: "16px", fontWeight: 400 },
        body2: { fontSize: "14px", fontWeight: 400 },

        caption: { fontSize: "12px", fontWeight: 400 },
        button: { fontSize: "14px", fontWeight: 600 },

        // Custom variants
        bodyXs: { fontSize: "10px", fontWeight: 400 },
        captionLg: { fontSize: "12px", fontWeight: 400 },
        labelSm: { fontSize: "14px", fontWeight: 600 },
        bodyLg: { fontSize: "17px", fontWeight: 400 },
        titleMd: { fontSize: "25px", fontWeight: 400 },
        titleXl: { fontSize: "31px", fontWeight: 700 },
        hero: { fontSize: "40px", fontWeight: 600 },
    },

    components: {
        MuiFilledInput: {
            styleOverrides: {
                input: {
                    fontFamily: 'Open Sans',
                    fontSize: '16px',
                    fontWeight: 400
                }
            }
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: 6
                }
            }
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    textTransform: 'none'
                }
            }
        }
    }
});