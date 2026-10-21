import addLeaveRequest from "./Add Leave Request.json";
import addPerformanceReview from "./Add Performance Review.json";
import benefitEnrollment from "./Benefit Enrollment.json";
import benefitsPanel from "./Benefits dynamic panel.json";
import editEmployee from "./Edit Employee.json";
import editSalary from "./Edit Salary.json";
import employeeRegistration from "./Employee Registration Form.json";
import leaveRequestsPanel from "./Leave Requests dynamic panel.json";
import paymentHistoryPanel from "./Payment History dynamic panel.json";
import performanceReviewsPanel from "./Performance Reviews dynamic panel.json";
import searchEmployee from "./Search for an Employee.json";

export const schemaCatalog = {
  registration: employeeRegistration,
  search: searchEmployee,
  editEmployee: editEmployee,
  addReview: addPerformanceReview,
  reviewsPanel: performanceReviewsPanel,
  addLeave: addLeaveRequest,
  leavePanel: leaveRequestsPanel,
  editSalary: editSalary,
  paymentPanel: paymentHistoryPanel,
  addBenefit: benefitEnrollment,
  benefitsPanel: benefitsPanel
};

if (import.meta.hot) {
  import.meta.hot.accept([
    "./Add Leave Request.json",
    "./Add Performance Review.json",
    "./Edit Employee.json",
    "./Employee Registration Form.json",
    "./Leave Requests dynamic panel.json",
    "./Payment History dynamic panel.json",
    "./Performance Reviews dynamic panel.json",
    "./Search for an Employee.json",
    "./Edit Salary.json",
    "./Benefit Enrollment.json",
    "./Benefits dynamic panel.json"
  ], () => {
    window.location.reload();
  });
}

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
