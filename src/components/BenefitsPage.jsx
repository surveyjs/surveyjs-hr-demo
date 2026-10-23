import { useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Link as RouterLink } from "react-router-dom";
import { useApp } from "../app/AppContext.jsx";
import { choiceLabel, toPanelRecords } from "../utils/records.js";
import BenefitForm from "./BenefitForm.jsx";
import EmployeeSummary from "./EmployeeSummary.jsx";
import SurveyForm from "./SurveyForm.jsx";

function Section({ title, children }) {
  return (
    <Paper sx={{ p: { xs: 2, md: 3 } }}>
      <Typography variant="h6" sx={{ mb: 1.5 }}>{title}</Typography>
      {children}
    </Paper>
  );
}

const STATUS_COLOR = {
  enrolled: "success",
  waived: "default"
};

function BenefitCard({ benefit, labelSchema }) {
  return (
    <CardContent>
      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
        <Typography variant="subtitle1" component="p">
          {choiceLabel(labelSchema, "benefit_type", benefit.benefit_type, benefit)}
        </Typography>
        <Chip
          size="small"
          color={STATUS_COLOR[benefit.status] || "default"}
          label={choiceLabel(labelSchema, "status", benefit.status, benefit)}
        />
      </Stack>
      <Typography variant="body2" sx={{ mt: 1 }}>{benefit.plan_name}</Typography>
      {benefit.coverage_detail ? (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{benefit.coverage_detail}</Typography>
      ) : null}
    </CardContent>
  );
}

export default function BenefitsPage() {
  const { currentUser, selectedEmployee, schemas } = useApp();
  const [benefitOpen, setBenefitOpen] = useState(false);
  const [benefit, setBenefit] = useState(null);
  const isEmployee = currentUser?.role === "employee";

  const openNew = () => {
    setBenefit(null);
    setBenefitOpen(true);
  };
  const openBenefit = (record) => {
    setBenefit(record);
    setBenefitOpen(true);
  };
  const closeBenefit = () => setBenefitOpen(false);

  if (!selectedEmployee) {
    return (
      <Paper sx={{ p: { xs: 2, md: 3 } }}>
        <Typography variant="h5" sx={{ mb: 1.5 }}>No employee selected</Typography>
        <Button component={RouterLink} to="/manage" variant="contained">Manage Employees</Button>
      </Paper>
    );
  }

  const employee = selectedEmployee;
  const labelSchema = schemas.addBenefit;
  const benefits = employee.benefits || [];
  const panelData = { benefit_list: toPanelRecords(benefits) };

  return (
    <Stack spacing={3}>
      <Button component={RouterLink} to="/benefits" startIcon={<ArrowBackIcon />} sx={{ alignSelf: "flex-start" }}>
        Benefits
      </Button>
      <Paper sx={{ p: { xs: 2, md: 3 } }}>
        <EmployeeSummary employee={employee} labelSchema={schemas.editEmployee} />
        {isEmployee ? null : (
          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mt: 2 }}>
            <Button type="button" variant="contained" onClick={openNew}>Add Benefit</Button>
          </Stack>
        )}
      </Paper>
      <Section title="Enrolled Benefits">
        {benefits.length === 0 ? (
          <Typography variant="body2" color="text.secondary">No benefits yet.</Typography>
        ) : (
          <Stack spacing={2}>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2 }}>
              {benefits.map((record) => (
                <Card key={record.id} variant="outlined">
                  {isEmployee ? (
                    <BenefitCard benefit={record} labelSchema={labelSchema} />
                  ) : (
                    <CardActionArea
                      onClick={() => openBenefit(record)}
                      aria-label={`Edit ${choiceLabel(labelSchema, "benefit_type", record.benefit_type, record)}`}
                    >
                      <BenefitCard benefit={record} labelSchema={labelSchema} />
                    </CardActionArea>
                  )}
                </Card>
              ))}
            </Box>
            <Box>
              <Typography variant="subtitle2" component="p" color="text.secondary" sx={{ mb: 1 }}>
                Enrollment from the benefits dynamic panel. Saved enrollments are read-only here.
              </Typography>
              <SurveyForm
                schema={schemas.benefitsPanel}
                data={panelData}
                readOnly
                elementIdPrefix={`benefits_${employee.id}_`}
                configure={(model) => { model.showTitle = false; }}
              />
            </Box>
          </Stack>
        )}
      </Section>
      {isEmployee ? null : (
        <BenefitForm open={benefitOpen} benefit={benefit} onClose={closeBenefit} />
      )}
    </Stack>
  );
}
