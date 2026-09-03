import { describe, it, expect } from "vitest";
import languageReducer, { setLanguage, toggleLanguage } from "../store/slices/languageSlice";

describe("languageSlice Reducers", () => {
  const getInitialState = () => languageReducer(undefined, { type: "@@INIT" });

  it("should handle setLanguage", () => {
    const state = languageReducer(getInitialState(), setLanguage("sw"));
    expect(state.currentLanguage || state.language || state.lang).toBe("sw");
  });

  it("should handle toggleLanguage", () => {
    const initialState = { ...getInitialState(), currentLanguage: "en" };
    const state = languageReducer(initialState, toggleLanguage());
    expect(state.currentLanguage || state.language || state.lang).not.toBe("en");
  });
});