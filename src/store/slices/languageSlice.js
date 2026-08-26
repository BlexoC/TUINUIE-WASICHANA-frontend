import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  currentLanguage: "en"
};
const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguage: (state, action) => {
      state.currentLanguage = action.payload;
    },
    toggleLanguage: (state) => {
      state.currentLanguage = state.currentLanguage === "en" ? "sw" : "en";
    }
  }
});
const { setLanguage, toggleLanguage } = languageSlice.actions;
var stdin_default = languageSlice.reducer;
export {
  stdin_default as default,
  languageSlice,
  setLanguage,
  toggleLanguage
};
