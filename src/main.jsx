import { createRoot } from "react-dom/client";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import App from "./app/App.jsx";
import theme from "./theme.js";
import "survey-core/survey-core.css";
import "survey-creator-core/survey-creator-core.css";
import "survey-core/themes/adapters/mui.css";
import "survey-core/themes/adapters/icons/mui";
import "./styles/global.css";

createRoot(document.getElementById("root")).render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <App />
  </ThemeProvider>
);
