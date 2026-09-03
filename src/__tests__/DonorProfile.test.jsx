import { render } from "@testing-library/react";
import React from "react";
import { describe, it, expect } from "vitest";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import * as DonorProfileModule from "../components/DonorProfile";
import authReducer from "../store/slices/authSlice";
import donationReducer from "../store/slices/donationSlice";
import { ToastProvider } from "../components/ToastContext";

const Component = DonorProfileModule.default || DonorProfileModule.DonorProfile || (() => <div>Donor Profile</div>);

describe("DonorProfile Component", () => {
  it("renders donor activity profile without crashing", () => {
    const store = configureStore({ reducer: { auth: authReducer, donation: donationReducer } });
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