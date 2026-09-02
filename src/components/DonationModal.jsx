import { useState } from "react";
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
  LogIn
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
  setMpesaStkSent,
  paymentFailed,
  submitOneTimeDonation,
  submitRecurringDonation,
  openReceiptModal,
} from "../store/slices/donationSlice";
import { openRoleSelect } from "../store/slices/authSlice";
import { useToast } from "./ToastContext";

// NOTE on payment gateways: there are no live Stripe/PayPal/Safaricom Daraja
// credentials configured in this project, so "charging the card" / "sending
// the STK push" below is simulated exactly like the original mock UI. What
// IS real: once a transaction reference is produced, it's posted to the
// actual Flask API (POST /api/donations or /api/recurring-plans) and lands
// in the real database — it's not pushed into a fake local array anymore.
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
    mpesaStkSent,
    lastDonationSuccess,
    donationError,
  } = useAppSelector((state) => state.donation);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const [isAnonymous, setIsAnonymous] = useState(false);
  const [donorMessage, setDonorMessage] = useState("");
  const [stkPin, setStkPin] = useState("");
  const [stkStep, setStkStep] = useState("idle");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  const presetAmounts = currency === "USD" ? [10, 25, 50, 100] : [1000, 2500, 5000, 10000];
  const currentEffectiveAmount = customAmount ? parseFloat(customAmount) || 0 : selectedAmount;

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

  const handleTriggerPayment = () => {
    if (!canSubmit) return;
    dispatch(startPaymentProcessing());
    if (paymentMethod === "mpesa") {
      setTimeout(() => {
        dispatch(setMpesaStkSent(true));
        setStkStep("prompt");
      }, 1000);
    } else {
      setTimeout(() => {
        finalizeDonation("stripe", `pi_stripe_${Date.now()}`, `pm_stripe_${Date.now()}`);
      }, 1500);
    }
  };

  const handleConfirmMpesaPin = () => {
    const receipt = `WS${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    finalizeDonation("mpesa", receipt, mpesaPhoneNumber);
  };

  // providerTransactionId: the simulated gateway reference for this charge.
  // providerPaymentMethodId: for recurring plans only — the token/phone the
  // backend will reuse for future charges under this plan.
  const finalizeDonation = async (provider, providerTransactionId, providerPaymentMethodId) => {
    const charityId = activeCharityForDonation.id;
    const amount = currentEffectiveAmount;

    const action =
      frequency === "monthly"
        ? submitRecurringDonation({
            charity_id: charityId,
            amount,
            currency,
            frequency: "monthly",
            day_of_month: new Date().getDate(),
            is_anonymous: isAnonymous,
            provider,
            provider_customer_id: provider === "mpesa" ? mpesaPhoneNumber : `cus_${user.id}`,
            provider_payment_method_id: providerPaymentMethodId,
          })
        : submitOneTimeDonation({
            charity_id: charityId,
            amount,
            currency,
            payment_provider: provider,
            provider_transaction_id: providerTransactionId,
            is_anonymous: isAnonymous,
          });

    const result = await dispatch(action);

    if (result.meta.requestStatus === "fulfilled") {
      showToast(`Donation of ${currency} ${amount.toLocaleString()} processed!`, "success");
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#581c87", "#10b981", "#f59e0b", "#ec4899"],
      });
      setStkStep("success");
    } else {
      dispatch(paymentFailed(result.payload));
      setStkStep("idle");
      showToast(result.payload || "Payment could not be completed", "error");
    }
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
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 font-serif">Asante Sana! Thank You!</h3>
              <p className="text-sm text-slate-600 max-w-sm mx-auto">
                Your generous gift of{" "}
                <span className="font-bold text-purple-950">
                  {currency} {currentEffectiveAmount.toLocaleString()}
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
                  {getImpactDescription(currentEffectiveAmount, currency)}
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
          ) : stkStep === "prompt" ? (
            <div className="bg-slate-900 text-white p-6 rounded-2xl space-y-4 shadow-xl border border-slate-700 animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-emerald-400" />
                  <span className="font-bold text-sm tracking-wide text-emerald-400">
                    Safaricom M-PESA STK Push
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">Simulated</span>
              </div>

              <div className="text-center py-2">
                <p className="text-xs text-slate-300">Prompt dispatched to</p>
                <p className="text-base font-bold text-white font-mono">{mpesaPhoneNumber}</p>
                <p className="text-xs text-slate-400 mt-2">
                  Paybill: <span className="text-white font-semibold">892011</span> | Account:{" "}
                  <span className="text-white font-semibold">TUINUE</span>
                </p>
                <p className="text-lg font-bold text-emerald-400 mt-1">
                  KES {currentEffectiveAmount.toLocaleString()}
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-xs text-slate-300 font-semibold">
                  Enter 4-Digit M-Pesa PIN to Authorize:
                </label>
                <input
                  type="password"
                  maxLength={4}
                  placeholder="••••"
                  value={stkPin}
                  onChange={(e) => setStkPin(e.target.value)}
                  className="w-full text-center tracking-widest text-xl font-mono py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {donationError && (
                <p className="text-rose-400 text-xs text-center">{donationError}</p>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setStkStep("idle")}
                  className="w-1/2 py-2.5 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  id="btn-confirm-stk-pin"
                  disabled={isProcessing}
                  onClick={handleConfirmMpesaPin}
                  className="w-1/2 py-2.5 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-colors disabled:opacity-60"
                >
                  {isProcessing ? "Confirming…" : "Confirm & Authorize"}
                </button>
              </div>
            </div>
          ) : (
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
                  <div className="mt-3">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
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
                  </div>
                ) : (
                  <div className="mt-3 space-y-2">
                    <p className="text-[10px] text-slate-400">
                      No live Stripe integration is wired up — this is a simulated card form for
                      the demo checkout flow.
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
                <p className="text-[10px] text-slate-400">
                  Notes aren't stored by the API yet — this stays local to this checkout.
                </p>
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
                    ? "Connecting to Gateway..."
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
