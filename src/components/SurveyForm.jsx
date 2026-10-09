import { useEffect, useMemo, useRef } from "react";
import { Model } from "survey-core";
import { Survey } from "survey-react-ui";

export default function SurveyForm({
  schema,
  data = null,
  readOnly = false,
  resetKey = 0,
  elementIdPrefix = "survey_",
  onComplete,
  onCompleting,
  onModel
}) {
  const onCompleteRef = useRef(onComplete);
  const onCompletingRef = useRef(onCompleting);
  const onModelRef = useRef(onModel);
  onCompleteRef.current = onComplete;
  onCompletingRef.current = onCompleting;
  onModelRef.current = onModel;

  const dataKey = JSON.stringify(data ?? null);
  const survey = useMemo(() => {
    if (!schema) return null;
    const model = new Model(structuredClone(schema));
    model.elementIdPrefix = elementIdPrefix;
    model.showCompletedPage = false;
    model.showCompleteButton = false;
    model.focusFirstQuestionAutomatic = false;
    if (!readOnly) model.textUpdateMode = "onTyping";
    if (data) model.data = structuredClone(data);
    if (readOnly) {
      model.mode = "display";
      model.getAllQuestions().forEach((question) => {
        if (question.getType() === "paneldynamic") question.allowAddPanel = false;
      });
    }
    model.onCompleting.add((sender, options) => {
      const verdict = onCompletingRef.current?.(sender.data);
      if (verdict?.allow === false) options.allow = false;
    });
    model.onComplete.add((sender) => {
      onCompleteRef.current?.(structuredClone(sender.data));
    });
    return model;
  }, [schema, dataKey, readOnly, resetKey, elementIdPrefix]);

  useEffect(() => {
    onModelRef.current?.(survey);
  }, [survey]);

  if (!survey) {
    return <p>This form schema is missing.</p>;
  }

  return (
    <div className="survey-host">
      <Survey model={survey} />
    </div>
  );
}

export function completeSurvey(model) {
  const active = document.activeElement;
  if (active instanceof HTMLElement) active.blur();
  if (!model) return false;
  if (typeof model.tryComplete === "function") return model.tryComplete();
  if (typeof model.completeLastPage === "function") return model.completeLastPage();
  return false;
}
