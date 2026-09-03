import donationReducer from "../store/slices/donationSlice";

test("handles donation state updates correctly", () => {
  const initialState = donationReducer(undefined, { type: "@@INIT" });
  expect(initialState).toBeDefined();

  const newState = donationReducer(initialState, { type: "UNKNOWN_ACTION" });
  expect(newState).toEqual(initialState);
});