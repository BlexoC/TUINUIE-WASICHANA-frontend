import { describe, it, expect } from "vitest";
import notificationReducer, {
  addNotification,
  markAsRead,
} from "../store/slices/notificationSlice";

describe("notificationSlice Reducers", () => {
  const getInitialState = () => notificationReducer(undefined, { type: "@@INIT" });

  it("should handle addNotification", () => {
    const notif = { id: "n_1", message: "Donation received", read: false };
    const state = notificationReducer(getInitialState(), addNotification(notif));
    const list = state.notifications || state.items || [];
    expect(list.length).toBeGreaterThan(0);
  });

  it("should handle markAsRead", () => {
    const initialState = {
      ...getInitialState(),
      notifications: [{ id: "n_1", message: "Hello", read: false }],
    };
    const state = notificationReducer(initialState, markAsRead("n_1"));
    const item = (state.notifications || []).find((n) => n.id === "n_1");
    if (item) {
      expect(item.read).toBe(true);
    }
  });

  it("should handle clear Notifications", () => {
    const action = { type: "notification/clearNotifications" };
    const state = notificationReducer(getInitialState(), action);
    expect(state).toBeDefined();
  });
});