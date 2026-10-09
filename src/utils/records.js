const SYSTEM_FIELDS = new Set(["id", "status", "reviews", "leaveRequests"]);
const PHONE_MASK = /^\d{11}$/;
const POSTCODE_MASK = /^[A-Za-z]{2}\d{3}[A-Za-z]{2}$/;

export function fullName(employee) {
  return [employee?.first_name, employee?.last_name].filter(Boolean).join(" ") || "Unnamed employee";
}

export function initials(employee) {
  const first = employee?.first_name?.[0] || "";
  const last = employee?.last_name?.[0] || "";
  return `${first}${last}`.toUpperCase() || "?";
}

export function formatDate(value) {
  if (!value) return "—";
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(value));
  if (!match) return String(value);
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export function formatPhone(value) {
  if (!value) return "—";
  const text = String(value);
  if (PHONE_MASK.test(text)) return `${text.slice(0, 5)} ${text.slice(5)}`;
  return text;
}

export function formatAddress(employee) {
  const street = [employee["address-line-1"], employee["address-line-2"]].filter(Boolean).join(", ");
  const locality = [employee["town-city"], employee.county].filter(Boolean).join(", ");
  const cityLine = [locality, employee.postcode].filter(Boolean).join(" ");
  const parts = [street, cityLine, employee.country].filter(Boolean);
  return parts.join(", ") || "—";
}

export function findQuestion(schema, name) {
  const visit = (elements) => {
    if (!Array.isArray(elements)) return null;
    for (const element of elements) {
      if (element?.name === name) return element;
      const nested = visit(element.elements) || visit(element.templateElements);
      if (nested) return nested;
    }
    return null;
  };
  if (!schema) return null;
  for (const page of schema.pages || []) {
    const found = visit(page.elements);
    if (found) return found;
  }
  return visit(schema.elements);
}

export function choiceLabel(schema, questionName, value, record) {
  if (value == null || value === "") return "—";
  const comment = record?.[`${questionName}-Comment`];
  if (value === "other" && comment) return comment;
  const question = findQuestion(schema, questionName);
  const choices = question?.choices || [];
  const match = choices.find((choice) => {
    if (choice && typeof choice === "object") return choice.value === value;
    return choice === value;
  });
  if (match && typeof match === "object") return match.text || String(match.value);
  if (match != null) return String(match);
  return comment || String(value);
}

export function ratingLabel(schema, value) {
  if (value == null || value === "") return "—";
  const question = findQuestion(schema, "rating");
  const max = question?.rateMax || question?.rateCount;
  return max ? `${value} / ${max}` : String(value);
}

export function byDateDesc(field) {
  return (left, right) => String(right?.[field] || "").localeCompare(String(left?.[field] || ""));
}

export function toPanelRecords(records) {
  return (records || []).map((record) => {
    const copy = { ...record };
    delete copy.id;
    return copy;
  });
}

function isMaskedPhone(value) {
  return typeof value === "string" && PHONE_MASK.test(value);
}

function isMaskedPostcode(value) {
  return typeof value === "string" && POSTCODE_MASK.test(value.replace(/\s+/g, ""));
}

export function maskNotes(employee) {
  const notes = [];
  if (employee.phone_number && !isMaskedPhone(employee.phone_number)) {
    notes.push(
      `Saved phone number: ${employee.phone_number}. The form mask expects 11 digits, for example 41555 50147.`
    );
  }
  if (employee.postcode && !isMaskedPostcode(employee.postcode)) {
    notes.push(
      `Saved postcode: ${employee.postcode}. The form mask expects a UK postcode such as AB12 3CD. Leave Postcode empty to keep the saved value.`
    );
  }
  return notes;
}

export function toSurveyEmployee(employee) {
  const data = {};
  for (const [key, value] of Object.entries(employee)) {
    if (SYSTEM_FIELDS.has(key) || value == null || value === "") continue;
    data[key] = value;
  }
  if (data.phone_number && !isMaskedPhone(data.phone_number)) delete data.phone_number;
  if (data.emergency_contact_phone_number && !isMaskedPhone(data.emergency_contact_phone_number)) {
    delete data.emergency_contact_phone_number;
  }
  if (data.postcode && !isMaskedPostcode(data.postcode)) delete data.postcode;
  return data;
}

export function mergeEmployee(employee, data) {
  const next = {
    ...employee,
    ...data,
    id: employee.id,
    status: employee.status || "active",
    reviews: employee.reviews || [],
    leaveRequests: employee.leaveRequests || []
  };
  if (!data.phone_number) next.phone_number = employee.phone_number;
  if (!data.emergency_contact_phone_number) {
    next.emergency_contact_phone_number = employee.emergency_contact_phone_number;
  }
  if (!data.postcode) next.postcode = employee.postcode;
  return next;
}

export function searchEmployees(employees, criteria) {
  const surname = String(criteria.last_name || "").trim().toLowerCase();
  const dateOfBirth = criteria.date_of_birth || "";
  const employeeId = String(criteria.employee_id || "").trim().toLowerCase();
  return employees.filter((employee) => {
    const lastName = String(employee.last_name || "").toLowerCase();
    if (surname && !lastName.includes(surname)) return false;
    if (dateOfBirth && employee.date_of_birth !== dateOfBirth) return false;
    if (employeeId && String(employee.employee_id || "").toLowerCase() !== employeeId) return false;
    return true;
  });
}

export function employeeIdTaken(employees, employeeId, exceptId) {
  const target = String(employeeId || "").trim().toLowerCase();
  if (!target) return false;
  return employees.some(
    (employee) => employee.id !== exceptId && String(employee.employee_id || "").trim().toLowerCase() === target
  );
}

export function datesAreOrdered(start, end) {
  if (!start || !end) return true;
  return String(end) >= String(start);
}
