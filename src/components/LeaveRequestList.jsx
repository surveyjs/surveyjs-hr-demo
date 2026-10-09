import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import SurveyForm from "./SurveyForm.jsx";
import { byDateDesc, choiceLabel, formatDate, toPanelRecords } from "../utils/records.js";

const STATUS_COLOR = {
  approved: "success",
  pending: "warning",
  declined: "error"
};

export default function LeaveRequestList({ employee, panelSchema, labelSchema }) {
  const requests = [...(employee.leaveRequests || [])].sort(byDateDesc("start_date"));
  const panelData = { leave_list: toPanelRecords(requests) };

  return (
    <Stack spacing={2}>
      {requests.length === 0 ? (
        <Typography color="text.secondary">No leave requests yet.</Typography>
      ) : (
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2 }}>
          {requests.map((request) => (
            <Card key={request.id} variant="outlined">
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                  <Typography variant="subtitle1">
                    {choiceLabel(labelSchema, "leave_type", request.leave_type, request)}
                  </Typography>
                  <Chip
                    size="small"
                    color={STATUS_COLOR[request.status] || "default"}
                    label={choiceLabel(labelSchema, "status", request.status, request)}
                  />
                </Stack>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {formatDate(request.start_date)} – {formatDate(request.end_date)}
                </Typography>
                {request.reason ? (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    <strong>Reason: </strong>{request.reason}
                  </Typography>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
      {requests.length > 0 && panelSchema ? (
        <Box>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
            Leave collection from the leave-request dynamic panel. Saved requests are read-only here.
          </Typography>
          <SurveyForm
            schema={panelSchema}
            data={panelData}
            readOnly
            elementIdPrefix={`leave_${employee.id}_`}
          />
        </Box>
      ) : null}
    </Stack>
  );
}
