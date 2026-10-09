import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { blankOnboardingSchema, schemaCatalog } from "../schemas/index.js";
import { mockEmployees } from "../data/mockEmployees.js";
import { employeeIdTaken, mergeEmployee, searchEmployees } from "../utils/records.js";

const STORAGE_KEY = "acme-hr-demo-v1";
const AppContext = createContext(null);

function clone(value) {
  return structuredClone(value);
}

const OPTIONAL_SEARCH_DESCRIPTION = "Last name, date of birth, and employee ID are all optional.";
const PREVIOUS_SEARCH_DESCRIPTIONS = new Set([
  "Enter the employee’s last name and either their date of birth or employee ID.",
  "Enter the employee’s last name. Date of birth and employee ID are optional."
]);

function relaxSearchRequirements(schema, makeLastNameOptional) {
  if (!schema?.pages) return schema;
  const next = clone(schema);
  for (const page of next.pages) {
    for (const element of page.elements || []) {
      if (element.name === "date_of_birth" && element.requiredIf === "{employee_id} empty") {
        delete element.requiredIf;
      }
      if (element.name === "employee_id" && element.requiredIf === "{date_of_birth} empty") {
        delete element.requiredIf;
      }
      if (makeLastNameOptional && element.name === "last_name") {
        delete element.isRequired;
      }
    }
    if (PREVIOUS_SEARCH_DESCRIPTIONS.has(page.description)) {
      page.description = OPTIONAL_SEARCH_DESCRIPTION;
    }
  }
  return next;
}

function loadPersistedState() {
  const fallback = {
    employees: clone(mockEmployees),
    schemas: clone(schemaCatalog),
    customForms: []
  };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    const schemas = { ...fallback.schemas, ...(parsed.schemas || {}) };
    const searchOptionalRevision = Math.max(2, Number(parsed.searchOptionalRevision) || 0);
    if (schemas.search) {
      schemas.search = relaxSearchRequirements(schemas.search, (Number(parsed.searchOptionalRevision) || 0) < 2);
    }
    const employees = Array.isArray(parsed.employees) && parsed.employees.length
      ? parsed.employees.map((employee) => ({
          ...employee,
          reviews: employee.reviews || [],
          leaveRequests: employee.leaveRequests || []
        }))
      : fallback.employees;
    return {
      employees,
      schemas,
      customForms: Array.isArray(parsed.customForms) ? parsed.customForms : [],
      searchOptionalRevision
    };
  } catch {
    return fallback;
  }
}

export function AppProvider({ children }) {
  const [initial] = useState(loadPersistedState);
  const [employees, setEmployees] = useState(initial.employees);
  const [schemas, setSchemas] = useState(initial.schemas);
  const [customForms, setCustomForms] = useState(initial.customForms);
  const searchOptionalRevision = initial.searchOptionalRevision || 2;
  const [view, setView] = useState("manage");
  const [selectedId, setSelectedId] = useState("emp-1002");
  const [criteria, setCriteria] = useState(null);
  const [searchResetKey, setSearchResetKey] = useState(0);
  const [notice, setNotice] = useState(null);
  const [creatorRequest, setCreatorRequest] = useState(null);
  const customIdRef = useRef(null);
  const schemasRef = useRef(schemas);
  schemasRef.current = schemas;

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      employees,
      schemas,
      customForms,
      searchOptionalRevision
    }));
  }, [employees, schemas, customForms, searchOptionalRevision]);

  const searchResults = useMemo(
    () => (criteria ? searchEmployees(employees, criteria) : null),
    [criteria, employees]
  );
  const selectedEmployee = employees.find((employee) => employee.id === selectedId) || null;

  const notify = (message, severity = "success") => {
    setNotice({ message, severity, id: Date.now() });
  };

  const clearNotice = () => setNotice(null);

  const openProfile = (id) => {
    setSelectedId(id);
    setView("profile");
  };

  const registerEmployee = (data) => {
    if (employeeIdTaken(employees, data.employee_id)) {
      return { ok: false, message: "An employee with this Employee ID already exists." };
    }
    const employee = {
      ...data,
      id: crypto.randomUUID(),
      status: "active",
      reviews: [],
      leaveRequests: []
    };
    setEmployees((current) => [...current, employee]);
    return { ok: true, employee };
  };

  const updateEmployee = (employeeId, data) => {
    if (employeeIdTaken(employees, data.employee_id, employeeId)) {
      return { ok: false, message: "An employee with this Employee ID already exists." };
    }
    setEmployees((current) => current.map((employee) => (
      employee.id === employeeId ? mergeEmployee(employee, data) : employee
    )));
    return { ok: true };
  };

  const addReview = (employeeId, data) => {
    const review = { id: crypto.randomUUID(), ...data };
    setEmployees((current) => current.map((employee) => {
      if (employee.id !== employeeId) return employee;
      return { ...employee, reviews: [review, ...(employee.reviews || [])] };
    }));
  };

  const addLeave = (employeeId, data) => {
    const request = { id: crypto.randomUUID(), ...data };
    if (!request.status) request.status = "pending";
    setEmployees((current) => current.map((employee) => {
      if (employee.id !== employeeId) return employee;
      return { ...employee, leaveRequests: [request, ...(employee.leaveRequests || [])] };
    }));
  };

  const openSchemaCreator = (key, title) => {
    const schema = schemasRef.current[key];
    if (!schema) {
      notify(`The ${title} schema is missing.`, "error");
      return;
    }
    customIdRef.current = null;
    setCreatorRequest({
      token: Date.now(),
      kind: "schema",
      key,
      title,
      schema: clone(schema)
    });
  };

  const openCustomCreator = (form) => {
    customIdRef.current = form?.id || null;
    setCreatorRequest({
      token: Date.now(),
      kind: "custom",
      title: form ? `Edit ${form.title || "Onboarding form"}` : "Create New Onboarding Form",
      schema: clone(form?.schema || blankOnboardingSchema)
    });
  };

  const closeCreator = () => setCreatorRequest(null);

  const saveCreatorSchema = (json) => {
    if (!creatorRequest) return;
    if (creatorRequest.kind === "schema") {
      setSchemas((current) => ({ ...current, [creatorRequest.key]: clone(json) }));
      notify("Form schema saved for this session.");
      return;
    }
    const title = json?.title || "Onboarding form";
    const existingId = customIdRef.current;
    if (existingId) {
      setCustomForms((current) => current.map((form) => (
        form.id === existingId ? { ...form, title, schema: clone(json) } : form
      )));
    } else {
      const id = crypto.randomUUID();
      customIdRef.current = id;
      setCustomForms((current) => [{ id, title, schema: clone(json) }, ...current]);
    }
    notify("Onboarding form saved. Open it again from Form Builder Tools.");
  };

  const clearSearch = () => {
    setCriteria(null);
    setSearchResetKey((value) => value + 1);
  };

  const value = {
    employees,
    schemas,
    customForms,
    view,
    setView,
    selectedEmployee,
    openProfile,
    criteria,
    setCriteria,
    searchResetKey,
    searchResults,
    clearSearch,
    notice,
    notify,
    clearNotice,
    registerEmployee,
    updateEmployee,
    addReview,
    addLeave,
    creatorRequest,
    openSchemaCreator,
    openCustomCreator,
    closeCreator,
    saveCreatorSchema
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
}
