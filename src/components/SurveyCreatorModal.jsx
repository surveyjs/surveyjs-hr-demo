import { useEffect, useMemo, useRef } from "react";
import { Serializer } from "survey-core";
import { AceJsonEditorModel } from "survey-creator-core";
import { SurveyCreator, SurveyCreatorComponent } from "survey-creator-react";
import "ace-builds/src-noconflict/ace";
import "ace-builds/src-noconflict/ext-searchbox";
import "ace-builds/src-noconflict/theme-clouds_midnight";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useColorScheme } from "@mui/material/styles";
import { useApp } from "../app/AppContext.jsx";

function colorPalette(mode, systemMode) {
  return (mode === "system" ? systemMode : mode) === "dark" ? "dark" : "light";
}

function applyAceTheme(creator) {
  const node = document.querySelector(".svc-json-editor-tab__ace-editor");
  if (!node || typeof window.ace?.edit !== "function") return;
  const theme = creator.preferredColorPalette === "dark" ? "ace/theme/clouds_midnight" : "ace/theme/textmate";
  window.ace.edit(node).setTheme(theme);
}

AceJsonEditorModel.aceBasePath = "https://unpkg.com/ace-builds@1.43.6/src-min-noconflict/";

export default function SurveyCreatorModal() {
  const { creatorRequest, closeCreator, saveCreatorSchema } = useApp();
  const { mode, systemMode } = useColorScheme();
  const palette = colorPalette(mode, systemMode);
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
        const title = saveRef.current(structuredClone(instance.JSON));
        if (title && instance.survey.title !== title) instance.survey.title = title;
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

  useEffect(() => {
    if (!creator) return undefined;
    creator.preferredColorPalette = palette;
    applyAceTheme(creator);
    const syncAceTheme = () => applyAceTheme(creator);
    creator.onActiveTabChanged.add(syncAceTheme);
    creator.onCreatorThemeSelected.add(syncAceTheme);
    return () => {
      creator.onActiveTabChanged.remove(syncAceTheme);
      creator.onCreatorThemeSelected.remove(syncAceTheme);
    };
  }, [creator, palette]);

  const saveAndClose = () => {
    if (!creator) return;
    const title = saveCreatorSchema(structuredClone(creator.JSON));
    if (title && creator.survey.title !== title) creator.survey.title = title;
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
