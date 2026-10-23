import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { useApp } from "../app/AppContext.jsx";
import { choiceLabel, fullName } from "../utils/records.js";

function benefitSummary(employee, schema) {
  const benefits = employee.benefits || [];
  if (benefits.length === 0) return "None";
  return benefits
    .map((benefit) => choiceLabel(schema, "benefit_type", benefit.benefit_type, benefit))
    .join(", ");
}

export default function BenefitsDirectory() {
  const { employees, schemas, openBenefits, currentUser } = useApp();
  const ownRecord = currentUser?.role === "employee";
  const visible = ownRecord
    ? employees.filter((employee) => employee.id === currentUser.employeeId)
    : employees;
  const rows = [...visible].sort((a, b) => fullName(a).localeCompare(fullName(b)));

  return (
    <>
      <Typography variant="h4" sx={{ mb: 1.5 }}>Benefits</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {ownRecord
          ? "Your benefit enrollments."
          : "Benefit enrollments for every employee. Open a row to review or change that employee's benefits."}
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Employee</TableCell>
              <TableCell>Employee ID</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Benefits</TableCell>
              <TableCell align="right"> </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((employee) => (
              <TableRow key={employee.id} hover>
                <TableCell>{fullName(employee)}</TableCell>
                <TableCell>{employee.employee_id}</TableCell>
                <TableCell>{choiceLabel(schemas.editEmployee, "department", employee.department, employee)}</TableCell>
                <TableCell>{benefitSummary(employee, schemas.addBenefit)}</TableCell>
                <TableCell align="right">
                  <Button type="button" size="small" onClick={() => openBenefits(employee.id)}>
                    Open
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
