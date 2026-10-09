import { useApp } from "../app/AppContext.jsx";
import { datesAreOrdered } from "../utils/records.js";
import FormDrawer from "./FormDrawer.jsx";

export default function LeaveRequestForm({ open, onClose }) {
  const { selectedEmployee, schemas, addLeave, openSchemaCreator, notify } = useApp();
  const schema = schemas.addLeave;
  if (!selectedEmployee) return null;

  return (
    <FormDrawer
      open={open}
      title="Add Leave Request"
      description="Choose a leave type, a valid date range, and a status."
      schema={schema}
      elementIdPrefix={`add_leave_${selectedEmployee.id}_`}
      completeLabel={schema?.completeText || "Save Leave Request"}
      customizeLabel="Customize in Builder"
      onClose={onClose}
      onCustomize={() => openSchemaCreator("addLeave", "Customize Leave Request Form")}
      onCompleting={(data) => {
        if (!datesAreOrdered(data.start_date, data.end_date)) {
          notify("End Date must be on or after Start Date.", "error");
          return { allow: false };
        }
        return { allow: true };
      }}
      onComplete={(data) => {
        if (!datesAreOrdered(data.start_date, data.end_date)) {
          notify("End Date must be on or after Start Date.", "error");
          return;
        }
        addLeave(selectedEmployee.id, data);
        notify("Leave request saved.");
        onClose();
      }}
    />
  );
}
