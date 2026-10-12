const employeeDemo = {
  first_name: "Maya",
  last_name: "Chen",
  date_of_birth: "1994-09-03",
  start_date: "2023-04-17",
  job_title: "software_engineer",
  department: "engineering",
  work_email: "maya.chen@acme.com",
  phone_number: "07123456789",
  "address-line-1": "18 Baker Street",
  "address-line-2": "Flat 2",
  "town-city": "London",
  county: "Greater London",
  postcode: "AB123CD",
  country: "United Kingdom",
  emergency_contact_full_name: "Liam Chen",
  emergency_contact_phone_number: "07987654321",
  emergency_contact_relationship: "sibling"
};

export const registrationDemoData = {
  ...employeeDemo
};

export const editDemoData = {
  ...employeeDemo,
  employee_id: "EMP-9002"
};

export const searchDemoData = {
  last_name: "Thompson",
  date_of_birth: "1990-04-12",
  employee_id: "EMP-1002"
};

export const reviewDemoData = {
  review_date: "2026-10-01",
  reviewer: "sarah_chen",
  quality: {
    accurate: { rating: 4 },
    pressure: { rating: 5 },
    issues: { rating: 4 },
    timely: { rating: 5 },
    details: { rating: 4 }
  },
  rating: 8,
  strengths: "Clear communication with the team.",
  areas_for_improvement: "Share status earlier in the week.",
  next_steps: "Lead the Q4 campaign."
};

export const leaveDemoData = {
  leave_type: "unpaid_leave",
  start_date: "2026-11-10",
  end_date: "2026-11-14",
  reason: "Family commitment",
  status: "pending"
};
