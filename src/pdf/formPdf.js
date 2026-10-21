import { SurveyPDF } from "survey-pdf";

export function pdfFileName(title) {
  const slug = String(title || "form")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${slug || "form"}.pdf`;
}

export async function buildFormPdf(survey) {
  const pdf = new SurveyPDF(survey.toJSON());
  pdf.data = survey.data;
  return pdf.raw("blob");
}

export function downloadBlob(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
