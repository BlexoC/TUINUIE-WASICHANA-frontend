import { useState, useEffect, useRef } from "react";
import {
  X,
  CreditCard,
  Smartphone,
  Heart,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  Receipt,
  MessageSquare,
  LogIn,
  Loader2,
} from "lucide-react";
import confetti from "canvas-confetti";
import { useAppDispatch, useAppSelector } from "../store";
import {
  closeDonationModal,
  setDonationFrequency,
  setSelectedAmount,
  setCustomAmount,
  setCurrency,
  setPaymentMethod,
  setMpesaPhoneNumber,
  startPaymentProcessing,
  paymentFailed,
  submitOneTimeDonation,
  submitRecurringDonation,
  openReceiptModal,
} from "../store/slices/donationSlice";
import { openRoleSelect } from "../store/slices/authSlice";
import { useToast } from "./ToastContext";
import { mpesaApi } from "../lib/api";

// How long to poll for an STK result before giving up (ms)
const STK_POLL_TIMEOUT_MS = 90_000;
// How often to check (ms)
const STK_POLL_INTERVAL_MS = 3_000;

const DonationModal = () => {
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const {
    isDonationModalOpen,
    activeCharityForDonation,
    frequency,
    selectedAmount,
    customAmount,
    currency,
    paymentMethod,
    mpesaPhoneNumber,
    isProcessing,
    lastDonationSuccess,
    donationError,
  } = useAppSelector((state) => state.donation);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const [isAnonymous, setIsAnonymous] = useState(false);
  const [donorMessage, setDonorMessage] = useState("");
  const [stkStep, setStkStep] = useState("idle");
  // "idle" | "pushing" | "waiting" | "success" | "failed"
  const [stkMessage, setStkMessage] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  const pollTimerRef = useRef(null);
  const pollStartRef = useRef(null);
  const checkoutRequestIdRef = useRef(null);

  const presetAmounts = currency === "USD" ? [10, 25, 50, 100] : [1000, 2500, 5000, 10000];
  const currentEffectiveAmount = customAmount ? parseFloat(customAmount) || 0 : selectedAmount;

  // Clean up any running poll when modal closes
  useEffect(() => {
    if (!isDonationModalOpen) {
      _stopPolling();
      setStkStep("idle");
      setStkMessage("");
      checkoutRequestIdRef.current = null;
    }
  }, [isDonationModalOpen]);

  if (!isDonationModalOpen) return null;

  const getImpactDescription = (amount, curr) => {
    const kes = curr === "USD" ? amount * 130 : amount;
    const kits = Math.max(1, Math.floor(kes / 650));
    const months = kits * 3;
    return `Sponsors ${kits} complete dignity kit(s), ensuring ${months} months of uninterrupted schooling.`;
  };

  const canSubmit =
    isAuthenticated &&
    user?.role === "donor" &&
    activeCharityForDonation?.id &&
    currentEffectiveAmount > 0;

  // -------------------------------------------------------------------------
  // Polling helpers
  // -------------------------------------------------------------------------
  function _stopPolling() {
    if (pollTimerRef.current) {
      clearInterval(pollTimerRef.current);
      pollTimerRef.current = null;
    }
  }

  function _startPolling(checkoutRequestId) {
    pollStartRef.current = Date.now();
    checkoutRequestIdRef.current = checkoutRequestId;

    pollTimerRef.current = setInterval(async () => {
      // Timeout guard
      if (Date.now() - pollStartRef.current > STK_POLL_TIMEOUT_MS) {
        _stopPolling();
        setStkStep("idle");
        dispatch(paymentFailed("M-Pesa payment timed out. Please try again."));
        showToast("M-Pesa payment timed out. Please try again.", "error");
        return;
      }

      try {
        const result = await mpesaApi.query(checkoutRequestId);
        const code = String(result.result_code);

        if (code === "0") {
          // ✅ Payment confirmed by Daraja — now record it in our DB
          _stopPolling();
          setStkStep("confirmed");
          await _recordDonationAfterMpesa();
        } else if (code === "1032") {
          // User cancelled on their phone
          _stopPolling();
          setStkStep("idle");
          dispatch(paymentFailed("M-Pesa payment was cancelled."));
          showToast("M-Pesa payment was cancelled.", "error");
        } else if (code === "1037") {
          // Timed out on Safaricom's side
          _stopPolling();
          setStkStep("idle");
          dispatch(paymentFailed("M-Pesa payment timed out. Check your phone and try again."));
          showToast("M-Pesa payment timed out.", "error");
        }
        // Any other code (e.g. still pending "1") → keep polling
      } catch {
        // Network hiccup — keep polling, don't abort
      }
    }, STK_POLL_INTERVAL_MS);
  }

  // -------------------------------------------------------------------------
  // After Daraja confirms payment, record it against our API
  // -------------------------------------------------------------------------
  async function _recordDonationAfterMpesa() {
    // The real receipt number arrives via the Safaricom callback to the
    // backend and is stored automatically. Here we record the donation on
    // behalf of the donor using the CheckoutRequestID as the transaction
    // reference so it links back to the Daraja request. The backend's
    // callback handler (POST /api/mpesa/callback) also records it — the
    // UniqueConstraint on (payment_provider, provider_transaction_id)
    // prevents duplicates, so whichever arrives first wins.
    const charityId = activeCharityForDonation.id;
    const amount = currentEffectiveAmount;
    const txnRef = checkoutRequestIdRef.current;

    const action =
      frequency === "monthly"
        ? submitRecurringDonation({
            charity_id: charityId,
            amount,
            currency: "KES",
            frequency: "monthly",
            day_of_month: new Date().getDate(),
            is_anonymous: isAnonymous,
            provider: "mpesa",
            provider_customer_id: mpesaPhoneNumber,
            provider_payment_method_id: mpesaPhoneNumber,
          })
        : submitOneTimeDonation({
            charity_id: charityId,
            amount,
            currency: "KES",
            payment_provider: "mpesa",
            provider_transaction_id: txnRef,
            is_anonymous: isAnonymous,
          });

    const result = await dispatch(action);

    if (result.meta.requestStatus === "fulfilled") {
      setStkStep("success");
      showToast(`M-Pesa donation of KES ${amount.toLocaleString()} confirmed!`, "success");
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#581c87", "#10b981", "#f59e0b", "#ec4899"],
      });
    } else {
      setStkStep("idle");
      dispatch(paymentFailed(result.payload));
      showToast(result.payload || "Payment could not be recorded.", "error");
    }
  }

  // -------------------------------------------------------------------------
  // Stripe (still simulated — no Stripe credentials yet)
  // -------------------------------------------------------------------------
  async function _handleStripe() {
    dispatch(startPaymentProcessing());
    // Replace this block with real Stripe Elements / PaymentIntent when ready
    setTimeout(async () => {
      const txnRef = `pi_stripe_${Date.now()}`;
      const pmRef  = `pm_stripe_${Date.now()}`;
      const action =
        frequency === "monthly"
          ? submitRecurringDonation({
              charity_id: activeCharityForDonation.id,
              amount: currentEffectiveAmount,
              currency,
              frequency: "monthly",
              day_of_month: new Date().getDate(),
              is_anonymous: isAnonymous,
              provider: "stripe",
              provider_customer_id: `cus_${user.id}`,
              provider_payment_method_id: pmRef,
            })
          : submitOneTimeDonation({
              charity_id: activeCharityForDonation.id,
              amount: currentEffectiveAmount,
              currency,
              payment_provider: "stripe",
              provider_transaction_id: txnRef,
              is_anonymous: isAnonymous,
            });

      const result = await dispatch(action);
      if (result.meta.requestStatus === "fulfilled") {
        setStkStep("success");
        showToast(`Donation of ${currency} ${currentEffectiveAmount.toLocaleString()} processed!`, "success");
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      } else {
        dispatch(paymentFailed(result.payload));
        showToast(result.payload || "Payment could not be completed", "error");
      }
    }, 1500);
  }

  // -------------------------------------------------------------------------
  // Main payment trigger
  // -------------------------------------------------------------------------
  const handleTriggerPayment = async () => {
    if (!canSubmit) return;

    if (paymentMethod === "mpesa") {
      if (!mpesaPhoneNumber || mpesaPhoneNumber.trim().length < 9) {
        showToast("Please enter a valid Safaricom phone number.", "error");
        return;
      }
      // M-Pesa must be KES
      if (currency !== "KES") {
        showToast("M-Pesa only accepts KES. Please switch the currency to KES.", "error");
        return;
      }

      dispatch(startPaymentProcessing());
      setStkStep("pushing");
      setStkMessage("");

      try {
        const resp = await mpesaApi.stkPush({
          phone:      mpesaPhoneNumber,
          amount:     Math.round(currentEffectiveAmount),
          charity_id: activeCharityForDonation.id,
        });

        setStkStep("waiting");
        setStkMessage(resp.message || "Check your phone and enter your M-Pesa PIN.");
        _startPolling(resp.checkout_request_id);
      } catch (err) {
        setStkStep("idle");
        dispatch(paymentFailed(err.message || "Could not initiate M-Pesa payment."));
        showToast(err.message || "Could not initiate M-Pesa payment.", "error");
      }
    } else {
      await _handleStripe();
    }
  };

  const handleCancelMpesa = () => {
    _stopPolling();
    setStkStep("idle");
    setStkMessage("");
    dispatch(paymentFailed(null));
  };

  const handleOpenReceiptFromModal = () => {
    if (lastDonationSuccess) {
      dispatch(
        openReceiptModal({
          ...lastDonationSuccess,
          charity_name: activeCharityForDonation?.name,
          donor_name: isAnonymous ? "Anonymous" : user?.username,
        })
      );
    }
  };

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------
  return (
    <div
      id="donation-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div
        id="donation-modal-card"
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8"
      >
        {/* Header */}
        <div className="p-6 sm:p-8 bg-purple-950 text-white relative">
          <button
            id="btn-close-donation-modal"
            onClick={() => dispatch(closeDonationModal())}
            className="absolute top-6 right-6 p-2 text-purple-200 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-5 h-5 fill-purple-400 text-purple-300" />
            <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider">
              {activeCharityForDonation ? activeCharityForDonation.name : "Choose a charity to support"}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold font-serif">Make a Donation</h2>
          <p className="text-purple-200 text-xs sm:text-sm mt-1">
            Transform a girl's educational journey with essential dignity supplies.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {!isAuthenticated || user?.role !== "donor" ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-14 h-14 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center mx-auto">
                <LogIn className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                {!isAuthenticated ? "Sign in to donate" : "Donor account required"}
              </h3>
              <p className="text-sm text-slate-600 max-w-sm mx-auto">
                {!isAuthenticated
                  ? "Create a free donor account or sign in to make a secure donation."
                  : "Only donor accounts can make donations. Charity and admin accounts manage the platform side."}
              </p>
              {!isAuthenticated && (
                <button
                  onClick={() => {
                    dispatch(closeDonationModal());
                    dispatch(openRoleSelect());
                  }}
                  className="px-6 py-2.5 bg-purple-900 hover:bg-purple-950 text-white font-bold rounded-full text-sm"
                >
                  Sign In / Register
                </button>
              )}
            </div>

          ) : !activeCharityForDonation ? (
            <div className="text-center py-8 space-y-3">
              <p className="text-sm text-slate-600">
                Please pick a charity from the Charities page first — every donation needs
                a specific organization to support.
              </p>
              <button
                onClick={() => dispatch(closeDonationModal())}
                className="px-6 py-2.5 bg-purple-900 hover:bg-purple-950 text-white font-bold rounded-full text-sm"
              >
                Browse Charities
              </button>
            </div>

          ) : stkStep === "success" ? (
            /* ── Success screen ── */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 font-serif">Asante Sana! Thank You!</h3>
              <p className="text-sm text-slate-600 max-w-sm mx-auto">
                Your generous gift of{" "}
                <span className="font-bold text-purple-950">
                  KES {currentEffectiveAmount.toLocaleString()}
                </span>{" "}
                has been recorded.
              </p>

              <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100 text-xs text-purple-900 text-left space-y-1.5 font-medium">
                <p>
                  <span className="font-bold">Transaction Reference:</span>{" "}
                  <span className="font-mono">
                    {lastDonationSuccess?.provider_transaction_id || "—"}
                  </span>
                </p>
                <p>
                  <span className="font-bold">Frequency:</span>{" "}
                  {frequency === "monthly" ? "Monthly Sustaining Partner" : "One-Time Direct Gift"}
                </p>
                <p>
                  <span className="font-bold">Direct Impact:</span>{" "}
                  {getImpactDescription(currentEffectiveAmount, "KES")}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <button
                  onClick={handleOpenReceiptFromModal}
                  className="flex-1 py-3 bg-purple-100 hover:bg-purple-200 text-purple-950 font-bold rounded-2xl text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <Receipt className="w-4 h-4" />
                  <span>View Receipt</span>
                </button>
                <button
                  onClick={() => dispatch(closeDonationModal())}
                  className="flex-1 py-3 bg-purple-900 hover:bg-purple-800 text-white font-bold rounded-2xl text-xs shadow-sm transition-colors"
                >
                  Close Window
                </button>
              </div>
            </div>

          ) : stkStep === "pushing" || stkStep === "waiting" || stkStep === "confirmed" ? (
            /* ── STK push in-progress screen ── */
            <div className="bg-slate-900 text-white p-6 rounded-2xl space-y-5 shadow-xl border border-slate-700">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-emerald-400" />
                  <span className="font-bold text-sm tracking-wide text-emerald-400">
                    Safaricom M-PESA
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono uppercase tracking-wider">
                  {stkStep === "pushing" ? "Sending…" : stkStep === "confirmed" ? "Verifying…" : "Awaiting PIN"}
                </span>
              </div>

              <div className="text-center py-4 space-y-3">
                <Loader2 className="w-10 h-10 text-emerald-400 animate-spin mx-auto" />

                {stkStep === "pushing" && (
                  <p className="text-sm text-slate-300">
                    Sending STK push to <span className="font-bold text-white font-mono">{mpesaPhoneNumber}</span>…
                  </p>
                )}

                {stkStep === "waiting" && (
                  <>
                    <p className="text-sm text-slate-300">
                      Prompt sent to <span className="font-bold text-white font-mono">{mpesaPhoneNumber}</span>
                    </p>
                    <p className="text-xs text-slate-400">{stkMessage}</p>
                    <div className="bg-slate-800 rounded-xl p-3 text-left space-y-1 text-xs">
                      <p className="text-slate-400">
                        Paybill: <span className="text-white font-semibold">892011</span>
                      </p>
                      <p className="text-slate-400">
                        Account: <span className="text-white font-semibold">TUINUE</span>
                      </p>
                      <p className="text-lg font-bold text-emerald-400">
                        KES {currentEffectiveAmount.toLocaleString()}
                      </p>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Enter your M-Pesa PIN on your phone to complete the payment.
                      This screen updates automatically.
                    </p>
                  </>
                )}

                {stkStep === "confirmed" && (
                  <p className="text-sm text-slate-300">
                    Payment confirmed — recording your donation…
                  </p>
                )}
              </div>

              {donationError && (
                <p className="text-rose-400 text-xs text-center">{donationError}</p>
              )}

              {stkStep === "waiting" && (
                <button
                  onClick={handleCancelMpesa}
                  className="w-full py-2.5 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
                >
                  Cancel Payment
                </button>
              )}
            </div>

          ) : (
            /* ── Main donation form ── */
            <>
              {donationError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                  {donationError}
                </div>
              )}

              {/* Frequency Selector */}
              <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl text-xs font-bold">
                <button
                  id="tab-one-time-donation"
                  onClick={() => dispatch(setDonationFrequency("one-time"))}
                  className={`py-2.5 rounded-xl transition-all ${frequency === "one-time" ? "bg-purple-900 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
                >
                  One-Time Gift
                </button>
                <button
                  id="tab-monthly-donation"
                  onClick={() => dispatch(setDonationFrequency("monthly"))}
                  className={`py-2.5 rounded-xl transition-all ${frequency === "monthly" ? "bg-purple-900 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
                >
                  Monthly Sustainer
                </button>
              </div>

              {/* Currency & Preset Amounts */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Select Donation Amount
                  </label>
                  <div className="flex gap-1 text-[11px] font-bold">
                    <button
                      onClick={() => dispatch(setCurrency("USD"))}
                      className={`px-2.5 py-1 rounded-lg ${currency === "USD" ? "bg-purple-900 text-white" : "text-slate-500 bg-slate-100"}`}
                    >
                      USD ($)
                    </button>
                    <button
                      onClick={() => dispatch(setCurrency("KES"))}
                      className={`px-2.5 py-1 rounded-lg ${currency === "KES" ? "bg-purple-900 text-white" : "text-slate-500 bg-slate-100"}`}
                    >
                      KES (Ksh)
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2 mb-3">
                  {presetAmounts.map((amt) => (
                    <button
                      key={amt}
                      id={`preset-amt-${amt}`}
                      onClick={() => dispatch(setSelectedAmount(amt))}
                      className={`py-3 rounded-2xl text-xs font-bold border transition-all ${selectedAmount === amt && !customAmount ? "bg-purple-900 text-white border-purple-900 shadow-sm" : "bg-white text-slate-800 border-slate-200 hover:border-purple-300"}`}
                    >
                      {currency === "USD" ? `$${amt}` : `Ksh ${amt}`}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    {currency === "USD" ? "$" : "Ksh"}
                  </span>
                  <input
                    id="input-custom-amount"
                    type="number"
                    placeholder="Custom amount"
                    value={customAmount}
                    onChange={(e) => dispatch(setCustomAmount(e.target.value))}
                    className="w-full pl-12 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-700 focus:bg-white focus:outline-none font-medium"
                  />
                </div>

                <div className="mt-2 p-2.5 bg-purple-50 rounded-xl border border-purple-100 text-[11px] text-purple-900 flex items-center gap-1.5 font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-purple-700 shrink-0" />
                  <span>{getImpactDescription(currentEffectiveAmount, currency)}</span>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    id="opt-pay-mpesa"
                    onClick={() => dispatch(setPaymentMethod("mpesa"))}
                    className={`p-3.5 rounded-2xl border cursor-pointer flex items-center gap-3 transition-all ${paymentMethod === "mpesa" ? "border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20" : "border-slate-200 bg-white hover:border-slate-300"}`}
                  >
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                      M
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">M-PESA</p>
                      <p className="text-[10px] text-slate-500">Safaricom Express</p>
                    </div>
                  </div>

                  <div
                    id="opt-pay-stripe"
                    onClick={() => dispatch(setPaymentMethod("stripe"))}
                    className={`p-3.5 rounded-2xl border cursor-pointer flex items-center gap-3 transition-all ${paymentMethod === "stripe" ? "border-purple-900 bg-purple-50/50 ring-2 ring-purple-900/20" : "border-slate-200 bg-white hover:border-slate-300"}`}
                  >
                    <CreditCard className="w-6 h-6 text-purple-900" />
                    <div>
                      <p className="text-xs font-bold text-slate-900">Card (Stripe)</p>
                      <p className="text-[10px] text-slate-500">Visa / Mastercard</p>
                    </div>
                  </div>
                </div>

                {paymentMethod === "mpesa" ? (
                  <div className="mt-3 space-y-2">
                    <label className="block text-[11px] font-bold text-slate-600">
                      M-Pesa Mobile Number (Safaricom)
                    </label>
                    <div className="relative">
                      <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        id="input-mpesa-phone"
                        type="text"
                        placeholder="0712 345 678"
                        value={mpesaPhoneNumber}
                        onChange={(e) => dispatch(setMpesaPhoneNumber(e.target.value))}
                        className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
                      />
                    </div>
                    {currency !== "KES" && (
                      <p className="text-[10px] text-amber-600 font-medium">
                        ⚠ M-Pesa only accepts KES. Please switch the currency above.
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="mt-3 space-y-2">
                    <p className="text-[10px] text-slate-400">
                      Stripe integration coming soon — card form is a placeholder.
                    </p>
                    <input
                      type="text"
                      placeholder="Card number"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-700 focus:outline-none"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="MM / YY"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-700 focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="CVC"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-700 focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Dedication Message & Anonymous Toggle */}
              <div className="space-y-2 pt-1 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                    <MessageSquare className="w-3 h-3 text-purple-700" />
                    <span>Donor Note or Dedication (Optional)</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-[11px] text-slate-600 font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="rounded text-purple-900 focus:ring-purple-700"
                    />
                    <span>Give anonymously</span>
                  </label>
                </div>
                <input
                  type="text"
                  placeholder="e.g. In honor of my grandmother, or cheering for young women"
                  value={donorMessage}
                  onChange={(e) => setDonorMessage(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-700 focus:outline-none"
                />
              </div>

              <button
                id="btn-complete-donation"
                disabled={isProcessing || currentEffectiveAmount <= 0}
                onClick={handleTriggerPayment}
                className="w-full py-3.5 bg-purple-900 hover:bg-purple-800 text-white font-bold rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 text-xs disabled:opacity-50 active:scale-98"
              >
                <Lock className="w-3.5 h-3.5 text-purple-300" />
                <span>
                  {isProcessing
                    ? "Connecting to M-Pesa…"
                    : `Authorize ${frequency === "monthly" ? "Monthly Sustaining " : ""}Donation (${currency} ${currentEffectiveAmount.toLocaleString()})`}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export { DonationModal };
