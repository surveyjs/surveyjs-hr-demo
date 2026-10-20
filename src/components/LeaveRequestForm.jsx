import { useApp } from "../app/AppContext.jsx";
import { leaveDemoData } from "../data/demoFormData.js";
import { datesAreOrdered } from "../utils/records.js";
import FormDrawer from "./FormDrawer.jsx";

function toLeaveFormData(request) {
  if (!request) return null;
  return {
    leave_type: request.leave_type,
    start_date: request.start_date,
    end_date: request.end_date,
    reason: request.reason || "",
    status: request.status || "pending"
  };
}

export default function LeaveRequestForm({ open, request = null, onClose }) {
  const { currentUser, selectedEmployee, schemas, addLeave, updateLeave, openSchemaCreator, notify } = useApp();
  const schema = schemas.addLeave;
  const isHr = currentUser?.role === "hr";
  const editing = Boolean(request);
  if (!selectedEmployee) return null;

  const description = editing
    ? "Update this request and set Approved or Declined."
    : "Choose a leave type and a valid date range. A new request is saved as Pending.";

  return (
    <FormDrawer
      open={open}
      title={editing ? "Edit Leave Request" : "Add Leave Request"}
      description={description}
      schema={schema}
      data={toLeaveFormData(request)}
      elementIdPrefix={editing ? `edit_leave_${request.id}_` : `add_leave_${selectedEmployee.id}_`}
      completeLabel={editing ? "Save Changes" : (schema?.completeText || "Save Leave Request")}
      prefillData={editing ? null : leaveDemoData}
      customizeLabel="Customize in Builder"
      onClose={onClose}
      onCustomize={() => openSchemaCreator("addLeave", "Customize Leave Request Form")}
      configure={(model) => {
        model.showTitle = false;
        const status = model.getQuestionByName("status");
        if (!status) return;
        status.visible = isHr;
      }}
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
        const status = isHr ? (data.status || request?.status || "pending") : "pending";
        const next = { ...data, status };
        if (editing) {
          updateLeave(selectedEmployee.id, request.id, next);
          notify("Leave request updated.");
        } else {
          addLeave(selectedEmployee.id, next);
          notify("Leave request saved.");
        }
        onClose();
      }}
    />
  );
}
