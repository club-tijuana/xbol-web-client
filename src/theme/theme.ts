import { createTheme } from "@mui/material/styles";

import { colors } from "./colors";

export const theme = createTheme({
  customLayout: {
    contentMaxWidth: 1800,
  },

  palette: {
    layout: {
      header: colors.layout.header,
      footer: colors.layout.footer,
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
      muted: colors.text.muted,
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
      main: colors.text.neutral,
    },
    muted: {
      main: colors.text.muted,
    },
  },

  typography: {
    fontFamily: "Open Sans, sans-serif",

    h1: {
      fontWeight: 600,
      fontSize: "1.8rem",
      "@media (min-width:600px)": {
        fontSize: "2rem",
      },
      "@media (min-width:900px)": {
        fontSize: "2.2rem",
      },
    },

    h2: {
      fontWeight: 700,
      textTransform: "uppercase",
      lineHeight: 1.2,
      fontSize: "1.3rem",
      "@media (min-width:600px)": {
        fontSize: "1.5rem",
      },
      "@media (min-width:900px)": {
        fontSize: "1.7rem",
      },
    },

    h3: {
      fontWeight: 600,
      textTransform: "uppercase",
      lineHeight: 1.2,
      fontSize: "1.2rem",
      "@media (min-width:600px)": {
        fontSize: "1.4rem",
      },
      "@media (min-width:900px)": {
        fontSize: "1.6rem",
      },
    },

    h4: {
      fontWeight: 600,
      fontSize: "1.1rem",
      "@media (min-width:600px)": {
        fontSize: "1.25rem",
      },
      "@media (min-width:900px)": {
        fontSize: "1.35rem",
      },
    },

    h5: {
      fontWeight: 400,
      fontSize: "1rem",
      "@media (min-width:600px)": {
        fontSize: "1.1rem",
      },
    },

    h6: {
      fontWeight: 600,
      fontSize: "1rem",
      "@media (min-width:600px)": {
        fontSize: "1.1rem",
      },
    },

    subtitle1: {
      fontWeight: 400,
      fontSize: "0.95rem",
      "@media (min-width:600px)": {
        fontSize: "1rem",
      },
    },

    subtitle2: {
      fontWeight: 600,
      fontSize: "0.95rem",
      "@media (min-width:600px)": {
        fontSize: "1rem",
      },
    },

    body1: {
      fontWeight: 400,
      fontSize: "0.95rem",
      "@media (min-width:600px)": {
        fontSize: "1rem",
      },
    },

    body2: {
      fontWeight: 600,
      fontSize: "0.9rem",
      "@media (min-width:600px)": {
        fontSize: "0.95rem",
      },
    },

    caption: {
      fontWeight: 400,
      fontSize: "0.75rem",
      "@media (min-width:600px)": {
        fontSize: "0.8rem",
      },
    },
  },

  components: {
    MuiInput: {
      styleOverrides: {
        input: {
          color: "black",
        },
      },
    },
    MuiFilledInput: {
      styleOverrides: {
        input: {
          fontFamily: "Open Sans",
          fontSize: "16px",
          fontWeight: 400,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 6,
        },
        outlined: {
          "&:active": {
            backgroundColor: colors.brand.primary,
            color: colors.brand.white,
            borderColor: colors.brand.primary,
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
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: `
                .MuiSnackbar-root {
                    z-index: 9999 !important;
                }
                .MuiSnackbar-anchorOriginTopRight,
                .MuiSnackbar-anchorOriginTopLeft,
                .MuiSnackbar-anchorOriginTopCenter {
                    top: 90px !important;
                }
            `,
    },
  },
});
