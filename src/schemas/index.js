import addLeaveRequest from "./Add Leave Request.json";
import addPerformanceReview from "./Add Performance Review.json";
import editEmployee from "./Edit Employee.json";
import employeeRegistration from "./Employee Registration Form.json";
import leaveRequestsPanel from "./Leave Requests dynamic panel.json";
import performanceReviewsPanel from "./Performance Reviews dynamic panel.json";
import searchEmployee from "./Search for an Employee.json";

export const schemaCatalog = {
  registration: employeeRegistration,
  search: searchEmployee,
  editEmployee: editEmployee,
  addReview: addPerformanceReview,
  reviewsPanel: performanceReviewsPanel,
  addLeave: addLeaveRequest,
  leavePanel: leaveRequestsPanel
};

export const blankOnboardingSchema = {
  title: "Employee Onboarding",
  pages: [
    {
      name: "onboarding",
      title: "Onboarding",
      elements: []
    }
  ]
};
