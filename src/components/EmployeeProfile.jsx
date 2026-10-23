import { useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Link as RouterLink } from "react-router-dom";
import { useApp } from "../app/AppContext.jsx";
import {
  choiceLabel,
  formatAddress,
  formatDate,
  formatPhone
} from "../utils/records.js";
import BenefitForm from "./BenefitForm.jsx";
import EmployeeEditDrawer from "./EmployeeEditDrawer.jsx";
import EmployeeSummary from "./EmployeeSummary.jsx";
import LeaveRequestForm from "./LeaveRequestForm.jsx";
import LeaveRequestList from "./LeaveRequestList.jsx";
import PerformanceReviewForm from "./PerformanceReviewForm.jsx";
import PerformanceReviewList from "./PerformanceReviewList.jsx";
import SalaryForm from "./SalaryForm.jsx";

function Detail({ label, value }) {
  return (
    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "180px 1fr" }, gap: 0.5, py: 1 }}>
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
    currentUser,
    selectedEmployee,
    schemas
  } = useApp();
  const isEmployee = currentUser?.role === "employee";
  const [editOpen, setEditOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [leaveRequest, setLeaveRequest] = useState(null);
  const [salaryOpen, setSalaryOpen] = useState(false);
  const [benefitOpen, setBenefitOpen] = useState(false);
  const openNewLeave = () => {
    setLeaveRequest(null);
    setLeaveOpen(true);
  };
  const openLeave = (request) => {
    setLeaveRequest(request);
    setLeaveOpen(true);
  };
  const closeLeave = () => {
    setLeaveOpen(false);
  };

  if (!selectedEmployee) {
    return (
      <Paper sx={{ p: { xs: 2, md: 3 } }}>
        <Typography variant="h5" sx={{ mb: isEmployee ? 0 : 1.5 }}>
          {isEmployee ? "No employee record is linked to this account." : "No employee selected"}
        </Typography>
        {isEmployee ? null : (
          <Button component={RouterLink} to="/manage" variant="contained">Manage Employees</Button>
        )}
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
      {isEmployee ? null : (
        <Button component={RouterLink} to="/manage" startIcon={<ArrowBackIcon />} sx={{ alignSelf: "flex-start" }}>
          Manage Employees
        </Button>
      )}
      <Paper sx={{ p: { xs: 2, md: 3 } }}>
        <EmployeeSummary employee={employee} labelSchema={labelSchema} />
        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mt: 2 }}>
          {isEmployee ? null : (
            <Button type="button" variant="contained" onClick={() => setEditOpen(true)}>Edit Employee</Button>
          )}
          {isEmployee ? null : (
            <Button type="button" variant="outlined" onClick={() => setSalaryOpen(true)}>Edit Salary</Button>
          )}
          {isEmployee ? null : (
            <Button type="button" variant="outlined" onClick={() => setBenefitOpen(true)}>Add Benefit</Button>
          )}
          {isEmployee ? null : (
            <Button type="button" variant="outlined" onClick={() => setReviewOpen(true)}>Add Performance Review</Button>
          )}
          <Button type="button" variant={isEmployee ? "contained" : "outlined"} onClick={openNewLeave}>
            Add Leave Request
          </Button>
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
          onSelect={isEmployee ? undefined : openLeave}
        />
      </Section>

      <EmployeeEditDrawer open={editOpen} onClose={() => setEditOpen(false)} />
      {isEmployee ? null : <SalaryForm open={salaryOpen} onClose={() => setSalaryOpen(false)} />}
      {isEmployee ? null : <BenefitForm open={benefitOpen} benefit={null} onClose={() => setBenefitOpen(false)} />}
      <PerformanceReviewForm open={reviewOpen} onClose={() => setReviewOpen(false)} />
      <LeaveRequestForm open={leaveOpen} request={leaveRequest} onClose={closeLeave} />
    </Stack>
  );
}
