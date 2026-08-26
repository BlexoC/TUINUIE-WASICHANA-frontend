import { createSlice } from "@reduxjs/toolkit";
const initialDonations = [
  {
    id: "don_101",
    donor_id: "usr_donor_demo",
    donor_name: "Amina Kimani",
    donor_email: "amina.kimani@example.org",
    charity_id: "ch_heshima",
    charity_name: "Heshima Project",
    amount: 2500,
    currency: "KES",
    frequency: "one-time",
    payment_method: "mpesa",
    payment_status: "completed",
    mpesa_phone: "+254 712 345 890",
    mpesa_receipt: "QK982HX982",
    is_anonymous: false,
    message: "Keep up the remarkable work keeping girls in school!",
    created_at: new Date(Date.now() - 2 * 3600 * 1e3).toISOString()
  },
  {
    id: "don_102",
    donor_id: "usr_donor_demo",
    donor_name: "Amina Kimani",
    donor_email: "amina.kimani@example.org",
    charity_id: "ch_emergency_kits",
    charity_name: "Emergency Dignity Kits Distribution",
    amount: 5e3,
    currency: "KES",
    frequency: "monthly",
    payment_method: "stripe",
    payment_status: "completed",
    stripe_payment_id: "pi_3MtwL24xNz821",
    is_anonymous: false,
    message: "Monthly commitment for 10 schoolgirls kits.",
    created_at: new Date(Date.now() - 24 * 3600 * 1e3).toISOString()
  },
  {
    id: "don_103",
    donor_id: "usr_donor_other",
    donor_name: "Anonymous Supporter",
    charity_id: "ch_workshops",
    charity_name: "Menstrual Health Education Workshops",
    amount: 1e4,
    currency: "KES",
    frequency: "one-time",
    payment_method: "mpesa",
    payment_status: "completed",
    mpesa_receipt: "RL331KJ110",
    is_anonymous: true,
    created_at: new Date(Date.now() - 48 * 3600 * 1e3).toISOString()
  }
];
const initialSubscriptions = [
  {
    id: "sub_001",
    donor_id: "usr_donor_demo",
    donor_name: "Amina Kimani",
    charity_id: "ch_emergency_kits",
    charity_name: "Emergency Dignity Kits Distribution",
    amount: 5e3,
    currency: "KES",
    frequency: "monthly",
    payment_method: "stripe",
    status: "active",
    next_billing_date: "2026-09-24",
    created_at: new Date(Date.now() - 30 * 24 * 3600 * 1e3).toISOString()
  },
  {
    id: "sub_002",
    donor_id: "usr_donor_demo",
    donor_name: "Amina Kimani",
    charity_id: "ch_heshima",
    charity_name: "Heshima Project",
    amount: 2500,
    currency: "KES",
    frequency: "monthly",
    payment_method: "mpesa",
    status: "active",
    next_billing_date: "2026-09-15",
    created_at: new Date(Date.now() - 15 * 24 * 3600 * 1e3).toISOString()
  }
];
const initialBadges = [
  {
    id: "badge_first_gift",
    title: "Seed of Hope",
    description: "Made your first donation to sponsor menstrual hygiene",
    icon: "\u{1F331}",
    unlocked: true,
    unlocked_at: "2026-01-10"
  },
  {
    id: "badge_monthly_hero",
    title: "Dignity Guardian",
    description: "Enrolled in an ongoing monthly hygiene pack pledge",
    icon: "\u{1F451}",
    unlocked: true,
    unlocked_at: "2026-03-15"
  },
  {
    id: "badge_multi_county",
    title: "Cross-County Champion",
    description: "Funded programs in 2 or more Kenyan counties",
    icon: "\u{1F1F0}\u{1F1EA}",
    unlocked: true,
    unlocked_at: "2026-05-20"
  },
  {
    id: "badge_advocate",
    title: "Voice for Girls",
    description: "Shared an active charity campaign with the community",
    icon: "\u{1F4E3}",
    unlocked: false
  }
];
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
  donations: initialDonations,
  subscriptions: initialSubscriptions,
  donorBadges: initialBadges,
  activeReceiptDonation: null,
  isReceiptModalOpen: false,
  impactCalculatorAmount: 25
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
    },
    setMpesaStkSent: (state, action) => {
      state.mpesaStkSent = action.payload;
    },
    paymentCompletedSuccess: (state, action) => {
      state.isProcessing = false;
      state.mpesaStkSent = false;
      state.lastDonationSuccess = action.payload;
      state.donations.unshift(action.payload);
      if (action.payload.frequency === "monthly") {
        const nextDate = /* @__PURE__ */ new Date();
        nextDate.setMonth(nextDate.getMonth() + 1);
        state.subscriptions.unshift({
          id: `sub_${Date.now()}`,
          donor_id: action.payload.donor_id || "usr_donor_demo",
          donor_name: action.payload.donor_name || "Generous Donor",
          charity_id: action.payload.charity_id,
          charity_name: action.payload.charity_name,
          amount: action.payload.amount,
          currency: action.payload.currency,
          frequency: "monthly",
          payment_method: action.payload.payment_method,
          status: "active",
          next_billing_date: nextDate.toISOString().split("T")[0],
          created_at: (/* @__PURE__ */ new Date()).toISOString()
        });
      }
    },
    paymentFailed: (state) => {
      state.isProcessing = false;
      state.mpesaStkSent = false;
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
    updateSubscriptionStatus: (state, action) => {
      const sub = state.subscriptions.find((s) => s.id === action.payload.id);
      if (sub) {
        sub.status = action.payload.status;
      }
    },
    adjustSubscriptionAmount: (state, action) => {
      const sub = state.subscriptions.find((s) => s.id === action.payload.id);
      if (sub) {
        sub.amount = action.payload.amount;
      }
    },
    changeSubscriptionBillingDate: (state, action) => {
      const sub = state.subscriptions.find((s) => s.id === action.payload.id);
      if (sub) {
        sub.billing_day = action.payload.billing_day;
        sub.next_billing_date = action.payload.next_date;
      }
    },
    switchSubscriptionPaymentMethod: (state, action) => {
      const sub = state.subscriptions.find((s) => s.id === action.payload.id);
      if (sub) {
        sub.payment_method = action.payload.payment_method;
      }
    },
    setImpactCalculatorAmount: (state, action) => {
      state.impactCalculatorAmount = action.payload;
    }
  }
});
const {
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
  paymentCompletedSuccess,
  paymentFailed,
  clearLastDonation,
  openReceiptModal,
  closeReceiptModal,
  updateSubscriptionStatus,
  adjustSubscriptionAmount,
  changeSubscriptionBillingDate,
  switchSubscriptionPaymentMethod,
  setImpactCalculatorAmount
} = donationSlice.actions;
var stdin_default = donationSlice.reducer;
export {
  adjustSubscriptionAmount,
  changeSubscriptionBillingDate,
  clearLastDonation,
  closeDonationModal,
  closeReceiptModal,
  stdin_default as default,
  openDonationModal,
  openReceiptModal,
  paymentCompletedSuccess,
  paymentFailed,
  setCurrency,
  setCustomAmount,
  setDonationFrequency,
  setImpactCalculatorAmount,
  setMpesaPhoneNumber,
  setMpesaStkSent,
  setPaymentMethod,
  setSelectedAmount,
  startPaymentProcessing,
  switchSubscriptionPaymentMethod,
  updateSubscriptionStatus
};
