import { useApp } from "../app/AppContext.jsx";
import FormDrawer from "./FormDrawer.jsx";

function toSalaryData(employee) {
  const salary = employee?.salary;
  if (!salary) return null;
  return {
    salary_amount: salary.amount,
    currency: salary.currency || "USD",
    pay_frequency: salary.pay_frequency || "monthly"
  };
}

export default function SalaryForm({ open, onClose }) {
  const { selectedEmployee, schemas, updateSalary, openSchemaCreator, notify } = useApp();
  const schema = schemas.editSalary;
  if (!selectedEmployee) return null;

  return (
    <FormDrawer
      open={open}
      title="Edit Salary"
      description="Update the salary amount, currency, and payment frequency."
      schema={schema}
      data={toSalaryData(selectedEmployee)}
      elementIdPrefix={`edit_salary_${selectedEmployee.id}_`}
      pdfDocument={{
        title: "Salary record",
        description: "This document records the salary payable to the employee, including the amount, the currency, and the payment frequency.",
        sectionTitle: "Compensation",
        footer: "Acme HR salary record."
      }}
      completeLabel={schema?.completeText || "Save Salary"}
      customizeLabel="Edit Salary Form"
      onClose={onClose}
      onCustomize={() => openSchemaCreator("editSalary", "Edit Salary Form")}
      configure={(model) => { model.showTitle = false; }}
      onComplete={(data) => {
        updateSalary(selectedEmployee.id, data);
        notify("Salary saved.");
        onClose();
      }}
    />
  );
}
