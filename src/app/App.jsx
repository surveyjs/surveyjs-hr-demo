import Container from "@mui/material/Container";
import { Navigate, Route, Routes, useParams } from "react-router-dom";
import { AppProvider, useApp } from "./AppContext.jsx";
import BenefitsDirectory from "../components/BenefitsDirectory.jsx";
import BenefitsPage from "../components/BenefitsPage.jsx";
import EmployeeProfile from "../components/EmployeeProfile.jsx";
import EmployeeRegistrationForm from "../components/EmployeeRegistrationForm.jsx";
import EmployeeSearchForm from "../components/EmployeeSearchForm.jsx";
import PayrollDirectory from "../components/PayrollDirectory.jsx";
import DemoDock from "../components/DemoDock.jsx";
import Header from "../components/Header.jsx";
import LoginPage from "../components/LoginPage.jsx";
import Notification from "../components/Notification.jsx";
import PayrollPage from "../components/PayrollPage.jsx";
import SettingsPage from "../components/SettingsPage.jsx";
import SurveyCreatorModal from "../components/SurveyCreatorModal.jsx";

function OwnRecord({ fallback, children }) {
  const { employeeId } = useParams();
  const { currentUser } = useApp();
  if (currentUser?.role === "employee" && employeeId && employeeId !== currentUser.employeeId) {
    return <Navigate to={fallback} replace />;
  }
  return children;
}

function Shell() {
  const { currentUser } = useApp();
  const isEmployee = currentUser?.role === "employee";
  return (
    <>
      <Header />
      {currentUser ? (
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Routes>
            {isEmployee ? (
              <>
                <Route path="/profile" element={<EmployeeProfile />} />
                <Route path="/payroll" element={<PayrollDirectory />} />
                <Route path="/payroll/:employeeId" element={<OwnRecord fallback="/payroll"><PayrollPage /></OwnRecord>} />
                <Route path="/benefits" element={<BenefitsDirectory />} />
                <Route path="/benefits/:employeeId" element={<OwnRecord fallback="/benefits"><BenefitsPage /></OwnRecord>} />
                <Route path="*" element={<Navigate to="/profile" replace />} />
              </>
            ) : (
              <>
                <Route path="/manage" element={<EmployeeSearchForm />} />
                <Route path="/register" element={<EmployeeRegistrationForm />} />
                <Route path="/employees/:employeeId" element={<EmployeeProfile />} />
                <Route path="/payroll" element={<PayrollDirectory />} />
                <Route path="/payroll/:employeeId" element={<PayrollPage />} />
                <Route path="/benefits" element={<BenefitsDirectory />} />
                <Route path="/benefits/:employeeId" element={<BenefitsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="*" element={<Navigate to="/manage" replace />} />
              </>
            )}
          </Routes>
        </Container>
      ) : (
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      )}
      {currentUser?.role === "hr" ? <SurveyCreatorModal /> : null}
      <Notification />
      <DemoDock />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}
