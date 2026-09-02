import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";

import { LoginPage } from "../components/LoginPage";
import authReducer from "../store/slices/authSlice";

// Mock the toast context so the test does not depend on the real UI toast system.
vi.mock("../components/ToastContext", () => ({
  useToast: () => ({
    showToast: vi.fn(),
  }),
}));

// Create a small test store containing the real authentication reducer.
const createTestStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
    },
  });

// Helper function for rendering LoginPage with its required providers.
const renderLoginPage = (initialRole = null) => {
  const store = createTestStore();

  return {
    store,
    ...render(
      <Provider store={store}>
        <BrowserRouter>
          <LoginPage initialRole={initialRole} />
        </BrowserRouter>
      </Provider>
    ),
  };
};

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

describe("Tuinue Wasichana LoginPage", () => {
  test("renders the login role selection page", () => {
    renderLoginPage();

    expect(screen.getByText("Welcome!!!")).toBeInTheDocument();
    expect(screen.getByText("I am logging in as")).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /admin/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /user/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /register/i })
    ).toBeInTheDocument();
  });

  test("opens the user login form when User is selected", () => {
    renderLoginPage();

    fireEvent.click(
      screen.getByRole("button", { name: /user/i })
    );

    expect(screen.getByText("User Authentication")).toBeInTheDocument();
    expect(screen.getByLabelText("Email Address *")).toBeInTheDocument();
    expect(screen.getByLabelText("Password *")).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /sign in to account/i })
    ).toBeInTheDocument();
  });

  test("shows an error when user submits without an email", () => {
    renderLoginPage("user");

    const passwordInput = screen.getByLabelText("Password *");

    fireEvent.change(passwordInput, {
      target: { value: "Password123!" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: /sign in to account/i })
    );

    expect(
      screen.getByText("Please enter a valid email address.")
    ).toBeInTheDocument();
  });

  test("shows an error when user submits without a password", () => {
    renderLoginPage("user");

    const emailInput = screen.getByLabelText("Email Address *");

    fireEvent.change(emailInput, {
      target: { value: "amina@example.org" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: /sign in to account/i })
    );

    expect(
      screen.getByText("Please enter your password.")
    ).toBeInTheDocument();
  });

  test("allows a user to sign in successfully", async () => {
    const { store } = renderLoginPage("user");

    const emailInput = screen.getByLabelText("Email Address *");
    const passwordInput = screen.getByLabelText("Password *");

    fireEvent.change(emailInput, {
      target: { value: "amina@example.org" },
    });

    fireEvent.change(passwordInput, {
      target: { value: "Password123!" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: /sign in to account/i })
    );

    await waitFor(() => {
      const state = store.getState().auth;

      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toBeTruthy();
      expect(state.user.email).toBe("amina@example.org");
      expect(state.user.role).toBe("donor");
      expect(state.token).toContain("jwt_token_");
    });
  });

  test("shows the admin security key field for administrator login", () => {
    renderLoginPage("admin");

    expect(
      screen.getByText("Admin Authentication")
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("Admin Security Key / Master PIN *")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Demo: TW-ADMIN-2026")
    ).toBeInTheDocument();
  });

  test("rejects an invalid admin security key", () => {
    renderLoginPage("admin");

    fireEvent.change(
      screen.getByLabelText("Email Address *"),
      {
        target: { value: "admin@tuinuewasichana.org" },
      }
    );

    fireEvent.change(
      screen.getByLabelText("Password *"),
      {
        target: { value: "AdminPassword123!" },
      }
    );

    fireEvent.change(
      screen.getByLabelText("Admin Security Key / Master PIN *"),
      {
        target: { value: "WRONG-KEY" },
      }
    );

    fireEvent.click(
      screen.getByRole("button", { name: /enter admin portal/i })
    );

    expect(
      screen.getByText(/invalid admin security key/i)
    ).toBeInTheDocument();
  });

  test("allows administrator login with the correct security key", async () => {
    const { store } = renderLoginPage("admin");

    fireEvent.change(
      screen.getByLabelText("Email Address *"),
      {
        target: { value: "admin@tuinuewasichana.org" },
      }
    );

    fireEvent.change(
      screen.getByLabelText("Password *"),
      {
        target: { value: "AdminSecurePassword2026!" },
      }
    );

    fireEvent.change(
      screen.getByLabelText("Admin Security Key / Master PIN *"),
      {
        target: { value: "TW-ADMIN-2026" },
      }
    );

    fireEvent.click(
      screen.getByRole("button", { name: /enter admin portal/i })
    );

    await waitFor(() => {
      const state = store.getState().auth;

      expect(state.isAuthenticated).toBe(true);
      expect(state.user.role).toBe("admin");
      expect(state.user.email).toBe("admin@tuinuewasichana.org");
      expect(state.token).toContain("jwt_token_");
    });
  });

  test("opens the registration form", () => {
    renderLoginPage();

    fireEvent.click(
      screen.getByRole("button", { name: /register/i })
    );

    expect(
      screen.getByText("New Account Registration")
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("Full Name *")
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("Email Address *")
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("Password *")
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("Confirm Password *")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /create account/i })
    ).toBeInTheDocument();
  });

  test("rejects registration when passwords do not match", () => {
    renderLoginPage("register");

    fireEvent.change(
      screen.getByLabelText("Full Name *"),
      {
        target: { value: "Amina Kimani" },
      }
    );

    fireEvent.change(
      screen.getByLabelText("Email Address *"),
      {
        target: { value: "amina@example.org" },
      }
    );

    fireEvent.change(
      screen.getByLabelText("Password *"),
      {
        target: { value: "Password123!" },
      }
    );

    fireEvent.change(
      screen.getByLabelText("Confirm Password *"),
      {
        target: { value: "DifferentPassword!" },
      }
    );

    fireEvent.click(
      screen.getByRole("button", { name: /create account/i })
    );

    expect(
      screen.getByText(/passwords do not match/i)
    ).toBeInTheDocument();
  });

  test("successfully creates a donor account", async () => {
    const { store } = renderLoginPage("register");

    fireEvent.change(
      screen.getByLabelText("Full Name *"),
      {
        target: { value: "Amina Kimani" },
      }
    );

    fireEvent.change(
      screen.getByLabelText("Email Address *"),
      {
        target: { value: "amina@example.org" },
      }
    );

    fireEvent.change(
      screen.getByLabelText("Password *"),
      {
        target: { value: "Password123!" },
      }
    );

    fireEvent.change(
      screen.getByLabelText("Confirm Password *"),
      {
        target: { value: "Password123!" },
      }
    );

    fireEvent.click(
      screen.getByRole("button", { name: /create account/i })
    );

    await waitFor(() => {
      const state = store.getState().auth;

      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toBeTruthy();
      expect(state.user.username).toBe("Amina Kimani");
      expect(state.user.email).toBe("amina@example.org");
      expect(state.user.role).toBe("donor");
      expect(state.token).toContain("jwt_token_");
    });
  });
});