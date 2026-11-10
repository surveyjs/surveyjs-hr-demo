import { useRef } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useApp } from "../app/AppContext.jsx";
import { choiceLabel, fullName } from "../utils/records.js";
import { useFormPdfPreview } from "./FormPdfPreview.jsx";
import SurveyForm, { completeSurvey, prefillSurvey } from "./SurveyForm.jsx";
import CreatorButton from "./CreatorButton.jsx";

export default function FormDrawer({
  open,
  title,
  description,
  notes = [],
  schema,
  data,
  elementIdPrefix,
  completeLabel,
  prefillData = null,
  cancelLabel = "Cancel",
  customizeLabel,
  pdfDocument = null,
  onComplete,
  onCompleting,
  onClose,
  onCustomize,
  configure
}) {
  const { currentUser, selectedEmployee, schemas } = useApp();
  const surveyRef = useRef(null);
  const pdf = useFormPdfPreview(pdfDocument?.title || title);
  const openPdf = () => {
    const employee = selectedEmployee;
    const profile = pdfDocument && employee ? {
      ...pdfDocument,
      employee,
      employeeName: fullName(employee),
      jobTitle: choiceLabel(schemas.editEmployee, "job_title", employee.job_title, employee),
      department: choiceLabel(schemas.editEmployee, "department", employee.department, employee),
      fileTitle: `${pdfDocument.title} ${employee.employee_id || ""}`.trim()
    } : null;
    pdf.openPreview(surveyRef.current, profile);
  };
  const canCustomize = currentUser?.role === "hr" && typeof onCustomize === "function";
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={() => {
        if (pdf.open) return;
        onClose();
      }}
      slotProps={{
        paper: { sx: { width: { xs: "100%", sm: "min(920px, 100vw)" } } },
        modal: { disableEnforceFocus: pdf.open }
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <Box sx={{ p: { xs: 2, md: 3 }, borderBottom: 1, borderColor: "divider" }}>
          <Typography variant="h5" sx={{ mb: description ? 1.5 : 0 }}>{title}</Typography>
          {description ? (
            <Typography variant="body2" color="text.secondary">{description}</Typography>
          ) : null}
          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mt: 2 }}>
            <Button type="button" variant="contained" onClick={() => completeSurvey(surveyRef.current)}>
              {completeLabel || schema?.completeText || "Save"}
            </Button>
            {prefillData ? (
              <Button type="button" variant="outlined" onClick={() => prefillSurvey(surveyRef.current, prefillData)}>
                Prefill Demo Data
              </Button>
            ) : null}
            <Button type="button" variant="outlined" onClick={onClose}>{cancelLabel}</Button>
            <Button
              type="button"
              variant="outlined"
              disabled={pdf.busy}
              onClick={openPdf}
            >
              Preview PDF
            </Button>
            {canCustomize ? (
              <CreatorButton onClick={onCustomize}>{customizeLabel || "Open in Creator"}</CreatorButton>
            ) : null}
          </Stack>
        </Box>
        <Box sx={{ p: { xs: 2, md: 3 }, overflow: "auto" }}>
          {notes.map((note) => (
            <Alert key={note} severity="info" sx={{ mb: 2 }}>{note}</Alert>
          ))}
          {open && schema ? (
            <SurveyForm
              schema={schema}
              data={data}
              elementIdPrefix={elementIdPrefix}
              hostId="survey-drawer"
              onModel={(model) => { surveyRef.current = model; }}
              onComplete={onComplete}
              onCompleting={onCompleting}
              configure={configure}
            />
          ) : null}
        </Box>
      </Box>
      {pdf.dialog}
    </Drawer>
  );
}
