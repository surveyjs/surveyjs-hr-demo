import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useApp } from "../app/AppContext.jsx";
import DemoResetPanel from "./DemoResetPanel.jsx";

export default function SettingsPage() {
  const { customForms, openSchemaCreator, openCustomCreator } = useApp();

  return (
    <Stack spacing={3}>
      <div>
        <Typography variant="h4" sx={{ mb: 1.5 }}>Settings</Typography>
        <Typography variant="body2" color="text.secondary">
          Manage SurveyJS form schemas and the saved demo state.
        </Typography>
      </div>
      <Paper sx={{ p: { xs: 2, md: 3 } }}>
        <Typography variant="h6" sx={{ mb: 1.5 }}>Form Builder Tools</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Open SurveyJS Creator to change a form. Saved schemas stay in effect for this browser session.
        </Typography>
        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
          <Button type="button" variant="outlined" onClick={() => openSchemaCreator("editEmployee", "Customize Employee Form")}>
            Customize Employee Form
          </Button>
          <Button type="button" variant="outlined" onClick={() => openSchemaCreator("addReview", "Customize Review Form")}>
            Customize Review Form
          </Button>
          <Button type="button" variant="outlined" onClick={() => openSchemaCreator("addLeave", "Customize Leave Request Form")}>
            Customize Leave Request Form
          </Button>
          <Button type="button" variant="contained" onClick={() => openCustomCreator(null)}>
            Create New Onboarding Form
          </Button>
        </Stack>
        {customForms.length > 0 ? (
          <Stack spacing={1} sx={{ mt: 2 }}>
            <Typography variant="subtitle2" component="p">Saved custom forms</Typography>
            {customForms.map((form) => (
              <Stack key={form.id} direction="row" spacing={1} alignItems="center">
                <Typography variant="body2" sx={{ flex: 1 }}>{form.title || "Untitled form"}</Typography>
                <Button type="button" size="small" onClick={() => openCustomCreator(form)}>Reopen</Button>
              </Stack>
            ))}
          </Stack>
        ) : null}
      </Paper>
      <DemoResetPanel />
    </Stack>
  );
}
