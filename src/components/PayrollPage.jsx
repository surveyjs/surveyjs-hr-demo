import { useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useApp } from "../app/AppContext.jsx";
import { byDateDesc, choiceLabel, formatDate, formatMoney, toPanelRecords } from "../utils/records.js";
import EmployeeSummary from "./EmployeeSummary.jsx";
import SalaryForm from "./SalaryForm.jsx";
import SurveyForm from "./SurveyForm.jsx";

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

export default function PayrollPage() {
  const { currentUser, selectedEmployee, schemas, setView } = useApp();
  const [salaryOpen, setSalaryOpen] = useState(false);
  const isEmployee = currentUser?.role === "employee";

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
  const salary = employee.salary;
  const payments = [...(employee.payments || [])].sort(byDateDesc("pay_date"));
  const panelData = { payment_list: toPanelRecords(payments) };

  return (
    <Stack spacing={3}>
      <Button type="button" startIcon={<ArrowBackIcon />} onClick={() => setView("profile")} sx={{ alignSelf: "flex-start" }}>
        Profile
      </Button>
      <Paper sx={{ p: { xs: 2, md: 3 } }}>
        <EmployeeSummary employee={employee} labelSchema={labelSchema} />
        {isEmployee ? null : (
          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mt: 2 }}>
            <Button type="button" variant="contained" onClick={() => setSalaryOpen(true)}>Edit Salary</Button>
          </Stack>
        )}
      </Paper>
      <Section title="Salary">
        <Detail label="Salary" value={salary ? formatMoney(salary.amount, salary.currency) : "Not set"} />
        <Detail label="Currency" value={salary?.currency} />
        <Detail
          label="Payment frequency"
          value={choiceLabel(schemas.editSalary, "pay_frequency", salary?.pay_frequency, salary)}
        />
      </Section>
      <Section title="Payment History">
        {payments.length === 0 ? (
          <Typography color="text.secondary">No payments yet.</Typography>
        ) : (
          <Stack spacing={2}>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2 }}>
              {payments.map((payment) => (
                <Paper key={payment.id} variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle1">{formatDate(payment.pay_date)}</Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {formatMoney(payment.amount, salary?.currency)}
                  </Typography>
                </Paper>
              ))}
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                Payment history from the payroll dynamic panel. Saved payments are read-only here.
              </Typography>
              <SurveyForm
                schema={schemas.paymentPanel}
                data={panelData}
                readOnly
                elementIdPrefix={`payments_${employee.id}_`}
                configure={(model) => { model.showTitle = false; }}
              />
            </Box>
          </Stack>
        )}
      </Section>
      {isEmployee ? null : <SalaryForm open={salaryOpen} onClose={() => setSalaryOpen(false)} />}
    </Stack>
  );
}
