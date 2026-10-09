import Container from "@mui/material/Container";
import { AppProvider, useApp } from "./AppContext.jsx";
import EmployeeProfile from "../components/EmployeeProfile.jsx";
import EmployeeRegistrationForm from "../components/EmployeeRegistrationForm.jsx";
import EmployeeSearchForm from "../components/EmployeeSearchForm.jsx";
import Header from "../components/Header.jsx";
import Notification from "../components/Notification.jsx";
import SurveyCreatorModal from "../components/SurveyCreatorModal.jsx";

function Shell() {
  const { view } = useApp();
  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {view === "register" ? <EmployeeRegistrationForm /> : null}
        {view === "manage" ? <EmployeeSearchForm /> : null}
        {view === "profile" ? <EmployeeProfile /> : null}
      </Container>
      <SurveyCreatorModal />
      <Notification />
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
