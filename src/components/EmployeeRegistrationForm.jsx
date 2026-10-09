import { useRef, useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useApp } from "../app/AppContext.jsx";
import { employeeIdTaken, fullName } from "../utils/records.js";
import SurveyForm, { completeSurvey } from "./SurveyForm.jsx";

export default function EmployeeRegistrationForm() {
  const { employees, schemas, registerEmployee, openProfile, openSchemaCreator, notify } = useApp();
  const surveyRef = useRef(null);
  const [resetKey, setResetKey] = useState(0);
  const [created, setCreated] = useState(null);
  const schema = schemas.registration;

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" gutterBottom>Register Employee</Typography>
        <Typography color="text.secondary">
          Add a person to the Acme directory. Required fields and input masks come from the registration form.
        </Typography>
      </Box>
      {created ? (
        <Alert
          severity="success"
          action={(
            <Button type="button" color="inherit" size="small" onClick={() => openProfile(created.id)}>
              Open Profile
            </Button>
          )}
        >
          {fullName(created)} is now in the directory as {created.employee_id}.
        </Alert>
      ) : null}
      <Paper sx={{ p: { xs: 2, md: 3 } }}>
        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mb: 1 }}>
          <Button type="button" variant="contained" onClick={() => completeSurvey(surveyRef.current)}>
            {schema?.completeText || "Save Employee"}
          </Button>
          <Button
            type="button"
            variant="outlined"
            onClick={() => {
              setCreated(null);
              setResetKey((value) => value + 1);
            }}
          >
            Reset
          </Button>
          <Button type="button" onClick={() => openSchemaCreator("registration", "Customize Registration Form")}>
            Customize Registration Form
          </Button>
        </Stack>
        {schema ? (
          <SurveyForm
            schema={schema}
            resetKey={resetKey}
            elementIdPrefix="register_"
            onModel={(model) => { surveyRef.current = model; }}
            onCompleting={(data) => {
              if (employeeIdTaken(employees, data.employee_id)) {
                notify("An employee with this Employee ID already exists.", "error");
                return { allow: false };
              }
              return { allow: true };
            }}
            onComplete={(data) => {
              const result = registerEmployee(data);
              if (!result.ok) {
                notify(result.message, "error");
                return;
              }
              setCreated(result.employee);
              setResetKey((value) => value + 1);
              notify(`${fullName(result.employee)} was registered.`);
            }}
          />
        ) : (
          <Alert severity="error">Employee Registration Form.json is missing.</Alert>
        )}
      </Paper>
    </Stack>
  );
}
