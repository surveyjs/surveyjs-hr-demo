import { useCallback, useEffect, useRef, useState } from "react";
import CropFreeIcon from "@mui/icons-material/CropFree";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import Button from "@mui/material/Button";
import Portal from "@mui/material/Portal";
import { useColorScheme } from "@mui/material/styles";

const dockButtonSx = {
  minHeight: 44,
  px: 1.75,
  borderRadius: 999,
  color: "text.primary",
  fontSize: 12,
  fontWeight: 600,
  lineHeight: "20px",
  whiteSpace: "nowrap",
  "& .MuiSvgIcon-root": { fontSize: 18 },
  "&:hover": { bgcolor: "action.hover" },
  '&[aria-pressed="true"]': {
    bgcolor: "color-mix(in srgb, var(--mui-palette-primary-main) 14%, transparent)",
    color: "primary.main"
  }
};

export default function DemoDock() {
  const dockRef = useRef(null);
  const themeButtonRef = useRef(null);
  const outlinesButtonRef = useRef(null);
  const { mode, setMode } = useColorScheme();
  const [outlines, setOutlines] = useState(true);
  const dark = mode === "dark";

  useEffect(() => {
    document.documentElement.dataset.surveyOutlines = String(outlines);
  }, [outlines]);

  const setDock = useCallback((node) => {
    dockRef.current = node;
    if (!node || typeof node.showPopover !== "function") return;
    const open = () => {
      if (!node.isConnected || node.matches(":popover-open")) return;
      node.showPopover();
    };
    open();
    requestAnimationFrame(open);
  }, []);

  const moveFocus = (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const themeButton = themeButtonRef.current;
    const outlinesButton = outlinesButtonRef.current;
    const target = event.key === "Home" || (event.key === "ArrowLeft" && document.activeElement === outlinesButton)
      ? themeButton
      : event.key === "End" || event.key === "ArrowRight"
        ? outlinesButton
        : themeButton;
    target?.focus();
  };

  return (
    <Portal>
      <div
        ref={setDock}
        className="demo-dock"
        popover="manual"
        role="toolbar"
        aria-label="Demo display options"
        onKeyDown={moveFocus}
      >
        <Button
          ref={themeButtonRef}
          type="button"
          className="demo-dock__button"
          sx={dockButtonSx}
          aria-label={`Switch to ${dark ? "light" : "dark"} theme`}
          title={`Switch to ${dark ? "light" : "dark"} theme`}
          startIcon={dark ? <DarkModeIcon /> : <LightModeIcon />}
          onClick={() => setMode(dark ? "light" : "dark")}
        >
          {dark ? "Dark" : "Light"}
        </Button>
        <Button
          ref={outlinesButtonRef}
          type="button"
          className="demo-dock__button"
          sx={dockButtonSx}
          aria-pressed={outlines}
          aria-label="Highlight SurveyJS components"
          title={`${outlines ? "Hide" : "Show"} outlines around SurveyJS components`}
          startIcon={<CropFreeIcon />}
          onClick={() => setOutlines((value) => !value)}
        >
          SurveyJS blocks
        </Button>
      </div>
    </Portal>
  );
}
