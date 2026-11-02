import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useColorScheme } from "@mui/material/styles";
import { useApp } from "../app/AppContext.jsx";
import { buildFormPdf, downloadBlob, pdfFileName } from "../pdf/formPdf.js";

function PdfPreviewDialog({ open, title, url, onDownload, onClose }) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent sx={{ px: 3, pt: 0, pb: 3 }}>
        {url ? (
          <Box
            key={url}
            component="iframe"
            title={`${title} PDF`}
            src={url}
            sx={{ display: "block", width: "100%", height: "70vh", border: 0 }}
          />
        ) : null}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button type="button" onClick={onClose}>Close</Button>
        <Button type="button" variant="contained" onClick={onDownload}>Download</Button>
      </DialogActions>
    </Dialog>
  );
}

export function useFormPdfPreview(title) {
  const { notify } = useApp();
  const { mode, systemMode } = useColorScheme();
  const scheme = mode === "system" ? systemMode : mode;
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState(null);
  const urlRef = useRef(null);
  const sourceRef = useRef(null);
  const requestRef = useRef(0);
  const renderPdfRef = useRef(async () => {});

  renderPdfRef.current = async (survey, profile, dark) => {
    const request = requestRef.current + 1;
    requestRef.current = request;
    setBusy(true);
    try {
      const blob = await buildFormPdf(survey, profile, dark);
      if (requestRef.current !== request) return;
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
      const url = URL.createObjectURL(blob);
      urlRef.current = url;
      const documentTitle = profile?.title || title;
      setPreview({
        url,
        blob,
        title: documentTitle,
        fileName: pdfFileName(profile?.fileTitle || documentTitle)
      });
    } catch (error) {
      if (requestRef.current !== request) return;
      console.error(error);
      notify("The PDF could not be created.", "error");
    } finally {
      if (requestRef.current === request) setBusy(false);
    }
  };

  const close = () => {
    requestRef.current += 1;
    sourceRef.current = null;
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    urlRef.current = null;
    setPreview(null);
  };

  useEffect(() => () => {
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
  }, []);

  useEffect(() => {
    const source = sourceRef.current;
    if (!source || !urlRef.current) return;
    renderPdfRef.current(source.survey, source.profile, scheme === "dark");
  }, [scheme]);

  const openPreview = (survey, profile) => {
    if (!survey || busy) return;
    sourceRef.current = { survey, profile: profile ?? null };
    return renderPdfRef.current(survey, profile, scheme === "dark");
  };

  const download = () => {
    if (!preview) return;
    downloadBlob(preview.blob, preview.fileName);
  };

  const dialog = (
    <PdfPreviewDialog
      open={Boolean(preview)}
      title={preview?.title || title || "Preview PDF"}
      url={preview?.url}
      onDownload={download}
      onClose={close}
    />
  );

  return { busy, open: Boolean(preview), openPreview, dialog };
}
