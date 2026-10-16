import { useEffect, useMemo, useRef } from "react";
import { Model, Serializer } from "survey-core";
import { Survey } from "survey-react-ui";

export default function SurveyForm({
  schema,
  data = null,
  readOnly = false,
  resetKey = 0,
  elementIdPrefix = "survey_",
  hostId,
  onComplete,
  onCompleting,
  onValueChanged,
  onModel,
  configure
}) {
  const onCompleteRef = useRef(onComplete);
  const onCompletingRef = useRef(onCompleting);
  const onValueChangedRef = useRef(onValueChanged);
  const onModelRef = useRef(onModel);
  const configureRef = useRef(configure);
  onCompleteRef.current = onComplete;
  onCompletingRef.current = onCompleting;
  onValueChangedRef.current = onValueChanged;
  onModelRef.current = onModel;
  configureRef.current = configure;

  const dataKey = JSON.stringify(data ?? null);
  const survey = useMemo(() => {
    if (!schema) return null;
    Serializer.findProperty("survey", "questionDescriptionLocation").defaultValue = "underInput";
    Serializer.findProperty("survey", "questionErrorLocation").defaultValue = "bottom";
    const model = new Model(structuredClone(schema));
    model.elementIdPrefix = elementIdPrefix;
    model.showCompletedPage = false;
    model.showCompleteButton = false;
    model.focusFirstQuestionAutomatic = false;
    if (!readOnly) model.textUpdateMode = "onTyping";
    if (data) model.data = structuredClone(data);
    model.onValueChanged.add((sender) => {
      onValueChangedRef.current?.(structuredClone(sender.data));
    });
    if (readOnly) {
      model.mode = "display";
      model.getAllQuestions().forEach((question) => {
        if (question.getType() === "paneldynamic") question.allowAddPanel = false;
      });
    }
    model.onCompleting.add((sender, options) => {
      const verdict = onCompletingRef.current?.(sender.data, sender);
      if (verdict?.allow === false) options.allow = false;
    });
    model.onComplete.add((sender) => {
      onCompleteRef.current?.(structuredClone(sender.data));
    });
    configureRef.current?.(model);
    return model;
  }, [schema, dataKey, readOnly, resetKey, elementIdPrefix]);

  useEffect(() => {
    onModelRef.current?.(survey);
  }, [survey]);

  if (!survey) {
    return <p>This form schema is missing.</p>;
  }

  return (
    <div id={hostId} className="survey-host" data-survey-component="SurveyJS renders this">
      <Survey model={survey} />
    </div>
  );
}

function blurActiveField() {
  const active = document.activeElement;
  if (active instanceof HTMLElement) active.blur();
}

export function completeSurvey(model) {
  blurActiveField();
  if (!model) return false;
  if (typeof model.tryComplete === "function") return model.tryComplete();
  if (typeof model.completeLastPage === "function") return model.completeLastPage();
  return false;
}

export function prefillSurvey(model, data) {
  if (!model || !data) return false;
  blurActiveField();
  model.data = structuredClone(data);
  if (typeof model.clearErrors === "function") model.clearErrors();
  return true;
}
