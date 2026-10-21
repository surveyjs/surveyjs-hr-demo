import { useApp } from "../app/AppContext.jsx";
import FormDrawer from "./FormDrawer.jsx";

function toBenefitData(benefit) {
  if (!benefit) return null;
  return {
    benefit_type: benefit.benefit_type,
    plan_name: benefit.plan_name || "",
    coverage_detail: benefit.coverage_detail || "",
    status: benefit.status || "enrolled"
  };
}

export default function BenefitForm({ open, benefit = null, onClose }) {
  const { selectedEmployee, schemas, addBenefit, updateBenefit, openSchemaCreator, notify } = useApp();
  const schema = schemas.addBenefit;
  const editing = Boolean(benefit);
  if (!selectedEmployee) return null;

  return (
    <FormDrawer
      open={open}
      title={editing ? "Edit Benefit" : "Add Benefit"}
      description={editing
        ? "Update this enrollment."
        : "Add a health, retirement, or paid time off enrollment."}
      schema={schema}
      data={toBenefitData(benefit)}
      elementIdPrefix={editing ? `edit_benefit_${benefit.id}_` : `add_benefit_${selectedEmployee.id}_`}
      completeLabel={editing ? "Save Changes" : (schema?.completeText || "Save Benefit")}
      customizeLabel="Customize in Builder"
      onClose={onClose}
      onCustomize={() => openSchemaCreator("addBenefit", "Customize Benefit Form")}
      configure={(model) => { model.showTitle = false; }}
      onComplete={(data) => {
        const next = { ...data, status: data.status || "enrolled" };
        if (editing) {
          updateBenefit(selectedEmployee.id, benefit.id, next);
          notify("Benefit updated.");
        } else {
          addBenefit(selectedEmployee.id, next);
          notify("Benefit saved.");
        }
        onClose();
      }}
    />
  );
}
