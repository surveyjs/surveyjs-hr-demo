import { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { demoExamples } from "./demoExamples";

export default function DemoMenu({ dockRef, buttonRef, buttonSx, open, setOpen }) {
  const [tooltip, setTooltip] = useState(false);
  const close = (restoreFocus = false) => {
    setOpen(false);
    if (restoreFocus) buttonRef.current?.focus();
  };

  return (
    <>
      <Tooltip
        title="Switch Demo"
        open={!open && tooltip}
        onOpen={() => setTooltip(true)}
        onClose={() => setTooltip(false)}
        enterDelay={150}
        enterNextDelay={150}
        placement="top"
        describeChild
        slotProps={{ popper: { container: () => dockRef.current } }}
      >
        <Button
          ref={buttonRef}
          sx={{ ...buttonSx, width: "auto", minWidth: 0, maxWidth: "calc(100vw - 138px)", px: 1.25, gap: 0.75, "& .MuiSvgIcon-root": { fontSize: 18 }, fontSize: 11, fontWeight: 500, letterSpacing: 0.5, textTransform: "uppercase" }}
          aria-label="Human Resources"
          aria-haspopup="menu"
          aria-controls={open ? "demo-examples" : undefined}
          aria-expanded={open}
          onClick={() => { setTooltip(false); setOpen(!open); }}
          onKeyDown={(event) => {
            if (["ArrowDown", "ArrowUp"].includes(event.key)) {
              event.preventDefault();
              event.stopPropagation();
              setOpen(true);
            } else if (event.key === "Escape" && tooltip) {
              setTooltip(false);
              event.stopPropagation();
            }
          }}
        >
          <MenuIcon />
          <Box component="span" sx={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Human Resources</Box>
          <KeyboardArrowDownIcon sx={{ opacity: 0.6 }} />
        </Button>
      </Tooltip>
      <Popper
        role="presentation"
        open={open}
        anchorEl={buttonRef.current}
        container={() => dockRef.current}
        placement="top-start"
        modifiers={[
          { name: "offset", options: { offset: [0, 8] } },
          { name: "preventOverflow", options: { padding: 13, rootBoundary: "viewport" } },
          { name: "flip", options: { padding: 13 } }
        ]}
        sx={{ zIndex: 1 }}
      >
        <ClickAwayListener onClickAway={(event) => {
          if (!buttonRef.current?.contains(event.target)) close();
        }}>
          <Paper elevation={8} sx={{ width: 384, maxWidth: "calc(100vw - 26px)", maxHeight: "calc(100dvh - 110px)", overflowY: "auto" }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1, px: 2, py: 1 }}>
              <Typography variant="caption" color="text.secondary">SurveyJS in your app</Typography>
              <Chip label="Full" size="small" sx={{ height: 22, fontSize: 12 }} />
            </Box>
            <Divider />
            <MenuList
              id="demo-examples"
              aria-label="More Examples"
              autoFocusItem={open}
              onKeyDown={(event) => {
                event.stopPropagation();
                if (event.key === "Escape") {
                  event.preventDefault();
                  close(true);
                } else if (event.key === "Tab") close(true);
              }}
            >
              {demoExamples.flatMap((example, index) => {
                const current = example.id === "humanResources";
                const startsGroup = index > 0 && example.group !== demoExamples[index - 1].group;
                return [
                  ...(startsGroup ? [<Divider key={`${example.id}-divider`} />] : []),
                  <MenuItem
                    key={example.id}
                    component="a"
                    href={current ? "/manage" : example.href}
                    target={current ? undefined : "_blank"}
                    rel={current ? undefined : "noreferrer"}
                    selected={current}
                    aria-current={current ? "page" : undefined}
                    onClick={() => close()}
                    sx={{ display: "block", whiteSpace: "normal", cursor: "default", py: 1 }}
                  >
                    <Typography variant="body2" fontWeight={500} color={current ? "primary" : "text.primary"} sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                      {example.name}
                      {!current && <OpenInNewIcon sx={{ fontSize: 12, color: "text.secondary" }} />}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">{example.description}</Typography>
                  </MenuItem>
                ];
              })}
              <Divider />
              <MenuItem component="a" href="https://surveyjs.io/use-cases" target="_blank" rel="noreferrer" onClick={() => close()} sx={{ cursor: "default", typography: "body2", fontWeight: 500, gap: 0.75 }}>
                More Use Cases
                <OpenInNewIcon sx={{ fontSize: 12, color: "text.secondary" }} />
              </MenuItem>
            </MenuList>
          </Paper>
        </ClickAwayListener>
      </Popper>
    </>
  );
}
