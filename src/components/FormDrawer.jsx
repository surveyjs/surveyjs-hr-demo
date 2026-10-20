import { useRef } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useApp } from "../app/AppContext.jsx";
import SurveyForm, { completeSurvey, prefillSurvey } from "./SurveyForm.jsx";

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
  onComplete,
  onCompleting,
  onClose,
  onCustomize
}) {
  const { currentUser } = useApp();
  const surveyRef = useRef(null);
  const canCustomize = currentUser?.role === "hr" && typeof onCustomize === "function";
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{ paper: { sx: { width: { xs: "100%", sm: "min(920px, 100vw)" } } } }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <Box sx={{ px: 3, py: 2, borderBottom: 1, borderColor: "divider" }}>
          <Typography variant="h5">{title}</Typography>
          {description ? (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{description}</Typography>
          ) : null}
          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mt: 2 }}>
            <Button type="button" variant="contained" onClick={() => completeSurvey(surveyRef.current)}>
              {completeLabel || schema?.completeText || "Save"}
            </Button>
            {prefillData ? (
              <Button type="button" variant="outlined" onClick={() => prefillSurvey(surveyRef.current, prefillData)}>
                Prefill demo data
              </Button>
            ) : null}
            <Button type="button" variant="outlined" onClick={onClose}>{cancelLabel}</Button>
            {canCustomize ? (
              <Button type="button" onClick={onCustomize}>{customizeLabel || "Customize in Builder"}</Button>
            ) : null}
          </Stack>
        </Box>
        <Box sx={{ px: 3, py: 2, overflow: "auto" }}>
          {notes.map((note) => (
            <Alert key={note} severity="info" sx={{ mb: 2 }}>{note}</Alert>
          ))}
          {open && schema ? (
            <SurveyForm
              schema={schema}
              data={data}
              elementIdPrefix={elementIdPrefix}
              onModel={(model) => { surveyRef.current = model; }}
              onComplete={onComplete}
              onCompleting={onCompleting}
            />
          ) : null}
        </Box>
      </Box>
    </Drawer>
  );
}
