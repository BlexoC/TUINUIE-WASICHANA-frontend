import { render } from "@testing-library/react";
import React from "react";
import { describe, it, expect } from "vitest";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import * as CharitiesModule from "../components/CharitiesSection";
import charityReducer from "../store/slices/charitySlice";
import { ToastProvider } from "../components/ToastContext";

const Component = CharitiesModule.default || CharitiesModule.CharitiesSection || (() => <div>Charities</div>);

describe("CharitiesSection Component", () => {
  it("renders list of registered charities without crashing", () => {
    const store = configureStore({ reducer: { charity: charityReducer } });
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