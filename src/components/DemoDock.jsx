import { useCallback, useEffect, useRef, useState } from "react";
import CropFreeIcon from "@mui/icons-material/CropFree";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import IconButton from "@mui/material/IconButton";
import Portal from "@mui/material/Portal";
import Tooltip from "@mui/material/Tooltip";
import { useColorScheme } from "@mui/material/styles";

const dockButtonSx = {
  minHeight: 44,
  minWidth: 44,
  width: 44,
  px: 0,
  borderRadius: 999,
  cursor: "default",
  color: "text.primary",
  "& .MuiSvgIcon-root": { fontSize: 20 },
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

export default function DemoDock() {
  const dockRef = useRef(null);
  const themeButtonRef = useRef(null);
  const outlinesButtonRef = useRef(null);
  const { mode, systemMode, setMode } = useColorScheme();
  const [container, setContainer] = useState(null);
  const [outlines, setOutlines] = useState(true);
  const [tooltip, setTooltip] = useState(null);
  const dark = (mode === "system" ? systemMode : mode) === "dark";

  useEffect(() => {
    document.documentElement.dataset.surveyOutlines = String(outlines);
  }, [outlines]);

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
    if (event.key === "Escape" && tooltip) {
      setTooltip(null);
      event.stopPropagation();
      return;
    }
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const themeButton = themeButtonRef.current;
    const outlinesButton = outlinesButtonRef.current;
    const buttons = [outlinesButton, themeButton];
    const index = buttons.indexOf(document.activeElement);
    const step = event.key === "ArrowRight" ? 1 : -1;
    const next = buttons[(index + step + buttons.length) % buttons.length];
    const target = event.key === "Home" ? outlinesButton : event.key === "End" ? themeButton : next;
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
        onKeyDown={moveFocus}
      >
        <div className="demo-dock-panel">
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
            <IconButton
              ref={outlinesButtonRef}
              type="button"
              className="demo-dock__button"
              sx={dockButtonSx}
              aria-pressed={outlines}
              aria-label="Highlight SurveyJS"
              onClick={() => setOutlines((value) => !value)}
            >
              <CropFreeIcon />
            </IconButton>
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
            <IconButton
              ref={themeButtonRef}
              type="button"
              className="demo-dock__button"
              sx={dockButtonSx}
              aria-label="Switch Theme"
              onClick={() => setMode(dark ? "light" : "dark")}
            >
              {dark ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
          </Tooltip>
        </div>
      </div>
    </Portal>
  );
}
