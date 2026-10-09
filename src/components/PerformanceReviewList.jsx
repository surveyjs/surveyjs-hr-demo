import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import SurveyForm from "./SurveyForm.jsx";
import { byDateDesc, choiceLabel, formatDate, ratingLabel, toPanelRecords } from "../utils/records.js";

export default function PerformanceReviewList({ employee, panelSchema, labelSchema }) {
  const reviews = [...(employee.reviews || [])].sort(byDateDesc("review_date"));
  const panelData = { review_list: toPanelRecords(reviews) };

  return (
    <Stack spacing={2}>
      {reviews.length === 0 ? (
        <Typography color="text.secondary">No performance reviews yet.</Typography>
      ) : (
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2 }}>
          {reviews.map((review) => (
            <Card key={review.id} variant="outlined">
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                  <Typography variant="subtitle1">{formatDate(review.review_date)}</Typography>
                  <Chip size="small" color="primary" label={ratingLabel(labelSchema, review.rating)} />
                </Stack>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Reviewer: {choiceLabel(labelSchema, "reviewer", review.reviewer, review)}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>Strengths: </strong>{review.strengths || "—"}
                </Typography>
                {review.areas_for_improvement ? (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    <strong>Areas for improvement: </strong>{review.areas_for_improvement}
                  </Typography>
                ) : null}
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>Next steps: </strong>{review.next_steps || "—"}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
      {reviews.length > 0 && panelSchema ? (
        <Box>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
            Review collection from the performance-review dynamic panel. Historical rows are read-only.
          </Typography>
          <SurveyForm
            schema={panelSchema}
            data={panelData}
            readOnly
            elementIdPrefix={`reviews_${employee.id}_`}
          />
        </Box>
      ) : null}
    </Stack>
  );
}
