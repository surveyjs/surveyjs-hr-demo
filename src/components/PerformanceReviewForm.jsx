import { useApp } from "../app/AppContext.jsx";
import { reviewDemoData } from "../data/demoFormData.js";
import FormDrawer from "./FormDrawer.jsx";

export default function PerformanceReviewForm({ open, onClose }) {
  const { selectedEmployee, schemas, addReview, openSchemaCreator, notify } = useApp();
  const schema = schemas.addReview;
  if (!selectedEmployee) return null;

  return (
    <FormDrawer
      open={open}
      title="Add Performance Review"
      description="The review is stored on this employee and shown first in the collection."
      schema={schema}
      elementIdPrefix={`add_review_${selectedEmployee.id}_`}
      completeLabel={schema?.completeText || "Save Review"}
      prefillData={reviewDemoData}
      customizeLabel="Customize in Builder"
      configure={(model) => { model.showTitle = false; }}
      onClose={onClose}
      onCustomize={() => openSchemaCreator("addReview", "Customize Review Form")}
      onComplete={(data) => {
        addReview(selectedEmployee.id, data);
        notify("Performance review saved.");
        onClose();
      }}
    />
  );
}
