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
      completeLabel={schema?.completeText || "Save Salary"}
      customizeLabel="Customize in Builder"
      onClose={onClose}
      onCustomize={() => openSchemaCreator("editSalary", "Customize Salary Form")}
      configure={(model) => { model.showTitle = false; }}
      onComplete={(data) => {
        updateSalary(selectedEmployee.id, data);
        notify("Salary saved.");
        onClose();
      }}
    />
  );
}
