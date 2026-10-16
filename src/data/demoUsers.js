export const DEMO_PASSWORD = "demo1234";

export const demoUsers = [
  {
    id: "u-olivia-carter",
    username: "olivia.carter",
    password: DEMO_PASSWORD,
    fullName: "Olivia Carter",
    role: "hr"
  },
  {
    id: "u-james-patel",
    username: "james.patel",
    password: DEMO_PASSWORD,
    fullName: "James Patel",
    role: "hr"
  },
  {
    id: "u-emma-thompson",
    username: "emma.thompson",
    password: DEMO_PASSWORD,
    fullName: "Emma Thompson",
    role: "employee",
    employeeId: "emp-1002"
  },
  {
    id: "u-daniel-okonkwo",
    username: "daniel.okonkwo",
    password: DEMO_PASSWORD,
    fullName: "Daniel Okonkwo",
    role: "employee",
    employeeId: "emp-1044"
  },
  {
    id: "u-priya-shah",
    username: "priya.shah",
    password: DEMO_PASSWORD,
    fullName: "Priya Shah",
    role: "employee",
    employeeId: "emp-1108"
  },
  {
    id: "u-liam-thompson",
    username: "liam.thompson",
    password: DEMO_PASSWORD,
    fullName: "Liam Thompson",
    role: "employee",
    employeeId: "emp-1077"
  }
];

export function roleLabel(role) {
  return role === "hr" ? "HR" : "Employee";
}

export function listRoster() {
  return demoUsers.map((user) => ({
    value: user.username,
    text: `${user.fullName} — ${roleLabel(user.role)}`
  }));
}

export function toPublicUser(user) {
  return {
    id: user.id,
    username: user.username,
    fullName: user.fullName,
    role: user.role,
    employeeId: user.employeeId
  };
}

export function authenticate(username, password) {
  const match = demoUsers.find((user) => user.username === String(username || "").trim());
  if (!match || match.password !== password) return null;
  return toPublicUser(match);
}

export function userInitials(user) {
  const parts = String(user?.fullName || "").trim().split(/\s+/).filter(Boolean);
  const letters = `${parts[0]?.[0] || ""}${parts[1]?.[0] || ""}`;
  return letters.toUpperCase() || "?";
}
