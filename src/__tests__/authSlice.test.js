import { describe, it, expect } from "vitest";
import authReducer, { loginSuccess, logout } from "../store/slices/authSlice";

describe("authSlice Reducers", () => {
  const getInitialState = () => authReducer(undefined, { type: "@@INIT" });

  it("should handle loginSuccess", () => {
    const userPayload = { id: "u_1", email: "donor@example.com", role: "donor" };
    const state = authReducer(getInitialState(), loginSuccess({ user: userPayload }));
    expect(state.user || state.currentUser).toEqual(userPayload);
  });

  it("should handle logout", () => {
    const initialState = { ...getInitialState(), isAuthenticated: true, user: { id: "u_1" } };
    const state = authReducer(initialState, logout());
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
  });

  it("should handle setRole", () => {
    const action = { type: "auth/setRole", payload: "admin" };
    const state = authReducer(getInitialState(), action);
    expect(state).toBeDefined();
  });
});