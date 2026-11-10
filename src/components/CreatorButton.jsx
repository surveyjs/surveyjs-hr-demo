import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import Button from "@mui/material/Button";

export default function CreatorButton({ children, ...props }) {
  return (
    <Button type="button" variant="outlined" startIcon={<SettingsOutlinedIcon />} {...props}>
      {children}
    </Button>
  );
}
