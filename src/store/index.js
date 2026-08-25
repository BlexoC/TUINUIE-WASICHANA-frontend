import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import authReducer from "./slices/authSlice";
import charityReducer from "./slices/charitySlice";
import donationReducer from "./slices/donationSlice";
import beneficiaryReducer from "./slices/beneficiarySlice";
import adminReducer from "./slices/adminSlice";
import notificationReducer from "./slices/notificationSlice";
import languageReducer from "./slices/languageSlice";
const store = configureStore({
  reducer: {
    auth: authReducer,
    charity: charityReducer,
    donation: donationReducer,
    beneficiary: beneficiaryReducer,
    admin: adminReducer,
    notification: notificationReducer,
    language: languageReducer
  }
});
const useAppDispatch = () => useDispatch();
const useAppSelector = useSelector;
export {
  store,
  useAppDispatch,
  useAppSelector
};
