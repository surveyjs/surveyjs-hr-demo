import CreatorButton from "./CreatorButton.jsx";
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
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1} useFlexGap flexWrap="wrap">
          <CreatorButton onClick={() => openSchemaCreator("editEmployee", "Edit Employee Form")}>
            Edit Employee Form
          </CreatorButton>
          <CreatorButton onClick={() => openSchemaCreator("addReview", "Edit Review Form")}>
            Edit Review Form
          </CreatorButton>
          <CreatorButton onClick={() => openSchemaCreator("addLeave", "Edit Leave Request Form")}>
            Edit Leave Request Form
          </CreatorButton>
          <CreatorButton onClick={() => openCustomCreator(null)}>
            Create New Onboarding Form
          </CreatorButton>
        </Stack>
        {customForms.length > 0 ? (
          <Stack spacing={1} sx={{ mt: 2 }}>
            <Typography variant="subtitle2" component="p">Saved custom forms</Typography>
            {customForms.map((form) => (
              <Stack key={form.id} direction={{ xs: "column", sm: "row" }} spacing={1} alignItems={{ xs: "stretch", sm: "center" }}>
                <Typography variant="body2" sx={{ flex: 1 }}>{form.title || "Untitled form"}</Typography>
                <CreatorButton onClick={() => openCustomCreator(form)}>Edit in Creator</CreatorButton>
              </Stack>
            ))}
          </Stack>
        ) : null}
      </Paper>
      <DemoResetPanel />
    </Stack>
  );
}
