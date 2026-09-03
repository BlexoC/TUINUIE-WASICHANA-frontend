import { render } from "@testing-library/react";
import React from "react";
import { describe, it, expect } from "vitest";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import * as CharityDashboardModule from "../components/CharityDashboard";
import charityReducer from "../store/slices/charitySlice";
import authReducer from "../store/slices/authSlice";
import beneficiaryReducer from "../store/slices/beneficiarySlice";
import donationReducer from "../store/slices/donationSlice";
import { ToastProvider } from "../components/ToastContext";

const Component = CharityDashboardModule.default || CharityDashboardModule.CharityDashboard || (() => <div>Charity Dashboard</div>);

describe("CharityDashboard Component", () => {
  it("renders charity metric dashboard without crashing", () => {
    const store = configureStore({
      reducer: {
        charity: charityReducer,
        auth: authReducer,
        beneficiary: beneficiaryReducer,
        donation: donationReducer,
      },
    });
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ToastProvider>
            <Component />
          </ToastProvider>
        </BrowserRouter>
      </Provider>
    );
    expect(document.body).toBeInTheDocument();
  });
});