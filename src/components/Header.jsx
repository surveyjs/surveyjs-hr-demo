import GroupsIcon from "@mui/icons-material/Groups";
import LogoutIcon from "@mui/icons-material/Logout";
import Avatar from "@mui/material/Avatar";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { useApp } from "../app/AppContext.jsx";
import { userInitials } from "../data/demoUsers.js";

const HR_NAV = [
  { id: "manage", label: "Manage Employees", to: "/manage", match: (path) => path === "/manage" || path.startsWith("/employees/") },
  { id: "register", label: "Register Employee", to: "/register" },
  { id: "payroll", label: "Payroll", to: "/payroll", match: (path) => path === "/payroll" || path.startsWith("/payroll/") },
  { id: "benefits", label: "Benefits", to: "/benefits", match: (path) => path === "/benefits" || path.startsWith("/benefits/") },
  { id: "settings", label: "Settings", to: "/settings" }
];

const EMPLOYEE_NAV = [
  { id: "profile", label: "My Profile", to: "/profile" },
  { id: "payroll", label: "Payroll", to: "/payroll", match: (path) => path === "/payroll" || path.startsWith("/payroll/") },
  { id: "benefits", label: "Benefits", to: "/benefits", match: (path) => path === "/benefits" || path.startsWith("/benefits/") }
];

export default function Header() {
  const { openIndex, currentUser, logout } = useApp();
  const { pathname } = useLocation();
  const nav = currentUser?.role === "employee" ? EMPLOYEE_NAV : HR_NAV;

  return (
    <AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: 1, borderColor: "divider" }}>
      <Toolbar sx={{ columnGap: { xs: 1, lg: 2 }, rowGap: { xs: 2, lg: 0 }, flexWrap: { xs: "wrap", lg: "nowrap" }, py: 1 }}>
        <Stack
          component="button"
          type="button"
          direction="row"
          spacing={1}
          alignItems="center"
          onClick={openIndex}
          aria-label="Acme HR"
          sx={{
            order: 1,
            mr: { xs: 0, lg: 1 },
            flexShrink: 0,
            minHeight: 44,
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
          <Typography variant="h6" component="div" noWrap>Acme HR</Typography>
        </Stack>
        {currentUser ? (
        <Stack
          direction="row"
          spacing={0.5}
          useFlexGap
          component="nav"
          aria-label="Primary"
          sx={{
            order: { xs: 3, lg: 2 },
            flexBasis: { xs: "100%", lg: "auto" },
            flexGrow: { xs: 0, lg: 1 },
            minWidth: 0,
            overflowX: "auto"
          }}
        >
          {nav.map((item) => {
            const selected = item.match ? item.match(pathname) : pathname === item.to;
            return (
              <Button
                key={item.id}
                component={RouterLink}
                to={item.to}
                variant="text"
                aria-current={selected ? "page" : undefined}
                sx={{
                  flexShrink: 0,
                  minHeight: 44,
                  whiteSpace: "nowrap",
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
          })}
        </Stack>
        ) : null}
        {currentUser ? (
          <Stack direction="row" spacing={{ xs: 1, sm: 1.5 }} alignItems="center" sx={{ order: { xs: 2, lg: 3 }, ml: "auto", minWidth: 0, maxWidth: { xs: "calc(100% - 132px)", sm: "none" } }}>
            <Avatar sx={(theme) => ({ display: { xs: "none", sm: "flex" }, width: theme.spacing(3), height: theme.spacing(3), bgcolor: "primary.main", fontSize: theme.typography.caption.fontSize })}>
              {userInitials(currentUser)}
            </Avatar>
            <Typography variant="body2" noWrap sx={{ fontSize: { xs: 12, sm: 14 } }}>{currentUser.fullName}</Typography>
            <Box aria-hidden="true" sx={{ width: "1px", height: 18, bgcolor: "divider", flexShrink: 0 }} />
            <IconButton
              type="button"
              aria-label="Log out"
              onClick={logout}
              size="small"
              sx={{
                flexShrink: 0,
                color: "text.secondary",
                "&:hover": { color: "primary.main", bgcolor: "transparent" }
              }}
            >
              <LogoutIcon fontSize="small" />
            </IconButton>
          </Stack>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ order: 2, ml: "auto" }}>Local demo</Typography>
        )}
      </Toolbar>
    </AppBar>
  );
}
