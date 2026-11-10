import { useRef } from "react";
import Alert from "@mui/material/Alert";
import Paper from "@mui/material/Paper";
import { ActionContainer } from "survey-core";
import { ReactElementFactory } from "survey-react-ui";
import CreatorButton from "./CreatorButton.jsx";
import { useApp } from "../app/AppContext.jsx";
import { searchDemoData } from "../data/demoFormData.js";
import SurveyForm, { prefillSurvey } from "./SurveyForm.jsx";

ReactElementFactory.Instance.registerElement("hr-creator-button", ({ item }) => (
  <CreatorButton onClick={() => item.action()}>{item.title}</CreatorButton>
));

export default function EmployeeSearchPanel({
  criteria,
  resetKey = 0,
  onChange,
  onClear,
  elementIdPrefix = "search_"
}) {
  const { schemas, openSchemaCreator, currentUser } = useApp();
  const actionsRef = useRef({});
  actionsRef.current = {
    onChange,
    onClear,
    openSchemaCreator,
    isHr: currentUser?.role === "hr"
  };
  const formDataRef = useRef(criteria);
  const formResetRef = useRef(resetKey);
  if (formResetRef.current !== resetKey) {
    formResetRef.current = resetKey;
    formDataRef.current = criteria;
  }

  const configure = (model) => {
    model.description = "";
    const page = model.pages[0];
    if (page) page.description = "";
    model.headerView = "basic";
    const toolbar = new ActionContainer();
    toolbar.setActionsAppearance({ mode: "tertiary-surface", size: "large", style: "brand", showBorder: true });
    toolbar.cssClasses = { ...model.navigationBar.cssClasses, root: "sd-action-bar search-footer-actions" };
    const items = [
      {
        id: "prefill-search",
        title: "Prefill Demo Data",
        showTitle: true,
        disableShrink: true,
        action: () => {
          const data = structuredClone(searchDemoData);
          prefillSurvey(model, data);
          actionsRef.current.onChange(data);
        }
      },
      {
        id: "clear-filters",
        title: "Clear Filters",
        showTitle: true,
        disableShrink: true,
        action: () => actionsRef.current.onClear()
      }
    ];
    if (actionsRef.current.isHr) {
      const headerToolbar = new ActionContainer();
      headerToolbar.cssClasses = { ...model.navigationBar.cssClasses, root: "sd-action-bar search-header-actions" };
      headerToolbar.setItems([{
        id: "edit-search-form",
        title: "Edit Search Form",
        component: "hr-creator-button",
        showTitle: true,
        disableShrink: true,
        action: () => actionsRef.current.openSchemaCreator("search", "Edit Search Form")
      }]);
      model.addLayoutElement({
        id: "search-header-actions",
        container: "header",
        component: "sv-action-bar",
        data: headerToolbar
      });
    }
    toolbar.setItems(items);
    model.addLayoutElement({
      id: "search-footer-actions",
      container: "footer",
      component: "sv-action-bar",
      data: toolbar
    });
  };

  if (!schemas.search) {
    return <Alert severity="error">Search for an Employee.json is missing.</Alert>;
  }

  return (
    <Paper sx={{ p: 0 }}>
      <SurveyForm
        schema={schemas.search}
        data={formDataRef.current}
        resetKey={resetKey}
        elementIdPrefix={elementIdPrefix}
        hostId="survey-search"
        configure={configure}
        onValueChanged={(data) => actionsRef.current.onChange(data)}
        onCompleting={() => ({ allow: false })}
      />
    </Paper>
  );
}
