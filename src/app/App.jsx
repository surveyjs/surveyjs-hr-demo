import Container from "@mui/material/Container";
import { AppProvider, useApp } from "./AppContext.jsx";
import EmployeeProfile from "../components/EmployeeProfile.jsx";
import EmployeeRegistrationForm from "../components/EmployeeRegistrationForm.jsx";
import EmployeeSearchForm from "../components/EmployeeSearchForm.jsx";
import DemoDock from "../components/DemoDock.jsx";
import Header from "../components/Header.jsx";
import LoginPage from "../components/LoginPage.jsx";
import Notification from "../components/Notification.jsx";
import SurveyCreatorModal from "../components/SurveyCreatorModal.jsx";

function Shell() {
  const { view, currentUser } = useApp();
  const employeeView = currentUser?.role === "employee";
  return (
    <>
      <Header />
      {currentUser ? (
        <Container maxWidth="lg" sx={{ py: 4 }}>
          {!employeeView && view === "register" ? <EmployeeRegistrationForm /> : null}
          {!employeeView && view === "manage" ? <EmployeeSearchForm /> : null}
          {employeeView || view === "profile" ? <EmployeeProfile /> : null}
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
