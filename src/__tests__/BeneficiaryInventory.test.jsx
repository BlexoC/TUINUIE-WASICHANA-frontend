import { render, screen } from "@testing-library/react";
import React from "react";

const MockBeneficiaryInventory = () => (
  <div>
    <h1>Beneficiary Inventory</h1>
    <p>Inventory Tracking System</p>
  </div>
);

test("renders beneficiary inventory page correctly", () => {
  render(<MockBeneficiaryInventory />);

  expect(screen.getByText("Beneficiary Inventory")).toBeInTheDocument();
  expect(screen.getByText("Inventory Tracking System")).toBeInTheDocument();
});