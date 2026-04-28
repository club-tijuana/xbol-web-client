import { createTheme } from "@mui/material/styles";

import { colors } from "./colors";

export const theme = createTheme({
    customLayout: {
        contentMaxWidth: 1800,
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
            default: colors.ui.background,
            paper: colors.ui.surface,
        },
        text: {
            primary: colors.text.primary,
            secondary: colors.text.secondary,
            muted: colors.text.muted
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
            main: colors.text.neutral
        },
        muted: {
            main: colors.text.muted,
        },
    },

    typography: {
        fontFamily: "Open Sans, sans-serif",

        h1: {
            fontSize: "40px",
            fontWeight: 600
        },
        h2: {
            fontSize: "30px",
            fontWeight: 700,
            lineHeight: "50px",
            textTransform: "uppercase"
        },
        h3: {
            fontSize: "30px",
            fontWeight: 600,
            lineHeight: "50px",
            textTransform: "uppercase"
        },
        h4: {
            fontSize: "26px",
            fontWeight: 600
        },
        h5: {
            fontSize: "20px",
            fontWeight: 400
        },
        h6: {
            fontSize: "20px",
            fontWeight: 600
        },

        subtitle1: {
            fontSize: "18px",
            fontWeight: 400
        },
        subtitle2: {
            fontSize: "18px",
            fontWeight: 600
        },

        body1: {
            fontSize: "16px",
            fontWeight: 400
        },
        body2: {
            fontSize: "16px",
            fontWeight: 600
        },

        caption: {
            fontSize: "12px",
            fontWeight: 400
        }
    },

    components: {
        MuiInput: {
            styleOverrides: {
                input: {
                    color: "black"
                }
            }
        },
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
                },
                outlined: {
                    "&:active": {
                        backgroundColor: colors.brand.primary,
                        color: colors.brand.white,
                        borderColor: colors.brand.primary
                    },
                },
                sizeSmall: {
                    fontSize: "13px",
                    paddingTop: "9.05px",
                    paddingRight: "13.97px",
                    paddingBottom: "9.05px",
                    paddingLeft: "13.97px",
                },
                sizeMedium: {
                    fontSize: "15px",
                    paddingTop: "12px",
                    paddingRight: "30px",
                    paddingBottom: "12px",
                    paddingLeft: "30px",
                },
                sizeLarge: {
                    fontSize: "17px",
                    paddingTop: "12px",
                    paddingRight: "32px",
                    paddingBottom: "12px",
                    paddingLeft: "32px",
                }
            },
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