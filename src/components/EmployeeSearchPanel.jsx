import { useRef } from "react";
import Alert from "@mui/material/Alert";
import Paper from "@mui/material/Paper";
import { ActionContainer, SvgRegistry } from "survey-core";
import { useApp } from "../app/AppContext.jsx";
import { searchDemoData } from "../data/demoFormData.js";
import SurveyForm, { prefillSurvey } from "./SurveyForm.jsx";

SvgRegistry.registerIcon(
  "icon-hr-settings",
  `<svg viewBox="0 0 24 24"><g fill="none" stroke="var(--sd-action-icon-color, currentColor)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></g></svg>`
);

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
    toolbar.cssClasses = { ...model.navigationBar.cssClasses, root: "sd-action-bar search-header-actions" };
    const items = [
      {
        id: "prefill-search",
        title: "Prefill demo data",
        showTitle: true,
        disableShrink: true,
        action: () => {
          const data = structuredClone(searchDemoData);
          prefillSurvey(model, data);
          actionsRef.current.onChange(data);
        }
      }
    ];
    if (actionsRef.current.isHr) {
      items.push({
        id: "edit-search-form",
        title: "Edit Search Form",
        iconName: "icon-hr-settings",
        iconSize: 20,
        showTitle: true,
        disableShrink: true,
        action: () => actionsRef.current.openSchemaCreator("search", "Edit Search Form")
      });
    }
    toolbar.setItems(items);
    model.addLayoutElement({
      id: "search-header-actions",
      container: "header",
      component: "sv-action-bar",
      data: toolbar
    });
    model.addNavigationItem({
      id: "clear-filters",
      title: "Clear filters",
      css: "search-clear",
      action: () => actionsRef.current.onClear()
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
