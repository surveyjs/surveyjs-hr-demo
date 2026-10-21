import { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useApp } from "../app/AppContext.jsx";

export default function DemoResetPanel() {
  const { resetDemoData } = useApp();
  const [open, setOpen] = useState(false);

  const confirm = () => {
    resetDemoData();
    setOpen(false);
  };

  return (
    <Paper sx={{ p: { xs: 2, md: 3 } }}>
      <Typography variant="h6">Demo State & Data Persistence</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        Employee records and customized forms are saved in this browser.
      </Typography>
      <Button type="button" color="error" sx={{ mt: 2 }} onClick={() => setOpen(true)}>
        Reset All Demo Data to Default
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} aria-labelledby="reset-demo-title">
        <DialogTitle id="reset-demo-title">Reset All Demo Data to Default</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Restore the local demo to its starting state. This resets employees, form changes, and custom onboarding forms saved in this browser.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button type="button" onClick={() => setOpen(false)}>Cancel</Button>
          <Button type="button" color="error" variant="contained" onClick={confirm}>Reset to Default</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
