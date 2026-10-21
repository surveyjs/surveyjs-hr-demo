import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data-theme"
  },
  colorSchemes: {
    light: {
      palette: {
        primary: { main: "#0B57D0" },
        secondary: { main: "#0F766E" },
        success: { main: "#137333" },
        warning: { main: "#B06000" },
        error: { main: "#B3261E" },
        background: { default: "#F4F6F8", paper: "#FFFFFF" },
        text: { primary: "#1B2430", secondary: "#5C6773" },
        divider: "#E2E6EC"
      }
    },
    dark: {
      palette: {
        primary: { main: "#8AB4F8" },
        secondary: { main: "#5EEAD4" },
        success: { main: "#81C995" },
        warning: { main: "#F9AB00" },
        error: { main: "#F2B8B5" },
        background: { default: "#12171E", paper: "#1C2430" },
        text: { primary: "#E8EEF4", secondary: "#A8B3C0" },
        divider: "#2C3642"
      }
    }
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 600, letterSpacing: "-0.02em" },
    h5: { fontWeight: 600, letterSpacing: 0 },
    h6: { fontWeight: 600, letterSpacing: 0 },
    subtitle1: { fontWeight: 600, letterSpacing: 0 },
    subtitle2: { fontWeight: 400, letterSpacing: 0 },
    body1: { letterSpacing: 0 },
    body2: { letterSpacing: 0 },
    button: { fontWeight: 600, letterSpacing: 0 },
    caption: { letterSpacing: 0 }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: "none", borderRadius: 8 }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: "none" }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600 }
      }
    },
    MuiCardContent: {
      styleOverrides: {
        root: ({ theme }) => ({
          padding: theme.spacing(2),
          "&:last-child": { paddingBottom: theme.spacing(2) }
        })
      }
    }
  }
});

export default theme;
