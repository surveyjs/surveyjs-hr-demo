import { useApp } from "../app/AppContext.jsx";
import { employeeIdTaken, maskNotes, toSurveyEmployee } from "../utils/records.js";
import FormDrawer from "./FormDrawer.jsx";

export default function EmployeeEditDrawer({ open, onClose }) {
  const { employees, selectedEmployee, schemas, updateEmployee, openSchemaCreator, notify } = useApp();
  const schema = schemas.editEmployee;
  if (!selectedEmployee) return null;

  return (
    <FormDrawer
      open={open}
      title="Edit Employee"
      description={`Update ${selectedEmployee.first_name} ${selectedEmployee.last_name}.`}
      notes={maskNotes(selectedEmployee)}
      schema={schema}
      data={toSurveyEmployee(selectedEmployee)}
      elementIdPrefix={`edit_${selectedEmployee.id}_`}
      completeLabel={schema?.completeText || "Save Changes"}
      customizeLabel="Customize Employee Form"
      onClose={onClose}
      onCustomize={() => openSchemaCreator("editEmployee", "Customize Employee Form")}
      onCompleting={(data) => {
        if (employeeIdTaken(employees, data.employee_id, selectedEmployee.id)) {
          notify("An employee with this Employee ID already exists.", "error");
          return { allow: false };
        }
        return { allow: true };
      }}
      onComplete={(data) => {
        const result = updateEmployee(selectedEmployee.id, data);
        if (!result.ok) {
          notify(result.message, "error");
          return;
        }
        notify("Employee details saved.");
        onClose();
      }}
    />
  );
}
