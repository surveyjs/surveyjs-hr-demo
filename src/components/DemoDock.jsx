import { useCallback, useEffect, useRef, useState } from "react";
import CropFreeIcon from "@mui/icons-material/CropFree";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Portal from "@mui/material/Portal";
import Tooltip from "@mui/material/Tooltip";
import { useColorScheme } from "@mui/material/styles";
import DemoMenu from "./DemoMenu";

const dockButtonSx = {
  minHeight: 44,
  height: 44,
  minWidth: 44,
  width: 44,
  px: 0,
  py: 0,
  fontSize: 14,
  fontWeight: 500,
  lineHeight: "20px",
  letterSpacing: 0,
  borderRadius: 999,
  cursor: "default",
  color: "text.primary",
  "& .MuiSvgIcon-root": { fontSize: 18 },
  "& .demo-dock-chevron": { fontSize: 14 },
  "&:hover": { bgcolor: "action.hover" },
  "&.Mui-focusVisible": {
    outline: "2px solid",
    outlineColor: "primary.main",
    outlineOffset: 2
  },
  '&[aria-pressed="true"]': {
    bgcolor: "action.selected"
  }
};

const dockActionSx = {
  ...dockButtonSx,
  // MUI's xl starts at 1536px, the same as the shadcn dock's 2xl.
  width: { xs: 44, xl: "auto" },
  px: { xs: 0, xl: 1.5 },
  gap: 0.75,
  textTransform: "none"
};
const dockActionLabelSx = { display: { xs: "none", xl: "inline" }, whiteSpace: "nowrap" };

export default function DemoDock() {
  const dockRef = useRef(null);
  const themeButtonRef = useRef(null);
  const outlinesButtonRef = useRef(null);
  const menuButtonRef = useRef(null);
  const { mode, systemMode, setMode } = useColorScheme();
  const [container, setContainer] = useState(null);
  const [outlines, setOutlines] = useState(true);
  const [tooltip, setTooltip] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const dark = (mode === "system" ? systemMode : mode) === "dark";

  useEffect(() => {
    document.documentElement.dataset.surveyOutlines = String(outlines);
  }, [outlines]);

  useEffect(() => {
    const dismissOutlines = () => setOutlines(false);
    document.addEventListener("survey-outlines-dismiss", dismissOutlines);
    return () => document.removeEventListener("survey-outlines-dismiss", dismissOutlines);
  }, []);

  useEffect(() => {
    // Keep the dock inside MUI's active focus trap while a form is open.
    const attachToDialog = () => {
      const dialogs = Array.from(document.querySelectorAll(".MuiModal-root [role='dialog']"))
        .filter((dialog) => !dialog.closest('[aria-hidden="true"]'));
      setContainer(dialogs.length ? dialogs[dialogs.length - 1] : null);
    };
    const observer = new MutationObserver(attachToDialog);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["aria-hidden"]
    });
    attachToDialog();
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setTooltip(null);
    setMenuOpen(false);
  }, [container]);

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
    if (event.target.closest('[role="menu"]')) return;
    if (event.key === "Escape" && tooltip) {
      setTooltip(null);
      event.stopPropagation();
      return;
    }
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const themeButton = themeButtonRef.current;
    const outlinesButton = outlinesButtonRef.current;
    const buttons = [menuButtonRef.current, outlinesButton, themeButton];
    const index = buttons.indexOf(document.activeElement);
    const step = event.key === "ArrowRight" ? 1 : -1;
    const next = buttons[(index + step + buttons.length) % buttons.length];
    const target = event.key === "Home" ? menuButtonRef.current : event.key === "End" ? themeButton : next;
    target?.focus();
  };

  return (
    <Portal container={container}>
      <div
        ref={setDock}
        className="demo-dock"
        popover="manual"
        role="toolbar"
        aria-label="Demo Tools"
        data-tooltip-open={Boolean(tooltip)}
        data-menu-open={menuOpen}
        onKeyDown={moveFocus}
      >
        <div className="demo-dock-panel">
          <DemoMenu dockRef={dockRef} buttonRef={menuButtonRef} buttonSx={dockButtonSx} open={menuOpen} setOpen={setMenuOpen} />
          <Tooltip
            title={`${outlines ? "Hide" : "Show"} SurveyJS Outlines`}
            open={tooltip === "outlines"}
            onOpen={() => setTooltip("outlines")}
            onClose={() => setTooltip(null)}
            placement="top"
            enterDelay={150}
            enterNextDelay={150}
            describeChild
            slotProps={{ popper: { container: () => dockRef.current } }}
          >
            <Button
              ref={outlinesButtonRef}
              type="button"
              className="demo-dock__button"
              sx={dockActionSx}
              aria-pressed={outlines}
              aria-label="Highlight SurveyJS"
              onClick={() => setOutlines((value) => !value)}
            >
              <CropFreeIcon />
              <Box component="span" sx={dockActionLabelSx}>Highlight SurveyJS</Box>
            </Button>
          </Tooltip>
          <Tooltip
            title="Switch Theme"
            open={tooltip === "theme"}
            onOpen={() => setTooltip("theme")}
            onClose={() => setTooltip(null)}
            placement="top"
            enterDelay={150}
            enterNextDelay={150}
            describeChild
            slotProps={{ popper: { container: () => dockRef.current } }}
          >
            <Button
              ref={themeButtonRef}
              type="button"
              className="demo-dock__button"
              sx={dockActionSx}
              aria-label="Switch Theme"
              onClick={() => setMode(dark ? "light" : "dark")}
            >
              {dark ? <DarkModeIcon /> : <LightModeIcon />}
              <Box component="span" sx={dockActionLabelSx}>Switch Theme</Box>
            </Button>
          </Tooltip>
        </div>
      </div>
    </Portal>
  );
}
