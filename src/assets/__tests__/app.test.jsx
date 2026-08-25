import { store } from "../store";
import { setSelectedCategory } from "../store/slices/charitySlice";
import { setDonationFrequency, setSelectedAmount } from "../store/slices/donationSlice";
import { addBeneficiary } from "../store/slices/beneficiarySlice";
describe("Tuinue Wasichana Redux Store & Workflows", () => {
  test("initial state loads seed charities with pagination", () => {
    const state = store.getState().charity;
    expect(state.charities.length).toBeGreaterThanOrEqual(3);
    expect(state.selectedCategory).toBe("All");
  });
  test("filters charities by category", () => {
    store.dispatch(setSelectedCategory("Sanitary Distribution"));
    const state = store.getState().charity;
    expect(state.selectedCategory).toBe("Sanitary Distribution");
  });
  test("configures donation frequency and preset amount", () => {
    store.dispatch(setDonationFrequency("monthly"));
    store.dispatch(setSelectedAmount(50));
    const state = store.getState().donation;
    expect(state.frequency).toBe("monthly");
    expect(state.selectedAmount).toBe(50);
  });
  test("enrolls beneficiary in charity roster", () => {
    const newBen = {
      id: "ben_test_001",
      charity_id: "ch_heshima",
      full_name: "Jane Wambui",
      age: 15,
      school_name: "St. Marys Primary",
      grade_level: "Grade 8",
      kits_received: 1,
      attendance_rate: 98,
      story: "Test story",
      status: "active",
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    store.dispatch(addBeneficiary(newBen));
    const state = store.getState().beneficiary;
    expect(state.beneficiaries[0].full_name).toBe("Jane Wambui");
  });
});
