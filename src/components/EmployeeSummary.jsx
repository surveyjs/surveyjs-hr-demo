import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { choiceLabel, formatDate, fullName, initials } from "../utils/records.js";

export default function EmployeeSummary({ employee, labelSchema }) {
  return (
    <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ md: "center" }}>
      <Avatar sx={{ width: 72, height: 72, bgcolor: "primary.main", fontSize: 28 }}>{initials(employee)}</Avatar>
      <Box sx={{ flex: 1 }}>
        <Stack direction="row" spacing={1} alignItems="center" useFlexGap flexWrap="wrap">
          <Typography variant="h4">{fullName(employee)}</Typography>
          <Chip size="small" color="success" label={employee.status === "active" ? "Active" : employee.status || "Active"} />
        </Stack>
        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
          {choiceLabel(labelSchema, "job_title", employee.job_title, employee)}
        </Typography>
        <Stack direction="row" spacing={2} useFlexGap flexWrap="wrap" sx={{ mt: 1 }}>
          <Typography variant="body2">Born {formatDate(employee.date_of_birth)}</Typography>
          <Typography variant="body2">ID {employee.employee_id}</Typography>
          <Typography variant="body2">{choiceLabel(labelSchema, "department", employee.department, employee)}</Typography>
          <Typography variant="body2">Hired {formatDate(employee.start_date)}</Typography>
        </Stack>
      </Box>
    </Stack>
  );
}
