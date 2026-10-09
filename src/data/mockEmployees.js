const quality = (accurate, pressure, issues, timely, details) => ({
  accurate: { rating: accurate },
  pressure: { rating: pressure },
  issues: { rating: issues },
  timely: { rating: timely },
  details: { rating: details }
});

export const mockEmployees = [
  {
    id: "emp-1002",
    status: "active",
    first_name: "Emma",
    last_name: "Thompson",
    date_of_birth: "1990-04-12",
    employee_id: "EMP-1002",
    start_date: "2022-01-15",
    job_title: "marketing_manager",
    department: "marketing",
    work_email: "emma.thompson@acme.com",
    phone_number: "(415) 555-0147",
    "address-line-1": "456 Market St",
    "town-city": "San Francisco",
    county: "CA",
    postcode: "94105",
    country: "United States",
    emergency_contact_full_name: "Robert Thompson",
    emergency_contact_phone_number: "41555501901",
    emergency_contact_relationship: "parent",
    reviews: [
      {
        id: "review-1",
        review_date: "2024-03-15",
        reviewer: "sarah_chen",
        rating: 4,
        quality: quality(4, 4, 4, 4, 5),
        strengths: "Leadership, collaboration",
        areas_for_improvement: "",
        next_steps: "Take on more strategic projects"
      },
      {
        id: "review-2",
        review_date: "2023-03-10",
        reviewer: "david_kim",
        rating: 5,
        quality: quality(5, 5, 5, 5, 5),
        strengths: "Strong execution",
        areas_for_improvement: "",
        next_steps: "Mentor junior team members"
      },
      {
        id: "review-3",
        review_date: "2022-03-08",
        reviewer: "lisa_wang",
        rating: 4,
        quality: quality(4, 4, 3, 4, 4),
        strengths: "Quick learner",
        areas_for_improvement: "",
        next_steps: "Grow domain expertise"
      }
    ],
    leaveRequests: [
      {
        id: "leave-1",
        leave_type: "annual_leave",
        start_date: "2024-06-10",
        end_date: "2024-06-14",
        status: "approved"
      },
      {
        id: "leave-2",
        leave_type: "sick_leave",
        start_date: "2024-02-05",
        end_date: "2024-02-06",
        status: "approved"
      }
    ]
  },
  {
    id: "emp-1044",
    status: "active",
    first_name: "Daniel",
    last_name: "Okonkwo",
    date_of_birth: "1988-11-02",
    employee_id: "EMP-1044",
    start_date: "2019-06-03",
    job_title: "software_engineer",
    department: "engineering",
    work_email: "daniel.okonkwo@acme.com",
    phone_number: "02079460111",
    "address-line-1": "18 Bishopsgate",
    "town-city": "London",
    county: "Greater London",
    postcode: "AB123CD",
    country: "United Kingdom",
    emergency_contact_full_name: "Ada Okonkwo",
    emergency_contact_phone_number: "02079460112",
    emergency_contact_relationship: "spouse-partner",
    reviews: [],
    leaveRequests: []
  },
  {
    id: "emp-1108",
    status: "active",
    first_name: "Priya",
    last_name: "Shah",
    date_of_birth: "1995-07-21",
    employee_id: "EMP-1108",
    start_date: "2021-09-01",
    job_title: "product_manager",
    department: "product",
    work_email: "priya.shah@acme.com",
    phone_number: "01632960188",
    "address-line-1": "4 Wharf Lane",
    "town-city": "Manchester",
    county: "Greater Manchester",
    postcode: "CD214EF",
    country: "United Kingdom",
    emergency_contact_full_name: "Anika Shah",
    emergency_contact_phone_number: "01632960189",
    emergency_contact_relationship: "sibling",
    reviews: [],
    leaveRequests: []
  },
  {
    id: "emp-1077",
    status: "active",
    first_name: "Liam",
    last_name: "Thompson",
    date_of_birth: "1992-01-30",
    employee_id: "EMP-1077",
    start_date: "2020-04-20",
    job_title: "other",
    "job_title-Comment": "Finance Analyst",
    department: "finance",
    work_email: "liam.thompson@acme.com",
    phone_number: "01134960123",
    "address-line-1": "9 Park Row",
    "town-city": "Leeds",
    county: "West Yorkshire",
    postcode: "EF345GH",
    country: "United Kingdom",
    emergency_contact_full_name: "Nora Thompson",
    emergency_contact_phone_number: "01134960124",
    emergency_contact_relationship: "parent",
    reviews: [],
    leaveRequests: []
  }
];
