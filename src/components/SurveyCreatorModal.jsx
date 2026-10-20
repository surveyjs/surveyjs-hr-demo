import { useEffect, useMemo, useRef } from "react";
import { Serializer } from "survey-core";
import { SurveyCreator, SurveyCreatorComponent } from "survey-creator-react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useApp } from "../app/AppContext.jsx";

export default function SurveyCreatorModal() {
  const { creatorRequest, closeCreator, saveCreatorSchema } = useApp();
  const saveRef = useRef(saveCreatorSchema);
  saveRef.current = saveCreatorSchema;

  const creator = useMemo(() => {
    if (!creatorRequest) return null;
    Serializer.findProperty("survey", "questionDescriptionLocation").defaultValue = "underInput";
    Serializer.findProperty("survey", "questionErrorLocation").defaultValue = "bottom";
    const instance = new SurveyCreator({ autoSaveEnabled: false });
    instance.JSON = structuredClone(creatorRequest.schema);
    instance.saveSurveyFunc = (saveNo, callback) => {
      try {
        saveRef.current(structuredClone(instance.JSON));
        callback(saveNo, true);
      } catch {
        callback(saveNo, false);
      }
    };
    return instance;
  }, [creatorRequest]);

  useEffect(() => {
    if (!creator || typeof creator.dispose !== "function") return undefined;
    return () => creator.dispose();
  }, [creator]);

  const saveAndClose = () => {
    if (!creator) return;
    saveCreatorSchema(structuredClone(creator.JSON));
    closeCreator();
  };

  const resetToDefault = () => {
    if (!creator || !creatorRequest?.defaultSchema) return;
    creator.JSON = structuredClone(creatorRequest.defaultSchema);
  };

  return (
    <Dialog fullScreen open={Boolean(creatorRequest)} onClose={closeCreator}>
      <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
        <AppBar position="static" color="default" elevation={0} sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Toolbar sx={{ gap: 2 }}>
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Typography variant="h6" noWrap>{creatorRequest?.title || "Form builder"}</Typography>
              {import.meta.env.SURVEYJS_KEY?.trim() ? null : (
                <Typography variant="caption" color="text.secondary">
                  Survey Creator is a commercial product. Set SURVEYJS_KEY to remove the license banner.
                </Typography>
              )}
            </Box>
            <Button type="button" onClick={resetToDefault}>Reset to Default</Button>
            <Button type="button" variant="contained" onClick={saveAndClose}>Save schema</Button>
            <Button type="button" variant="outlined" onClick={closeCreator}>Close</Button>
          </Toolbar>
        </AppBar>
        <Box className="creator-host" data-survey-component="SurveyJS Creator" sx={{ flex: 1, minHeight: 0 }}>
          {creator ? <SurveyCreatorComponent creator={creator} /> : null}
        </Box>
      </Box>
    </Dialog>
  );
}
