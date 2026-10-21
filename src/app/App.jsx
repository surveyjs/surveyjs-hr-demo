import Container from "@mui/material/Container";
import { AppProvider, useApp } from "./AppContext.jsx";
import BenefitsPage from "../components/BenefitsPage.jsx";
import EmployeeProfile from "../components/EmployeeProfile.jsx";
import EmployeeRegistrationForm from "../components/EmployeeRegistrationForm.jsx";
import EmployeeSearchForm from "../components/EmployeeSearchForm.jsx";
import DemoDock from "../components/DemoDock.jsx";
import Header from "../components/Header.jsx";
import LoginPage from "../components/LoginPage.jsx";
import Notification from "../components/Notification.jsx";
import PayrollPage from "../components/PayrollPage.jsx";
import SurveyCreatorModal from "../components/SurveyCreatorModal.jsx";

function Shell() {
  const { view, currentUser } = useApp();
  const isEmployee = currentUser?.role === "employee";
  return (
    <>
      <Header />
      {currentUser ? (
        <Container maxWidth="lg" sx={{ py: 4 }}>
          {!isEmployee && view === "register" ? <EmployeeRegistrationForm /> : null}
          {!isEmployee && view === "manage" ? <EmployeeSearchForm /> : null}
          {view === "payroll" ? <PayrollPage /> : null}
          {view === "benefits" ? <BenefitsPage /> : null}
          {view === "profile" ? <EmployeeProfile /> : null}
        </Container>
      ) : (
        <LoginPage />
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
