import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useApp } from "../app/AppContext.jsx";
import { buildFormPdf, downloadBlob, pdfFileName } from "../pdf/formPdf.js";

function PdfPreviewDialog({ open, title, url, onDownload, onClose }) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent sx={{ px: 3, pb: 1 }}>
        {url ? (
          <Box
            component="iframe"
            title={`${title} PDF`}
            src={url}
            sx={{ display: "block", width: "100%", height: "70vh", border: 0 }}
          />
        ) : null}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button type="button" onClick={onClose}>Close</Button>
        <Button type="button" variant="contained" onClick={onDownload}>Download</Button>
      </DialogActions>
    </Dialog>
  );
}

export function useFormPdfPreview(title) {
  const { notify } = useApp();
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState(null);
  const urlRef = useRef(null);

  const close = () => {
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    urlRef.current = null;
    setPreview(null);
  };

  useEffect(() => () => {
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
  }, []);

  const openPreview = async (survey) => {
    if (!survey || busy) return;
    setBusy(true);
    try {
      const blob = await buildFormPdf(survey);
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
      const url = URL.createObjectURL(blob);
      urlRef.current = url;
      setPreview({ url, blob, fileName: pdfFileName(title) });
    } catch (error) {
      console.error(error);
      notify("The PDF could not be created.", "error");
    } finally {
      setBusy(false);
    }
  };

  const download = () => {
    if (!preview) return;
    downloadBlob(preview.blob, preview.fileName);
  };

  const dialog = (
    <PdfPreviewDialog
      open={Boolean(preview)}
      title={title || "Preview PDF"}
      url={preview?.url}
      onDownload={download}
      onClose={close}
    />
  );

  return { busy, open: Boolean(preview), openPreview, dialog };
}
