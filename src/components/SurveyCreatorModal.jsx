import { useEffect, useMemo, useRef } from "react";
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

  return (
    <Dialog fullScreen open={Boolean(creatorRequest)} onClose={closeCreator}>
      <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
        <AppBar position="static" color="default" elevation={0} sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Toolbar sx={{ gap: 2 }}>
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Typography variant="h6" noWrap>{creatorRequest?.title || "Form builder"}</Typography>
              <Typography variant="caption" color="text.secondary">
                Survey Creator is a commercial product. The builder stays fully usable, and a license banner is shown until a license key is configured.
              </Typography>
            </Box>
            <Button type="button" variant="contained" onClick={saveAndClose}>Save schema</Button>
            <Button type="button" variant="outlined" onClick={closeCreator}>Close</Button>
          </Toolbar>
        </AppBar>
        <Box className="creator-host" sx={{ flex: 1, minHeight: 0 }}>
          {creator ? <SurveyCreatorComponent creator={creator} /> : null}
        </Box>
      </Box>
    </Dialog>
  );
}
