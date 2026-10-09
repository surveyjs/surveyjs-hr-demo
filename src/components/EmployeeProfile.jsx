import { useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useApp } from "../app/AppContext.jsx";
import {
  choiceLabel,
  formatAddress,
  formatDate,
  formatPhone,
  fullName,
  initials
} from "../utils/records.js";
import EmployeeEditDrawer from "./EmployeeEditDrawer.jsx";
import LeaveRequestForm from "./LeaveRequestForm.jsx";
import LeaveRequestList from "./LeaveRequestList.jsx";
import PerformanceReviewForm from "./PerformanceReviewForm.jsx";
import PerformanceReviewList from "./PerformanceReviewList.jsx";

function Detail({ label, value }) {
  return (
    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "180px 1fr" }, gap: 0.5, py: 0.75 }}>
      <Typography variant="body2" color="text.secondary">{label}</Typography>
      <Typography variant="body2">{value || "—"}</Typography>
    </Box>
  );
}

function Section({ title, children }) {
  return (
    <Paper sx={{ p: { xs: 2, md: 3 } }}>
      <Typography variant="h6" sx={{ mb: 1.5 }}>{title}</Typography>
      {children}
    </Paper>
  );
}

export default function EmployeeProfile() {
  const {
    selectedEmployee,
    schemas,
    customForms,
    setView,
    openSchemaCreator,
    openCustomCreator
  } = useApp();
  const [editOpen, setEditOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [leaveOpen, setLeaveOpen] = useState(false);

  if (!selectedEmployee) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>No employee selected</Typography>
        <Button type="button" variant="contained" onClick={() => setView("manage")}>Manage Employees</Button>
      </Paper>
    );
  }

  const employee = selectedEmployee;
  const labelSchema = schemas.editEmployee;
  const relationship = choiceLabel(
    labelSchema,
    "emergency_contact_relationship",
    employee.emergency_contact_relationship,
    employee
  );

  return (
    <Stack spacing={3}>
      <Button type="button" startIcon={<ArrowBackIcon />} onClick={() => setView("manage")} sx={{ alignSelf: "flex-start" }}>
        Manage Employees
      </Button>
      <Paper sx={{ p: { xs: 2, md: 3 } }}>
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
        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mt: 2 }}>
          <Button type="button" variant="contained" onClick={() => setEditOpen(true)}>Edit Employee</Button>
          <Button type="button" variant="outlined" onClick={() => setReviewOpen(true)}>Add Performance Review</Button>
          <Button type="button" variant="outlined" onClick={() => setLeaveOpen(true)}>Add Leave Request</Button>
        </Stack>
      </Paper>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2 }}>
        <Section title="Basic Details">
          <Detail label="Sex" value="Not collected" />
          <Detail label="Job title" value={choiceLabel(labelSchema, "job_title", employee.job_title, employee)} />
          <Detail label="Employee ID" value={employee.employee_id} />
          <Detail label="Date of birth" value={formatDate(employee.date_of_birth)} />
          <Detail label="Department" value={choiceLabel(labelSchema, "department", employee.department, employee)} />
          <Detail label="Hire date" value={formatDate(employee.start_date)} />
        </Section>
        <Section title="Contact Details">
          <Detail label="Phone" value={formatPhone(employee.phone_number)} />
          <Detail
            label="Work email"
            value={employee.work_email ? (
              <Link href={`mailto:${employee.work_email}`}>{employee.work_email}</Link>
            ) : "—"}
          />
          <Detail label="Address" value={formatAddress(employee)} />
          <Detail
            label="Emergency contact"
            value={[
              employee.emergency_contact_full_name,
              relationship !== "—" ? relationship : "",
              formatPhone(employee.emergency_contact_phone_number)
            ].filter((part) => part && part !== "—").join(" · ") || "—"}
          />
        </Section>
      </Box>

      <Section title="Performance Reviews">
        <PerformanceReviewList
          employee={employee}
          panelSchema={schemas.reviewsPanel}
          labelSchema={schemas.addReview}
        />
      </Section>
      <Section title="Leave Requests">
        <LeaveRequestList
          employee={employee}
          panelSchema={schemas.leavePanel}
          labelSchema={schemas.addLeave}
        />
      </Section>

      <Section title="Form Builder Tools">
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
            <Typography variant="subtitle2">Saved custom forms</Typography>
            {customForms.map((form) => (
              <Stack key={form.id} direction="row" spacing={1} alignItems="center">
                <Typography variant="body2" sx={{ flex: 1 }}>{form.title || "Untitled form"}</Typography>
                <Button type="button" size="small" onClick={() => openCustomCreator(form)}>Reopen</Button>
              </Stack>
            ))}
          </Stack>
        ) : null}
      </Section>

      <EmployeeEditDrawer open={editOpen} onClose={() => setEditOpen(false)} />
      <PerformanceReviewForm open={reviewOpen} onClose={() => setReviewOpen(false)} />
      <LeaveRequestForm open={leaveOpen} onClose={() => setLeaveOpen(false)} />
    </Stack>
  );
}
