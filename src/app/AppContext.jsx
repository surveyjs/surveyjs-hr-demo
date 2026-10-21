import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { clearStoredUser, getStoredUser, storeUser } from "../auth.js";
import { blankOnboardingSchema, schemaCatalog } from "../schemas/index.js";
import { mockEmployees } from "../data/mockEmployees.js";
import { employeeIdTaken, ensureCompensation, mergeEmployee, repairContactFields, searchEmployees } from "../utils/records.js";

const STORAGE_KEY = "acme-hr-demo-v1";
const AppContext = createContext(null);

function clone(value) {
  return structuredClone(value);
}

function nextOnboardingTitle(forms) {
  const max = forms.reduce((highest, form) => {
    const match = /^Onboarding form (\d+)$/.exec(form.title || "");
    return Math.max(highest, match ? Number(match[1]) : 0);
  }, 0);
  return `Onboarding form ${max + 1}`;
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
    const employees = Array.isArray(parsed.employees) && parsed.employees.length
      ? parsed.employees.map((employee) => {
          const seed = mockEmployees.find((item) => item.id === employee.id);
          const next = ensureCompensation(repairContactFields({
            ...employee,
            reviews: employee.reviews || [],
            leaveRequests: employee.leaveRequests || []
          }, seed), seed);
          delete next.status;
          return next;
        })
      : fallback.employees;
    return {
      employees,
      schemas: clone(schemaCatalog),
      customForms: Array.isArray(parsed.customForms) ? parsed.customForms : []
    };
  } catch {
    return fallback;
  }
}

export function AppProvider({ children }) {
  const [initial] = useState(loadPersistedState);
  const [currentUser, setCurrentUser] = useState(getStoredUser);
  const [employees, setEmployees] = useState(initial.employees);
  const [schemas, setSchemas] = useState(initial.schemas);
  const [customForms, setCustomForms] = useState(initial.customForms);
  const [view, setView] = useState(() => (getStoredUser()?.role === "employee" ? "profile" : "manage"));
  const [selectedId, setSelectedId] = useState(() => getStoredUser()?.employeeId || "emp-1002");
  const [criteria, setCriteria] = useState({});
  const [searchResetKey, setSearchResetKey] = useState(0);
  const [notice, setNotice] = useState(null);
  const [creatorRequest, setCreatorRequest] = useState(null);
  const customIdRef = useRef(null);
  const schemasRef = useRef(schemas);
  schemasRef.current = schemas;

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ employees, schemas, customForms }));
  }, [employees, schemas, customForms]);

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
      reviews: [],
      leaveRequests: [],
      salary: null,
      payments: [],
      benefits: []
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

  const updateLeave = (employeeId, requestId, data) => {
    setEmployees((current) => current.map((employee) => {
      if (employee.id !== employeeId) return employee;
      return {
        ...employee,
        leaveRequests: (employee.leaveRequests || []).map((request) => (
          request.id === requestId ? { ...request, ...data, id: request.id } : request
        ))
      };
    }));
  };

  const updateSalary = (employeeId, data) => {
    setEmployees((current) => current.map((employee) => {
      if (employee.id !== employeeId) return employee;
      return {
        ...employee,
        salary: {
          amount: Number(data.salary_amount),
          currency: data.currency || "USD",
          pay_frequency: data.pay_frequency || "monthly"
        }
      };
    }));
  };

  const addBenefit = (employeeId, data) => {
    const benefit = { id: crypto.randomUUID(), status: "enrolled", ...data };
    setEmployees((current) => current.map((employee) => {
      if (employee.id !== employeeId) return employee;
      return { ...employee, benefits: [benefit, ...(employee.benefits || [])] };
    }));
  };

  const updateBenefit = (employeeId, benefitId, data) => {
    setEmployees((current) => current.map((employee) => {
      if (employee.id !== employeeId) return employee;
      return {
        ...employee,
        benefits: (employee.benefits || []).map((benefit) => (
          benefit.id === benefitId ? { ...benefit, ...data, id: benefit.id } : benefit
        ))
      };
    }));
  };

  const openSchemaCreator = (key, title) => {
    const schema = schemasRef.current[key];
    const defaultSchema = schemaCatalog[key];
    if (!schema || !defaultSchema) {
      notify(`The ${title} schema is missing.`, "error");
      return;
    }
    customIdRef.current = null;
    setCreatorRequest({
      token: Date.now(),
      kind: "schema",
      key,
      title,
      schema: clone(schema),
      defaultSchema: clone(defaultSchema)
    });
  };

  const openCustomCreator = (form) => {
    customIdRef.current = form?.id || null;
    setCreatorRequest({
      token: Date.now(),
      kind: "custom",
      title: form ? `Edit ${form.title || "Onboarding form"}` : "Create New Onboarding Form",
      schema: clone(form?.schema || blankOnboardingSchema),
      defaultSchema: clone(blankOnboardingSchema)
    });
  };

  const resetDemoData = () => {
    const nextEmployees = clone(mockEmployees);
    setEmployees(nextEmployees);
    setSchemas(clone(schemaCatalog));
    setCustomForms([]);
    setCriteria({});
    setSearchResetKey((value) => value + 1);
    setCreatorRequest(null);
    customIdRef.current = null;
    setSelectedId((current) => (
      nextEmployees.some((employee) => employee.id === current) ? current : "emp-1002"
    ));
    notify("Local demo restored.");
  };

  const closeCreator = () => setCreatorRequest(null);

  const saveCreatorSchema = (json) => {
    if (!creatorRequest) return;
    if (creatorRequest.kind === "schema") {
      setSchemas((current) => ({ ...current, [creatorRequest.key]: clone(json) }));
      notify("Form schema saved for this session.");
      return;
    }
    const existingId = customIdRef.current;
    if (existingId) {
      const title = json?.title || "Onboarding form";
      const schema = clone(json);
      schema.title = title;
      setCustomForms((current) => current.map((form) => (
        form.id === existingId ? { ...form, title, schema } : form
      )));
      notify("Onboarding form saved. Open it again from Form Builder Tools.");
      return title;
    }
    const id = crypto.randomUUID();
    const title = nextOnboardingTitle(customForms);
    const schema = clone(json);
    schema.title = title;
    customIdRef.current = id;
    setCustomForms((current) => [{ id, title, schema }, ...current]);
    notify("Onboarding form saved. Open it again from Form Builder Tools.");
    return title;
  };

  const clearSearch = () => {
    setCriteria({});
    setSearchResetKey((value) => value + 1);
  };

  const openIndex = () => {
    if (currentUser?.role === "employee") {
      setView("profile");
      return;
    }
    setView("manage");
    setCriteria({});
    setSearchResetKey((value) => value + 1);
  };

  const login = (user, remember) => {
    storeUser(user, remember);
    setCurrentUser(user);
    if (user.role === "employee" && user.employeeId) {
      setSelectedId(user.employeeId);
      setView("profile");
      return;
    }
    setView("manage");
  };

  const logout = () => {
    clearStoredUser();
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    login,
    logout,
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
    openIndex,
    notice,
    notify,
    clearNotice,
    registerEmployee,
    updateEmployee,
    addReview,
    addLeave,
    updateLeave,
    updateSalary,
    addBenefit,
    updateBenefit,
    creatorRequest,
    openSchemaCreator,
    openCustomCreator,
    resetDemoData,
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
