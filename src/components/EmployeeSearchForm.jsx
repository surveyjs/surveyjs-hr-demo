import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useApp } from "../app/AppContext.jsx";
import EmployeeCard from "./EmployeeCard.jsx";
import EmployeeSearchPanel from "./EmployeeSearchPanel.jsx";

export default function EmployeeSearchForm() {
  const {
    schemas,
    criteria,
    setCriteria,
    searchResults,
    searchResetKey,
    clearSearch,
    openProfile
  } = useApp();

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" sx={{ mb: 1.5 }}>Manage Employees</Typography>
        <Typography variant="body2" color="text.secondary">
          Search by name, department, or employee ID. Results update as you type.
        </Typography>
      </Box>
      <EmployeeSearchPanel
        criteria={criteria}
        resetKey={searchResetKey}
        onChange={setCriteria}
        onClear={clearSearch}
      />
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
    </Stack>
  );
}
