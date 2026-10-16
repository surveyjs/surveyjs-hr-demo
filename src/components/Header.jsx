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
import { userInitials } from "../data/demoUsers.js";

const HR_NAV = [
  { id: "register", label: "Register Employee", view: "register" },
  { id: "manage", label: "Manage Employees", view: "manage" },
  { id: "payroll", label: "Payroll", disabled: true, reason: "Payroll is outside this demo." },
  { id: "benefits", label: "Benefits", disabled: true, reason: "Benefits is outside this demo." },
  { id: "logout", label: "Log out" }
];

const EMPLOYEE_NAV = [
  { id: "profile", label: "My Profile", view: "profile" },
  { id: "logout", label: "Log out" }
];

export default function Header() {
  const { view, setView, openIndex, currentUser, logout } = useApp();
  const nav = currentUser?.role === "employee" ? EMPLOYEE_NAV : HR_NAV;

  const select = (item) => {
    if (item.id === "logout") {
      logout();
      return;
    }
    if (item.view === "manage") setView("manage");
    else setView(item.view);
  };

  return (
    <AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: 1, borderColor: "divider" }}>
      <Toolbar sx={{ gap: 2, flexWrap: "wrap", py: 1 }}>
        <Stack
          component="button"
          type="button"
          direction="row"
          spacing={1}
          alignItems="center"
          onClick={openIndex}
          aria-label="Acme HR"
          sx={{
            mr: 1,
            p: 0,
            border: 0,
            bgcolor: "transparent",
            color: "inherit",
            font: "inherit",
            cursor: "pointer"
          }}
        >
          <Avatar sx={{ bgcolor: "primary.main", width: 36, height: 36 }}>
            <GroupsIcon fontSize="small" />
          </Avatar>
          <Typography variant="h6" component="div">Acme HR</Typography>
        </Stack>
        {currentUser ? (
        <Stack direction="row" spacing={0.5} useFlexGap flexWrap="wrap" component="nav" aria-label="Primary">
          {nav.map((item) => {
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
        ) : null}
        <Box sx={{ flexGrow: 1 }} />
        {currentUser ? (
          <Stack direction="row" spacing={1} alignItems="center">
            <Avatar sx={{ width: 32, height: 32, bgcolor: "secondary.main", fontSize: 13 }}>
              {userInitials(currentUser)}
            </Avatar>
            <Typography variant="body2">{currentUser.fullName}</Typography>
          </Stack>
        ) : (
          <Typography variant="body2" color="text.secondary">Local demo</Typography>
        )}
      </Toolbar>
    </AppBar>
  );
}
