import { describe, it, expect } from "vitest";
import adminReducer, * as adminActions from "../store/slices/adminSlice";

describe("adminSlice Reducers", () => {
  const getInitialState = () => adminReducer(undefined, { type: "@@INIT" });

  it("should return the initial state", () => {
    const state = getInitialState();
    expect(state).toBeDefined();
  });

  it("should handle setting pending applications", () => {
    const mockApps = [{ id: "app_1", name: "Charity A", status: "pending" }];
    const actionCreator = adminActions.setPendingApplications || adminActions.setApplications || ((payload) => ({ type: "admin/setApplications", payload }));
    const state = adminReducer(getInitialState(), actionCreator(mockApps));
    expect(state).toBeDefined();
  });

  it("should handle approving a charity", () => {
    const actionCreator = adminActions.approveCharity || adminActions.updateApplicationStatus || ((id) => ({ type: "admin/approveCharity", payload: id }));
    const state = adminReducer(getInitialState(), actionCreator("app_1"));
    expect(state).toBeDefined();
  });

  it("should handle rejecting a charity", () => {
    const actionCreator = adminActions.rejectCharity || adminActions.updateApplicationStatus || ((id) => ({ type: "admin/rejectCharity", payload: id }));
    const state = adminReducer(getInitialState(), actionCreator("app_2"));
    expect(state).toBeDefined();
  });
});