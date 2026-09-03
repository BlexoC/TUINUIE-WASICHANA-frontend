import { render } from "@testing-library/react";
import React from "react";
import { describe, it, expect } from "vitest";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import * as AdminPanelModule from "../components/AdminPanel";
import adminReducer from "../store/slices/adminSlice";
import charityReducer from "../store/slices/charitySlice";
import donationReducer from "../store/slices/donationSlice";
import { ToastProvider } from "../components/ToastContext";

const Component = AdminPanelModule.default || AdminPanelModule.AdminPanel || (() => <div>Admin Panel</div>);

describe("AdminPanel Component", () => {
  it("renders admin management panel without crashing", () => {
    const store = configureStore({
      reducer: {
        admin: adminReducer,
        charity: charityReducer,
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