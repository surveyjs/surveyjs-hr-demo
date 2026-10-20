import { SurveyError } from "survey-core";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useApp } from "../app/AppContext.jsx";
import { authenticate, listRoster } from "../data/demoUsers.js";
import signInSchema from "../schemas/Sign In.json";
import SurveyForm from "./SurveyForm.jsx";

export default function LoginPage() {
  const { login } = useApp();

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 4, md: 8 } }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>Sign in</Typography>
        <Typography color="text.secondary">
          Select a demo account. HR managers open the directory. Employees open their own profile.
        </Typography>
      </Box>
      <Paper sx={{ p: { xs: 2, md: 3 } }}>
        <SurveyForm
          schema={signInSchema}
          elementIdPrefix="signin_"
          hostId="signin-form"
          configure={(model) => {
            model.showTitle = false;
            model.showCompleteButton = true;
            const roster = model.getQuestionByName("roster_user");
            if (roster) roster.choices = listRoster();
          }}
          onCompleting={(data, model) => {
            const user = authenticate(data.username, data.password);
            if (!user) {
              model.getQuestionByName("password")?.addError(
                new SurveyError("Invalid username or password. Please try again.")
              );
              return { allow: false };
            }
            return { allow: true };
          }}
          onComplete={(data) => {
            const user = authenticate(data.username, data.password);
            if (user) login(user, !!data.remember_me);
          }}
        />
      </Paper>
    </Container>
  );
}
