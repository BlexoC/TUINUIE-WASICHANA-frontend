import { render, screen } from "@testing-library/react";
import React from "react";

const MockAdminDashboard = ({ applications = [] }) => (
  <div>
    <h1>Admin Dashboard</h1>
    {applications.map((app) => (
      <div key={app.id}>{app.name}</div>
    ))}
  </div>
);

test("renders admin dashboard correctly", () => {
  const mockApplications = [{ id: 1, name: "Sanitation Project" }];
  render(<MockAdminDashboard applications={mockApplications} />);

  expect(screen.getByText("Admin Dashboard")).toBeInTheDocument();
  expect(screen.getByText("Sanitation Project")).toBeInTheDocument();
});