import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import authReducer, { sessionExpired } from "./slices/authSlice";
import charityReducer from "./slices/charitySlice";
import donationReducer from "./slices/donationSlice";
import beneficiaryReducer from "./slices/beneficiarySlice";
import adminReducer from "./slices/adminSlice";
import notificationReducer from "./slices/notificationSlice";
import languageReducer from "./slices/languageSlice";
import { setUnauthorizedHandler } from "../lib/api";

const store = configureStore({
  reducer: {
    auth: authReducer,
    charity: charityReducer,
    donation: donationReducer,
    beneficiary: beneficiaryReducer,
    admin: adminReducer,
    notification: notificationReducer,
    language: languageReducer,
  },
});

// If the API client can't refresh an expired session, keep redux state in
// sync so the UI immediately reflects the logged-out state.
setUnauthorizedHandler(() => store.dispatch(sessionExpired()));

const useAppDispatch = () => useDispatch();
const useAppSelector = useSelector;

export { store, useAppDispatch, useAppSelector };
