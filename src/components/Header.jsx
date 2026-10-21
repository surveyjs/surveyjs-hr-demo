import GroupsIcon from "@mui/icons-material/Groups";
import LogoutIcon from "@mui/icons-material/Logout";
import Avatar from "@mui/material/Avatar";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useApp } from "../app/AppContext.jsx";
import { userInitials } from "../data/demoUsers.js";

const HR_NAV = [
  { id: "manage", label: "Manage Employees", view: "manage" },
  { id: "register", label: "Register Employee", view: "register" },
  { id: "payroll", label: "Payroll", view: "payroll", requiresProfile: true },
  { id: "benefits", label: "Benefits", view: "benefits", requiresProfile: true }
];

const EMPLOYEE_NAV = [
  { id: "profile", label: "My Profile", view: "profile" },
  { id: "payroll", label: "Payroll", view: "payroll", requiresProfile: true },
  { id: "benefits", label: "Benefits", view: "benefits", requiresProfile: true }
];

export default function Header() {
  const { view, setView, openIndex, currentUser, logout } = useApp();
  const nav = currentUser?.role === "employee" ? EMPLOYEE_NAV : HR_NAV;

  const select = (item) => {
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
            const profileOpen = view === "profile" || view === "payroll" || view === "benefits";
            const disabled = Boolean(item.requiresProfile && !profileOpen);
            const selected = item.view === view || (item.id === "manage" && view === "profile");
            const button = (
              <Button
                key={item.id}
                type="button"
                variant="text"
                disabled={disabled}
                aria-current={selected ? "page" : undefined}
                onClick={() => select(item)}
                sx={disabled ? undefined : {
                  color: selected ? "primary.main" : "text.primary",
                  bgcolor: selected ? "var(--hr-selected-wash)" : "transparent",
                  "&:hover": {
                    bgcolor: selected ? "var(--hr-selected-wash)" : "action.hover"
                  }
                }}
              >
                {item.label}
              </Button>
            );
            if (!disabled) return button;
            return (
              <Tooltip key={item.id} title="Open an employee profile first.">
                <span>{button}</span>
              </Tooltip>
            );
          })}
        </Stack>
        ) : null}
        <Box sx={{ flexGrow: 1 }} />
        {currentUser ? (
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ ml: "auto" }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.main", fontSize: 14 }}>
              {userInitials(currentUser)}
            </Avatar>
            <Typography variant="body2">{currentUser.fullName}</Typography>
            <Box aria-hidden="true" sx={{ width: "1px", height: 18, bgcolor: "divider" }} />
            <IconButton
              type="button"
              aria-label="Log out"
              onClick={logout}
              size="small"
              sx={{
                color: "text.secondary",
                "&:hover": { color: "primary.main", bgcolor: "transparent" }
              }}
            >
              <LogoutIcon fontSize="small" />
            </IconButton>
          </Stack>
        ) : (
          <Typography variant="body2" color="text.secondary">Local demo</Typography>
        )}
      </Toolbar>
    </AppBar>
  );
}
