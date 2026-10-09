import { useRef } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useApp } from "../app/AppContext.jsx";
import EmployeeCard from "./EmployeeCard.jsx";
import SurveyForm, { completeSurvey } from "./SurveyForm.jsx";

export default function EmployeeSearchForm() {
  const {
    schemas,
    criteria,
    setCriteria,
    searchResults,
    searchResetKey,
    clearSearch,
    openProfile,
    openSchemaCreator
  } = useApp();
  const surveyRef = useRef(null);
  const schema = schemas.search;

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" gutterBottom>Manage Employees</Typography>
        <Typography color="text.secondary">
          Find an employee by surname together with a date of birth or an employee ID.
        </Typography>
      </Box>
      <Paper sx={{ p: { xs: 2, md: 3 } }}>
        {schema ? (
          <SurveyForm
            schema={schema}
            data={criteria}
            resetKey={searchResetKey}
            elementIdPrefix="search_"
            onModel={(model) => { surveyRef.current = model; }}
            onCompleting={(data) => {
              setCriteria(structuredClone(data));
              return { allow: false };
            }}
          />
        ) : (
          <Alert severity="error">Search for an Employee.json is missing.</Alert>
        )}
        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
          <Button type="button" variant="contained" onClick={() => completeSurvey(surveyRef.current)}>
            {schema?.completeText || "Search"}
          </Button>
          <Button type="button" variant="outlined" onClick={clearSearch}>Clear</Button>
          <Button type="button" onClick={() => openSchemaCreator("search", "Customize Search Form")}>
            Customize Search Form
          </Button>
        </Stack>
      </Paper>
      {searchResults == null ? (
        <Paper sx={{ p: 3 }}>
          <Typography color="text.secondary">
            Results appear here after a search. Try surname Thompson and employee ID EMP-1002.
          </Typography>
        </Paper>
      ) : searchResults.length === 0 ? (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6">No employees found</Typography>
          <Typography color="text.secondary">
            No records match this surname and date of birth or employee ID. Check the criteria, or clear the form and search again.
          </Typography>
        </Paper>
      ) : (
        <Stack spacing={1.5}>
          <Typography variant="body2" color="text.secondary">
            {searchResults.length === 1 ? "1 employee found" : `${searchResults.length} employees found`}
          </Typography>
          {searchResults.map((employee) => (
            <EmployeeCard
              key={employee.id}
              employee={employee}
              schema={schemas.editEmployee}
              onOpen={openProfile}
            />
          ))}
        </Stack>
      )}
    </Stack>
  );
}
