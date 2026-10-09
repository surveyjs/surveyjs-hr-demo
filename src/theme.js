import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  cssVariables: true,
  palette: {
    mode: "light",
    primary: { main: "#0B57D0" },
    secondary: { main: "#0F766E" },
    success: { main: "#137333" },
    warning: { main: "#B06000" },
    error: { main: "#B3261E" },
    background: { default: "#F3F5F8", paper: "#FFFFFF" },
    text: { primary: "#1B2430", secondary: "#5C6773" },
    divider: "#E2E6EC"
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 600, letterSpacing: "-0.02em" },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { fontWeight: 600 }
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
    }
  }
});

export default theme;
