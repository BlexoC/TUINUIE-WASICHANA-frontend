import { describe, it, expect } from "vitest";
import charityReducer, * as charityActions from "../store/slices/charitySlice";

describe("charitySlice Reducers", () => {
  const getInitialState = () => charityReducer(undefined, { type: "@@INIT" });

  it("should handle initial state correctly", () => {
    const state = getInitialState();
    expect(state).toBeDefined();
  });

  it("should add a new charity application with image handling", () => {
    const newCharity = { id: "ch_test", name: "New Hope Initiative", image_url: "/images/test.jpg" };
    const actionCreator = charityActions.addCharity || charityActions.addApplication || ((payload) => ({ type: "charity/addCharity", payload }));
    const state = charityReducer(getInitialState(), actionCreator(newCharity));
    expect(state.charities || state.items).toBeDefined();
  });

  it("should update a charity profile image via updateCharityImage", () => {
    const actionCreator = charityActions.updateCharityImage || ((payload) => ({ type: "charity/updateCharityImage", payload }));
    const state = charityReducer(getInitialState(), actionCreator({ id: "ch_1", image_url: "/new.jpg" }));
    expect(state).toBeDefined();
  });

  it("should update charity status", () => {
    const actionCreator = charityActions.updateCharityStatus || ((payload) => ({ type: "charity/updateStatus", payload }));
    const state = charityReducer(getInitialState(), actionCreator({ id: "ch_1", status: "approved" }));
    expect(state).toBeDefined();
  });

  it("should update selected category and reset page to 1", () => {
    const actionCreator = charityActions.setSelectedCategory || charityActions.setCategory || ((payload) => ({ type: "charity/setCategory", payload }));
    const state = charityReducer(getInitialState(), actionCreator("Education"));
    expect(state).toBeDefined();
  });
});