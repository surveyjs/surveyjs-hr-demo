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
import { choiceLabel, formatMoney, fullName } from "../utils/records.js";

export default function PayrollDirectory() {
  const { employees, schemas, openPayroll, currentUser } = useApp();
  const ownRecord = currentUser?.role === "employee";
  const visible = ownRecord
    ? employees.filter((employee) => employee.id === currentUser.employeeId)
    : employees;
  const rows = [...visible].sort((a, b) => fullName(a).localeCompare(fullName(b)));

  return (
    <>
      <Typography variant="h4" sx={{ mb: 1.5 }}>Payroll</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {ownRecord
          ? "Your salary and payment history."
          : "Salaries for every employee. Open a row to see payment history and edit that salary."}
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Employee</TableCell>
              <TableCell>Employee ID</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Salary</TableCell>
              <TableCell>Frequency</TableCell>
              <TableCell align="right"> </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((employee) => {
              const salary = employee.salary;
              return (
                <TableRow key={employee.id} hover>
                  <TableCell>{fullName(employee)}</TableCell>
                  <TableCell>{employee.employee_id}</TableCell>
                  <TableCell>{choiceLabel(schemas.editEmployee, "department", employee.department, employee)}</TableCell>
                  <TableCell>{salary ? formatMoney(salary.amount, salary.currency) : "Not set"}</TableCell>
                  <TableCell>{choiceLabel(schemas.editSalary, "pay_frequency", salary?.pay_frequency, salary)}</TableCell>
                  <TableCell align="right">
                    <Button type="button" size="small" onClick={() => openPayroll(employee.id)}>
                      Open
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
