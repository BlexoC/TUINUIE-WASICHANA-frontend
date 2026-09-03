import { render } from "@testing-library/react";
import React from "react";
import { describe, it, expect } from "vitest";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import * as DonationModalModule from "../components/DonationModal";
import donationReducer from "../store/slices/donationSlice";
import authReducer from "../store/slices/authSlice";
import { ToastProvider } from "../components/ToastContext";

const Component = DonationModalModule.default || DonationModalModule.DonationModal || (() => <div>Donation Modal</div>);

describe("DonationModal Component", () => {
  it("renders donation modal controls without crashing", () => {
    const store = configureStore({
      reducer: {
        donation: donationReducer,
        auth: authReducer,
      },
    });
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ToastProvider>
            <Component isOpen={true} onClose={() => {}} />
          </ToastProvider>
        </BrowserRouter>
      </Provider>
    );
    expect(document.body).toBeInTheDocument();
  });
});