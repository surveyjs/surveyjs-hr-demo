import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { choiceLabel, formatDate, formatPhone, fullName, initials } from "../utils/records.js";

function Fact({ label, value }) {
  return (
    <Typography variant="body2" color="text.secondary">
      <Box component="span" sx={{ color: "text.primary", fontWeight: 600 }}>{label}: </Box>
      {value || "—"}
    </Typography>
  );
}

export default function EmployeeCard({ employee, schema, onOpen }) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ sm: "flex-start" }}>
          <Avatar sx={{ bgcolor: "primary.main", width: 52, height: 52 }}>{initials(employee)}</Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6">{fullName(employee)}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {choiceLabel(schema, "job_title", employee.job_title, employee)}
            </Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 0.5 }}>
              <Fact label="Date of birth" value={formatDate(employee.date_of_birth)} />
              <Fact label="Employee ID" value={employee.employee_id} />
              <Fact label="Department" value={choiceLabel(schema, "department", employee.department, employee)} />
              <Fact label="Phone" value={formatPhone(employee.phone_number)} />
            </Box>
          </Box>
          <Button type="button" variant="contained" onClick={() => onOpen(employee.id)}>Open Profile</Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
