import GroupsIcon from "@mui/icons-material/Groups";
import Avatar from "@mui/material/Avatar";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useApp } from "../app/AppContext.jsx";

const NAV = [
  { id: "register", label: "Register Employee", view: "register" },
  { id: "manage", label: "Manage Employees", view: "manage" },
  { id: "payroll", label: "Payroll", disabled: true, reason: "Payroll is outside this demo." },
  { id: "benefits", label: "Benefits", disabled: true, reason: "Benefits is outside this demo." },
  { id: "logout", label: "Log out" }
];

export default function Header() {
  const { view, setView, notify } = useApp();

  const select = (item) => {
    if (item.id === "logout") {
      notify("Sign-out is unavailable in this demo.", "info");
      return;
    }
    if (item.view === "manage") setView(view === "profile" ? "manage" : "manage");
    else setView(item.view);
  };

  return (
    <AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: 1, borderColor: "divider" }}>
      <Toolbar sx={{ gap: 2, flexWrap: "wrap", py: 1 }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mr: 1 }}>
          <Avatar sx={{ bgcolor: "primary.main", width: 36, height: 36 }}>
            <GroupsIcon fontSize="small" />
          </Avatar>
          <Typography variant="h6" component="div">Acme HR</Typography>
        </Stack>
        <Stack direction="row" spacing={0.5} useFlexGap flexWrap="wrap" component="nav" aria-label="Primary">
          {NAV.map((item) => {
            const selected = item.view && (view === item.view || (item.view === "manage" && view === "profile"));
            const button = (
              <Button
                key={item.id}
                type="button"
                color="primary"
                variant={selected ? "contained" : "text"}
                disabled={item.disabled}
                aria-current={selected ? "page" : undefined}
                onClick={() => select(item)}
              >
                {item.label}
              </Button>
            );
            if (!item.disabled) return button;
            return (
              <Tooltip key={item.id} title={item.reason}>
                <span>{button}</span>
              </Tooltip>
            );
          })}
        </Stack>
        <Box sx={{ flexGrow: 1 }} />
        <Stack direction="row" spacing={1} alignItems="center">
          <Avatar sx={{ width: 32, height: 32, bgcolor: "secondary.main", fontSize: 13 }}>OC</Avatar>
          <Typography variant="body2">Olivia Carter</Typography>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
