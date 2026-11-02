import { DefaultDark } from "survey-core/themes";
import { SurveyPDF } from "survey-pdf";

export function pdfFileName(title) {
  const slug = String(title || "form")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${slug || "form"}.pdf`;
}

function contextQuestion(name, title, value, startWithNewLine) {
  return {
    type: "text",
    name,
    title,
    readOnly: true,
    startWithNewLine,
    defaultValue: value || "—"
  };
}

function applyDocument(json, data, profile) {
  const employee = profile.employee || {};
  const prepared = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  });
  const context = {
    pdf_employee_name: profile.employeeName || "—",
    pdf_employee_id: employee.employee_id || "—",
    pdf_job_title: profile.jobTitle || "—",
    pdf_department: profile.department || "—",
    pdf_prepared: prepared
  };
  Object.assign(data, context);
  json.title = profile.title;
  json.description = profile.description;
  json.showTitle = true;
  json.headerView = "basic";
  const page = json.pages?.[0];
  if (!page) return;
  page.elements = [
    {
      type: "panel",
      name: "pdf_employee",
      title: "Employee",
      elements: [
        contextQuestion("pdf_employee_name", "Employee", context.pdf_employee_name, true),
        contextQuestion("pdf_employee_id", "Employee ID", context.pdf_employee_id, false),
        contextQuestion("pdf_job_title", "Job title", context.pdf_job_title, true),
        contextQuestion("pdf_department", "Department", context.pdf_department, false),
        contextQuestion("pdf_prepared", "Prepared", context.pdf_prepared, true)
      ]
    },
    {
      type: "panel",
      name: "pdf_details",
      title: profile.sectionTitle,
      elements: page.elements || []
    }
  ];
}

function isDarkTheme() {
  return typeof document !== "undefined" && document.documentElement.dataset.theme === "dark";
}

function drawText(canvas, options, color) {
  canvas.drawText(options);
  if (!color) return;
  const brick = canvas.packs[canvas.packs.length - 1];
  if (brick?.style) brick.style.fontColor = color;
}

function drawHeader(profile, textColor) {
  return (_, canvas) => {
    drawText(canvas, {
      text: "Acme HR",
      fontSize: 11,
      horizontalAlign: "left",
      margins: { left: 16, top: 8 }
    }, textColor);
    drawText(canvas, {
      text: profile.title,
      fontSize: 11,
      horizontalAlign: "right",
      margins: { right: 16, top: 8 }
    }, textColor);
  };
}

function drawFooter(profile, textColor) {
  return (_, canvas) => {
    drawText(canvas, {
      text: profile.footer,
      fontSize: 9,
      horizontalAlign: "left",
      margins: { left: 16, bot: 8 }
    }, textColor);
    drawText(canvas, {
      text: `Page ${canvas.pageNumber} of ${canvas.pageCount}`,
      fontSize: 9,
      horizontalAlign: "right",
      margins: { right: 16, bot: 8 }
    }, textColor);
  };
}

export async function buildFormPdf(survey, profile, dark = isDarkTheme()) {
  const json = structuredClone(survey.toJSON());
  const data = structuredClone(survey.data || {});
  if (profile) applyDocument(json, data, profile);
  const pdf = new SurveyPDF(json, profile ? {
    margins: { top: 18, bot: 16, left: 14, right: 14 }
  } : undefined);
  pdf.data = data;
  let textColor = null;
  if (dark) {
    pdf.applyTheme(DefaultDark);
    textColor = pdf.style.survey.title.fontColor;
  }
  if (profile) {
    pdf.showTitle = true;
    pdf.onRenderHeader.add(drawHeader(profile, textColor));
    pdf.onRenderFooter.add(drawFooter(profile, textColor));
  }
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
