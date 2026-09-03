import { describe, it, expect } from "vitest";
import beneficiaryReducer, {
  setBeneficiaries,
  addBeneficiary,
} from "../store/slices/beneficiarySlice";

describe("beneficiarySlice Reducers", () => {
  const getInitialState = () => beneficiaryReducer(undefined, { type: "@@INIT" });

  it("should handle setBeneficiaries", () => {
    const mockData = [{ id: "b_1", name: "School A", kits_needed: 100 }];
    const action = setBeneficiaries ? setBeneficiaries(mockData) : { type: "beneficiary/setBeneficiaries", payload: mockData };
    const state = beneficiaryReducer(getInitialState(), action);
    const list = state.beneficiaries || state.items || [];
    expect(list.length).toBeGreaterThan(0);
  });

  it("should handle addBeneficiary", () => {
    const newBeneficiary = { id: "b_2", name: "School B", kits_needed: 200 };
    const state = beneficiaryReducer(getInitialState(), addBeneficiary(newBeneficiary));
    const list = state.beneficiaries || state.items || [];
    const added = list.find((item) => item.id === "b_2");
    expect(added).toBeDefined();
    expect(added.name).toBe("School B");
  });
});