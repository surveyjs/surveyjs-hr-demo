import { useRef } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { ActionContainer, SvgRegistry } from "survey-core";
import { useApp } from "../app/AppContext.jsx";
import DemoResetPanel from "./DemoResetPanel.jsx";
import EmployeeCard from "./EmployeeCard.jsx";
import { searchDemoData } from "../data/demoFormData.js";
import SurveyForm, { prefillSurvey } from "./SurveyForm.jsx";

SvgRegistry.registerIcon(
  "icon-hr-settings",
  `<svg viewBox="0 0 24 24"><g fill="none" stroke="var(--sd-action-icon-color, currentColor)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></g></svg>`
);

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
  handlers.setCriteria = setCriteria;
  handlers.clearSearch = clearSearch;
  handlers.openSchemaCreator = openSchemaCreator;
  const formDataRef = useRef(criteria);
  const formResetRef = useRef(searchResetKey);
  if (formResetRef.current !== searchResetKey) {
    formResetRef.current = searchResetKey;
    formDataRef.current = criteria;
  }
  const schema = schemas.search;

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" sx={{ mb: 1.5 }}>Manage Employees</Typography>
        <Typography variant="body2" color="text.secondary">
          Search by name, date of birth, or employee ID. A first name, a last name, or both will match. Every field is optional.
        </Typography>
      </Box>
      <Paper sx={{ p: 0 }}>
        {schema ? (
          <SurveyForm
            schema={schema}
            data={formDataRef.current}
            resetKey={searchResetKey}
            elementIdPrefix="search_"
            hostId="survey-search"
            configure={configureSearch}
            onValueChanged={(data) => setCriteria(data)}
            onCompleting={() => ({ allow: false })}
          />
        ) : (
          <Alert severity="error">Search for an Employee.json is missing.</Alert>
        )}
      </Paper>
      {searchResults == null ? (
        <Paper sx={{ p: { xs: 2, md: 3 } }}>
          <Typography variant="body2" color="text.secondary">
            The directory lists every employee while the search fields stay empty. Try Emma or Thompson to narrow it.
          </Typography>
        </Paper>
      ) : searchResults.length === 0 ? (
        <Paper sx={{ p: { xs: 2, md: 3 } }}>
          <Typography variant="h5" sx={{ mb: 1.5 }}>No employees found</Typography>
          <Typography variant="body2" color="text.secondary">
            No records match these criteria. Clear the fields to list everyone.
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
      <DemoResetPanel />
    </Stack>
  );
}

function configureSearch(model) {
  model.description = "";
  const page = model.pages[0];
  if (page) page.description = "";
  model.headerView = "basic";
  const toolbar = new ActionContainer();
  toolbar.setActionsAppearance({ mode: "tertiary-surface", size: "large", style: "brand", showBorder: true });
  toolbar.cssClasses = { ...model.navigationBar.cssClasses, root: "sd-action-bar search-header-actions" };
  toolbar.setItems([
    {
      id: "prefill-search",
      title: "Prefill demo data",
      showTitle: true,
      disableShrink: true,
      action: () => {
        const data = structuredClone(searchDemoData);
        prefillSurvey(model, data);
        handlers.setCriteria(data);
      }
    },
    {
      id: "edit-search-form",
      title: "Edit Search Form",
      iconName: "icon-hr-settings",
      iconSize: 20,
      showTitle: true,
      disableShrink: true,
      action: () => handlers.openSchemaCreator("search", "Edit Search Form")
    }
  ]);
  model.addLayoutElement({
    id: "search-header-actions",
    container: "header",
    component: "sv-action-bar",
    data: toolbar
  });
  model.addNavigationItem({
    id: "clear-filters",
    title: "Clear filters",
    css: "search-clear",
    action: () => handlers.clearSearch()
  });
}

const handlers = {
  setCriteria() {},
  clearSearch() {},
  openSchemaCreator() {}
};
