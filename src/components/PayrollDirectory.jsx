import { useState } from "react";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { useApp } from "../app/AppContext.jsx";
import { choiceLabel, formatMoney, fullName, searchEmployees } from "../utils/records.js";
import EmployeeSearchPanel from "./EmployeeSearchPanel.jsx";

export default function PayrollDirectory() {
  const { employees, schemas, openPayroll, currentUser } = useApp();
  const [criteria, setCriteria] = useState({});
  const [resetKey, setResetKey] = useState(0);
  const ownRecord = currentUser?.role === "employee";
  const visible = ownRecord
    ? employees.filter((employee) => employee.id === currentUser.employeeId)
    : employees;
  const rows = searchEmployees(visible, criteria)
    .sort((a, b) => fullName(a).localeCompare(fullName(b)));

  return (
    <Stack spacing={3}>
      <div>
        <Typography variant="h4" sx={{ mb: 1.5 }}>Payroll</Typography>
        <Typography variant="body2" color="text.secondary">
          {ownRecord
            ? "Your salary and payment history."
            : "Salaries for every employee. Open a row to see payment history and edit that salary."}
        </Typography>
      </div>
      <EmployeeSearchPanel
        criteria={criteria}
        resetKey={resetKey}
        onChange={setCriteria}
        onClear={() => {
          setCriteria({});
          setResetKey((value) => value + 1);
        }}
        elementIdPrefix="payroll_search_"
      />
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
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6}>No records match these criteria. Clear the fields to list everyone.</TableCell>
              </TableRow>
            ) : null}
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
    </Stack>
  );
}
