import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { donationsApi, recurringPlansApi, paymentMethodsApi } from "../../lib/api";

// ---------------------------------------------------------------------------
// Thunks
//
// NOTE on payment gateways: this project has no live Stripe/PayPal/Daraja
// (M-Pesa) credentials wired up, so the actual "charge the card" /
// "send the STK push" step is simulated client-side (see DonationModal),
// exactly like the original mock UI did. What's different now is that the
// resulting transaction reference is posted to the real Flask API and
// lands in the real `donations` / `recurring_donation_plans` tables
// instead of being pushed into a fake in-memory array. Swapping in real
// Stripe Elements / PayPal SDK / Daraja calls later only touches the
// "get a provider_transaction_id" step — the API calls below don't change.
// ---------------------------------------------------------------------------

export const submitOneTimeDonation = createAsyncThunk(
  "donation/submitOneTime",
  async (payload, { rejectWithValue }) => {
    try {
      return await donationsApi.create(payload);
    } catch (err) {
      return rejectWithValue(err.message || "Donation failed");
    }
  }
);

// Creates (or reuses) a saved payment method, then a recurring plan against it.
export const submitRecurringDonation = createAsyncThunk(
  "donation/submitRecurring",
  async (
    {
      charity_id,
      project_id,
      amount,
      currency,
      frequency,
      day_of_month,
      is_anonymous,
      provider,
      provider_customer_id,
      provider_payment_method_id,
    },
    { rejectWithValue }
  ) => {
    try {
      const paymentMethod = await paymentMethodsApi.create({
        provider,
        provider_customer_id,
        provider_payment_method_id,
      });
      return await recurringPlansApi.create({
        charity_id,
        project_id,
        payment_method_id: paymentMethod.id,
        amount,
        currency,
        frequency,
        day_of_month,
        is_anonymous,
      });
    } catch (err) {
      return rejectWithValue(err.message || "Could not set up recurring donation");
    }
  }
);

export const fetchMyDonations = createAsyncThunk(
  "donation/fetchMine",
  async (params, { rejectWithValue }) => {
    try {
      return await donationsApi.listMine(params);
    } catch (err) {
      return rejectWithValue(err.message || "Failed to load donations");
    }
  }
);

// Used by the charity dashboard to see donations made to that charity.
export const fetchDonationsForCharity = createAsyncThunk(
  "donation/fetchForCharity",
  async ({ charityId, params }, { rejectWithValue }) => {
    try {
      const result = await donationsApi.listForCharity(charityId, params);
      return result;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to load charity donations");
    }
  }
);

export const fetchMyRecurringPlans = createAsyncThunk(
  "donation/fetchMyPlans",
  async (params, { rejectWithValue }) => {
    try {
      return await recurringPlansApi.list(params);
    } catch (err) {
      return rejectWithValue(err.message || "Failed to load recurring plans");
    }
  }
);

export const updateRecurringPlan = createAsyncThunk(
  "donation/updatePlan",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      return await recurringPlansApi.update(id, payload);
    } catch (err) {
      return rejectWithValue(err.message || "Failed to update plan");
    }
  }
);

export const cancelRecurringPlan = createAsyncThunk(
  "donation/cancelPlan",
  async (id, { rejectWithValue }) => {
    try {
      await recurringPlansApi.cancel(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to cancel plan");
    }
  }
);

export const fetchPaymentMethods = createAsyncThunk(
  "donation/fetchPaymentMethods",
  async (_, { rejectWithValue }) => {
    try {
      return await paymentMethodsApi.list();
    } catch (err) {
      return rejectWithValue(err.message || "Failed to load payment methods");
    }
  }
);

export const removePaymentMethod = createAsyncThunk(
  "donation/removePaymentMethod",
  async (id, { rejectWithValue }) => {
    try {
      await paymentMethodsApi.remove(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to remove payment method");
    }
  }
);

const initialState = {
  isDonationModalOpen: false,
  activeCharityForDonation: null,
  frequency: "one-time",
  selectedAmount: 25,
  customAmount: "",
  currency: "USD",
  paymentMethod: "mpesa",
  mpesaPhoneNumber: "0712345678",
  isProcessing: false,
  mpesaStkSent: false,
  mpesaStkCountdown: 0,
  lastDonationSuccess: null,
  donationError: null,

  // Populated from the API — no seeded/mock rows.
  donations: [],
  donationsPagination: null,
  charityDonations: [],
  charityDonationsPagination: null,
  subscriptions: [], // recurring plans, from /recurring-plans
  plansPagination: null,
  paymentMethods: [],

  // Gamification badges have no backend model yet, so this starts empty
  // rather than pretending achievements were already unlocked.
  donorBadges: [],

  activeReceiptDonation: null,
  isReceiptModalOpen: false,
  impactCalculatorAmount: 25,
};

const donationSlice = createSlice({
  name: "donation",
  initialState,
  reducers: {
    openDonationModal: (state, action) => {
      state.isDonationModalOpen = true;
      state.activeCharityForDonation = action.payload.charity || null;
      if (action.payload.presetAmount) {
        state.selectedAmount = action.payload.presetAmount;
        state.customAmount = "";
      }
      state.mpesaStkSent = false;
      state.isProcessing = false;
      state.donationError = null;
    },
    closeDonationModal: (state) => {
      state.isDonationModalOpen = false;
      state.mpesaStkSent = false;
      state.isProcessing = false;
    },
    setDonationFrequency: (state, action) => {
      state.frequency = action.payload;
    },
    setSelectedAmount: (state, action) => {
      state.selectedAmount = action.payload;
      state.customAmount = "";
    },
    setCustomAmount: (state, action) => {
      state.customAmount = action.payload;
      if (action.payload) {
        state.selectedAmount = 0;
      }
    },
    setCurrency: (state, action) => {
      state.currency = action.payload;
    },
    setPaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
    },
    setMpesaPhoneNumber: (state, action) => {
      state.mpesaPhoneNumber = action.payload;
    },
    startPaymentProcessing: (state) => {
      state.isProcessing = true;
      state.donationError = null;
    },
    setMpesaStkSent: (state, action) => {
      state.mpesaStkSent = action.payload;
    },
    paymentFailed: (state, action) => {
      state.isProcessing = false;
      state.mpesaStkSent = false;
      state.donationError = action.payload || "Payment could not be completed";
    },
    clearLastDonation: (state) => {
      state.lastDonationSuccess = null;
    },
    openReceiptModal: (state, action) => {
      state.activeReceiptDonation = action.payload;
      state.isReceiptModalOpen = true;
    },
    closeReceiptModal: (state) => {
      state.isReceiptModalOpen = false;
      state.activeReceiptDonation = null;
    },
    setImpactCalculatorAmount: (state, action) => {
      state.impactCalculatorAmount = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // One-time donation
      .addCase(submitOneTimeDonation.pending, (state) => {
        state.isProcessing = true;
        state.donationError = null;
      })
      .addCase(submitOneTimeDonation.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.mpesaStkSent = false;
        state.lastDonationSuccess = action.payload;
        state.donations.unshift(action.payload);
      })
      .addCase(submitOneTimeDonation.rejected, (state, action) => {
        state.isProcessing = false;
        state.mpesaStkSent = false;
        state.donationError = action.payload;
      })
      // Recurring donation
      .addCase(submitRecurringDonation.pending, (state) => {
        state.isProcessing = true;
        state.donationError = null;
      })
      .addCase(submitRecurringDonation.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.mpesaStkSent = false;
        state.lastDonationSuccess = action.payload;
        state.subscriptions.unshift(action.payload);
      })
      .addCase(submitRecurringDonation.rejected, (state, action) => {
        state.isProcessing = false;
        state.mpesaStkSent = false;
        state.donationError = action.payload;
      })
      // History
      .addCase(fetchMyDonations.fulfilled, (state, action) => {
        state.donations = action.payload.items || [];
        state.donationsPagination = action.payload.pagination || null;
      })
      .addCase(fetchDonationsForCharity.fulfilled, (state, action) => {
        state.charityDonations = action.payload.items || [];
        state.charityDonationsPagination = action.payload.pagination || null;
      })
      .addCase(fetchMyRecurringPlans.fulfilled, (state, action) => {
        state.subscriptions = action.payload.items || [];
        state.plansPagination = action.payload.pagination || null;
      })
      .addCase(updateRecurringPlan.fulfilled, (state, action) => {
        const idx = state.subscriptions.findIndex((s) => s.id === action.payload.id);
        if (idx !== -1) state.subscriptions[idx] = action.payload;
      })
      .addCase(cancelRecurringPlan.fulfilled, (state, action) => {
        const sub = state.subscriptions.find((s) => s.id === action.payload);
        if (sub) sub.status = "cancelled";
      })
      // Payment methods
      .addCase(fetchPaymentMethods.fulfilled, (state, action) => {
        state.paymentMethods = action.payload || [];
      })
      .addCase(removePaymentMethod.fulfilled, (state, action) => {
        state.paymentMethods = state.paymentMethods.filter((m) => m.id !== action.payload);
      });
  },
});

export const {
  openDonationModal,
  closeDonationModal,
  setDonationFrequency,
  setSelectedAmount,
  setCustomAmount,
  setCurrency,
  setPaymentMethod,
  setMpesaPhoneNumber,
  startPaymentProcessing,
  setMpesaStkSent,
  paymentFailed,
  clearLastDonation,
  openReceiptModal,
  closeReceiptModal,
  setImpactCalculatorAmount,
} = donationSlice.actions;

export default donationSlice.reducer;
