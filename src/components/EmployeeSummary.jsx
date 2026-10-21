import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { choiceLabel, formatDate, fullName, initials } from "../utils/records.js";

export default function EmployeeSummary({ employee, labelSchema }) {
  return (
    <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ md: "center" }}>
      <Avatar sx={{ width: 72, height: 72, bgcolor: "primary.main", fontSize: 24 }}>{initials(employee)}</Avatar>
      <Box sx={{ flex: 1 }}>
        <Typography variant="h5">{fullName(employee)}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {choiceLabel(labelSchema, "job_title", employee.job_title, employee)}
        </Typography>
        <Stack direction="row" spacing={2} useFlexGap flexWrap="wrap" sx={{ mt: 1 }}>
          <Typography variant="body2" color="text.secondary">Born {formatDate(employee.date_of_birth)}</Typography>
          <Typography variant="body2" color="text.secondary">ID {employee.employee_id}</Typography>
          <Typography variant="body2" color="text.secondary">{choiceLabel(labelSchema, "department", employee.department, employee)}</Typography>
          <Typography variant="body2" color="text.secondary">Hired {formatDate(employee.start_date)}</Typography>
        </Stack>
      </Box>
    </Stack>
  );
}
