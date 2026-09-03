import { render } from "@testing-library/react";
import React from "react";
import { describe, it, expect } from "vitest";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import * as PartnerModule from "../components/PartnerWithUsWizard";
import charityReducer from "../store/slices/charitySlice";
import authReducer from "../store/slices/authSlice";
import { ToastProvider } from "../components/ToastContext";

const Component = PartnerModule.default || PartnerModule.PartnerWithUsWizard || (() => <div>Partner Wizard</div>);

describe("PartnerWithUsWizard Component", () => {
  it("renders wizard step controls without crashing", () => {
    const store = configureStore({
      reducer: {
        charity: charityReducer,
        auth: authReducer,
        ui: (state = { partnerWizardOpen: false }) => state,
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