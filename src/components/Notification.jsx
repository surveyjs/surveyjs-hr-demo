import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { useApp } from "../app/AppContext.jsx";

export default function Notification() {
  const { notice, clearNotice } = useApp();
  return (
    <Snackbar
      open={Boolean(notice)}
      autoHideDuration={5000}
      onClose={clearNotice}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      {notice ? (
        <Alert severity={notice.severity || "success"} variant="filled" onClose={clearNotice} sx={{ width: "100%" }}>
          {notice.message}
        </Alert>
      ) : undefined}
    </Snackbar>
  );
}
