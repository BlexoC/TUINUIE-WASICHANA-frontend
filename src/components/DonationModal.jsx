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
  MessageSquare
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
  paymentCompletedSuccess,
  openReceiptModal
} from "../store/slices/donationSlice";
import { updateCharityRaisedAmount } from "../store/slices/charitySlice";
import { addNotification } from "../store/slices/notificationSlice";
import { useToast } from "./ToastContext";
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
    lastDonationSuccess
  } = useAppSelector((state) => state.donation);
  const { user } = useAppSelector((state) => state.auth);
  const [donorName, setDonorName] = useState(user?.username || "Amina Kimani");
  const [donorEmail, setDonorEmail] = useState(
    user?.email || "amina.kimani@example.org"
  );
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [donorMessage, setDonorMessage] = useState("");
  const [stkPin, setStkPin] = useState("");
  const [stkStep, setStkStep] = useState("idle");
  const [cardNumber, setCardNumber] = useState("4242 4242 4242 4242");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvc, setCardCvc] = useState("892");
  const presetAmounts = currency === "USD" ? [10, 25, 50, 100] : [1e3, 2500, 5e3, 1e4];
  const currentEffectiveAmount = customAmount ? parseFloat(customAmount) || 0 : selectedAmount;
  if (!isDonationModalOpen) return null;
  const getImpactDescription = (amount, curr) => {
    const kes = curr === "USD" ? amount * 130 : amount;
    const kits = Math.max(1, Math.floor(kes / 650));
    const months = kits * 3;
    return `Sponsors ${kits} complete dignity kit(s), ensuring ${months} months of uninterrupted schooling.`;
  };
  const handleTriggerPayment = () => {
    if (currentEffectiveAmount <= 0) return;
    dispatch(startPaymentProcessing());
    if (paymentMethod === "mpesa") {
      setTimeout(() => {
        dispatch(setMpesaStkSent(true));
        setStkStep("prompt");
      }, 1e3);
    } else {
      setTimeout(() => {
        finalizeDonationSuccess("stripe", `pi_stripe_${Date.now()}`);
      }, 1500);
    }
  };
  const handleConfirmMpesaPin = () => {
    finalizeDonationSuccess("mpesa", void 0, `WS${Math.random().toString(36).substring(2, 8).toUpperCase()}`);
  };
  const finalizeDonationSuccess = (method, stripeId, receiptNo) => {
    const charityId = activeCharityForDonation?.id || "ch_heshima";
    const charityName = activeCharityForDonation?.name || "Heshima Project";
    const finalAmountInKes = currency === "USD" ? currentEffectiveAmount * 130 : currentEffectiveAmount;
    const generatedReceipt = receiptNo || `MP${Date.now().toString().slice(-6)}`;
    const newDonation = {
      id: `don_${Date.now()}`,
      donor_id: user?.id,
      donor_name: isAnonymous ? "Anonymous" : donorName,
      donor_email: isAnonymous ? void 0 : donorEmail,
      charity_id: charityId,
      charity_name: charityName,
      amount: currentEffectiveAmount,
      currency,
      frequency,
      payment_method: method,
      payment_status: "completed",
      mpesa_phone: method === "mpesa" ? mpesaPhoneNumber : void 0,
      mpesa_receipt: generatedReceipt,
      stripe_payment_id: stripeId,
      is_anonymous: isAnonymous,
      message: donorMessage,
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    dispatch(paymentCompletedSuccess(newDonation));
    dispatch(
      updateCharityRaisedAmount({
        id: charityId,
        addedAmount: finalAmountInKes
      })
    );
    dispatch(
      addNotification({
        title: "Donation Successful",
        message: `Thank you! Your donation of ${currency} ${currentEffectiveAmount.toLocaleString()} to ${charityName} has been received.`,
        type: "donation"
      })
    );
    showToast(`Donation of ${currency} ${currentEffectiveAmount.toLocaleString()} processed!`);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#581c87", "#10b981", "#f59e0b", "#ec4899"]
    });
    setStkStep("success");
  };
  const handleOpenReceiptFromModal = () => {
    if (lastDonationSuccess) {
      dispatch(openReceiptModal(lastDonationSuccess));
    }
  };
  return <div
    id="donation-modal-overlay"
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto"
    role="dialog"
    aria-modal="true"
  >
      <div
    id="donation-modal-card"
    className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8"
  >
        {
    /* Header */
  }
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
              {activeCharityForDonation ? activeCharityForDonation.name : "Tuinue Wasichana General Dignity Fund"}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold font-serif">
            Make a Donation
          </h2>
          <p className="text-purple-200 text-xs sm:text-sm mt-1">
            Transform a girl's educational journey with essential dignity supplies.
          </p>
        </div>

        {
    /* Modal Body */
  }
        <div className="p-6 sm:p-8 space-y-6">
          {stkStep === "success" ? <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 font-serif">
                Asante Sana! Thank You!
              </h3>
              <p className="text-sm text-slate-600 max-w-sm mx-auto">
                Your generous gift of{" "}
                <span className="font-bold text-purple-950">
                  {currency} {currentEffectiveAmount.toLocaleString()}
                </span>{" "}
                has been processed securely.
              </p>

              <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100 text-xs text-purple-900 text-left space-y-1.5 font-medium">
                <p>
                  <span className="font-bold">Receipt Reference:</span>{" "}
                  <span className="font-mono">{lastDonationSuccess?.mpesa_receipt || "TW-849201"}</span>
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
                  <span>Download / Print Receipt</span>
                </button>
                <button
    onClick={() => dispatch(closeDonationModal())}
    className="flex-1 py-3 bg-purple-900 hover:bg-purple-800 text-white font-bold rounded-2xl text-xs shadow-sm transition-colors"
  >
                  Close Window
                </button>
              </div>
            </div> : stkStep === "prompt" ? (
    /* Safaricom M-Pesa STK Prompt Simulation */
    <div className="bg-slate-900 text-white p-6 rounded-2xl space-y-4 shadow-xl border border-slate-700 animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-emerald-400" />
                  <span className="font-bold text-sm tracking-wide text-emerald-400">
                    Safaricom M-PESA STK Push
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">Live Simulation</span>
              </div>

              <div className="text-center py-2">
                <p className="text-xs text-slate-300">Prompt dispatched to</p>
                <p className="text-base font-bold text-white font-mono">
                  {mpesaPhoneNumber}
                </p>
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
      value={stkPin ?? ""}
      onChange={(e) => setStkPin(e.target.value)}
      className="w-full text-center tracking-widest text-xl font-mono py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
    />
              </div>

              <div className="flex gap-2 pt-2">
                <button
      onClick={() => setStkStep("idle")}
      className="w-1/2 py-2.5 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 rounded-xl"
    >
                  Cancel
                </button>
                <button
      id="btn-confirm-stk-pin"
      onClick={handleConfirmMpesaPin}
      className="w-1/2 py-2.5 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-colors"
    >
                  Confirm & Authorize
                </button>
              </div>
            </div>
  ) : <>
              {
    /* Frequency Selector */
  }
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

              {
    /* Currency & Preset Amounts */
  }
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
                  {presetAmounts.map((amt) => <button
    key={amt}
    id={`preset-amt-${amt}`}
    onClick={() => dispatch(setSelectedAmount(amt))}
    className={`py-3 rounded-2xl text-xs font-bold border transition-all ${selectedAmount === amt && !customAmount ? "bg-purple-900 text-white border-purple-900 shadow-sm" : "bg-white text-slate-800 border-slate-200 hover:border-purple-300"}`}
  >
                      {currency === "USD" ? `$${amt}` : `Ksh ${amt}`}
                    </button>)}
                </div>

                {
    /* Custom Amount input */
  }
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    {currency === "USD" ? "$" : "Ksh"}
                  </span>
                  <input
    id="input-custom-amount"
    type="number"
    placeholder="Custom amount"
    value={customAmount ?? ""}
    onChange={(e) => dispatch(setCustomAmount(e.target.value))}
    className="w-full pl-12 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-700 focus:bg-white focus:outline-none font-medium"
  />
                </div>

                {
    /* Impact callout */
  }
                <div className="mt-2 p-2.5 bg-purple-50 rounded-xl border border-purple-100 text-[11px] text-purple-900 flex items-center gap-1.5 font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-purple-700 shrink-0" />
                  <span>{getImpactDescription(currentEffectiveAmount, currency)}</span>
                </div>
              </div>

              {
    /* Payment Method Radio Options */
  }
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

                {
    /* Conditional Payment Fields */
  }
                {paymentMethod === "mpesa" ? <div className="mt-3">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      M-Pesa Mobile Number (Safaricom)
                    </label>
                    <div className="relative">
                      <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
    id="input-mpesa-phone"
    type="text"
    placeholder="0712 345 678"
    value={mpesaPhoneNumber ?? ""}
    onChange={(e) => dispatch(setMpesaPhoneNumber(e.target.value))}
    className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
  />
                    </div>
                  </div> : <div className="mt-3 space-y-2">
                    <input
    type="text"
    placeholder="Card number (4242 •••• •••• 4242)"
    value={cardNumber ?? ""}
    onChange={(e) => setCardNumber(e.target.value)}
    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-700 focus:outline-none"
  />
                    <div className="grid grid-cols-2 gap-2">
                      <input
    type="text"
    placeholder="MM / YY"
    value={cardExpiry ?? ""}
    onChange={(e) => setCardExpiry(e.target.value)}
    className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-700 focus:outline-none"
  />
                      <input
    type="text"
    placeholder="CVC"
    value={cardCvc ?? ""}
    onChange={(e) => setCardCvc(e.target.value)}
    className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-700 focus:outline-none"
  />
                    </div>
                  </div>}
              </div>

              {
    /* Dedication Message & Anonymous Toggle */
  }
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
    value={donorMessage ?? ""}
    onChange={(e) => setDonorMessage(e.target.value)}
    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-700 focus:outline-none"
  />
              </div>

              {
    /* Complete Donation Button */
  }
              <button
    id="btn-complete-donation"
    disabled={isProcessing || currentEffectiveAmount <= 0}
    onClick={handleTriggerPayment}
    className="w-full py-3.5 bg-purple-900 hover:bg-purple-800 text-white font-bold rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 text-xs disabled:opacity-50 active:scale-98"
  >
                <Lock className="w-3.5 h-3.5 text-purple-300" />
                <span>
                  {isProcessing ? "Connecting to Gateway..." : `Authorize ${frequency === "monthly" ? "Monthly Sustaining" : ""} Donation (${currency} ${currentEffectiveAmount.toLocaleString()})`}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>}
        </div>
      </div>
    </div>;
};
export {
  DonationModal
};
