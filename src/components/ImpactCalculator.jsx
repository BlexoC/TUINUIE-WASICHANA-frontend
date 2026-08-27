import { useState } from "react";
import { Heart, Sparkles, BookOpen, Smile, ShieldCheck, ArrowRight } from "lucide-react";
import { useAppDispatch } from "../store";
import { openDonationModal } from "../store/slices/donationSlice";
const ImpactCalculator = ({ embedded = false }) => {
  const dispatch = useAppDispatch();
  const [currency, setCurrency] = useState("USD");
  const [amount, setAmount] = useState(25);
  const presetsUSD = [10, 25, 50, 100, 250];
  const presetsKES = [1300, 3250, 6500, 13e3, 32500];
  const effectiveUsd = currency === "USD" ? amount : Math.round(amount / 130);
  const girlsSupported = Math.max(1, Math.floor(effectiveUsd / 10));
  const monthsOfSupply = Math.max(3, Math.floor(effectiveUsd / 10 * 3));
  const schoolDaysSaved = girlsSupported * 24;
  const reusablePads = girlsSupported * 5;
  const soapBars = girlsSupported * 3;
  const handlePresetClick = (val) => {
    setAmount(val);
  };
  const handleCurrencyChange = (newCurr) => {
    if (newCurr === currency) return;
    if (newCurr === "KES") {
      setAmount(amount * 130);
    } else {
      setAmount(Math.round(amount / 130) || 25);
    }
    setCurrency(newCurr);
  };
  const handleDonate = () => {
    dispatch(
      openDonationModal({
        presetAmount: amount
      })
    );
  };
  return <div
    className={`rounded-3xl border border-purple-100 bg-linear-to-br from-white via-purple-50/40 to-amber-50/30 p-6 sm:p-8 shadow-xl relative overflow-hidden ${embedded ? "w-full" : "max-w-4xl mx-auto"}`}
  >
      {
    /* Decorative background glow */
  }
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-200/30 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-200/20 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-purple-100">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100/80 text-purple-900 rounded-full text-xs font-bold tracking-wide uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5 text-purple-700" />
            <span>Live Impact Calculator</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 font-serif">
            See the Difference Your Gift Makes
          </h3>
          <p className="text-slate-600 text-sm mt-1">
            Every shilling and dollar directly purchases dignity kits and keeps Kenyan girls in the classroom.
          </p>
        </div>

        {
    /* Currency Toggle */
  }
        <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 shrink-0 self-start sm:self-center">
          <button
    onClick={() => handleCurrencyChange("USD")}
    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${currency === "USD" ? "bg-purple-900 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
  >
            USD ($)
          </button>
          <button
    onClick={() => handleCurrencyChange("KES")}
    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${currency === "KES" ? "bg-purple-900 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
  >
            KES (Ksh)
          </button>
        </div>
      </div>

      {
    /* Preset Amount Badges */
  }
      <div className="pt-6 space-y-4">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
          Select or Adjust Donation Tier:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {(currency === "USD" ? presetsUSD : presetsKES).map((val) => <button
    key={val}
    onClick={() => handlePresetClick(val)}
    className={`py-3 px-4 rounded-2xl font-bold text-sm transition-all border text-center ${amount === val ? "bg-purple-900 text-white border-purple-900 shadow-md shadow-purple-900/20 scale-[1.02]" : "bg-white text-slate-700 border-slate-200 hover:border-purple-300 hover:bg-purple-50/50"}`}
  >
              {currency === "USD" ? `$${val}` : `Ksh ${val.toLocaleString()}`}
            </button>)}
        </div>

        {
    /* Custom Range Slider */
  }
        <div className="pt-3 space-y-2">
          <div className="flex justify-between text-xs font-semibold text-slate-500">
            <span>
              {currency === "USD" ? "$5" : "Ksh 650"} (Micro Support)
            </span>
            <span className="font-bold text-purple-900 text-sm">
              Selected: {currency === "USD" ? `$${amount}` : `Ksh ${amount.toLocaleString()}`}
            </span>
            <span>
              {currency === "USD" ? "$500+" : "Ksh 65,000+"} (Entire Cohort)
            </span>
          </div>
          <input
    type="range"
    min={currency === "USD" ? 5 : 650}
    max={currency === "USD" ? 500 : 65e3}
    step={currency === "USD" ? 5 : 650}
    value={amount ?? (currency === "USD" ? 25 : 3250)}
    onChange={(e) => setAmount(Number(e.target.value))}
    className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-900"
    aria-label="Donation amount slider"
  />
        </div>
      </div>

      {
    /* Dynamic Impact Cards Output */
  }
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {
    /* Card 1 */
  }
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-purple-100 shadow-sm flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center shrink-0">
            <Smile className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-purple-950 font-serif">
              {girlsSupported} {girlsSupported === 1 ? "Girl" : "Girls"}
            </div>
            <p className="text-xs font-medium text-slate-600 mt-0.5">
              Provided with complete dignity kit packs ({monthsOfSupply} months supply)
            </p>
          </div>
        </div>

        {
    /* Card 2 */
  }
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-amber-100 shadow-sm flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-900 font-serif">
              {schoolDaysSaved}+ Days
            </div>
            <p className="text-xs font-medium text-slate-600 mt-0.5">
              Classroom attendance saved from period-induced absences
            </p>
          </div>
        </div>

        {
    /* Card 3 */
  }
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-emerald-100 shadow-sm flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-900 font-serif">
              {reusablePads} Pads & {soapBars} Soaps
            </div>
            <p className="text-xs font-medium text-slate-600 mt-0.5">
              Washable, antimicrobial materials & health mentorship booklets
            </p>
          </div>
        </div>
      </div>

      {
    /* Action CTA */
  }
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-purple-100">
        <div className="text-xs text-slate-500 flex items-center gap-2">
          <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
          <span>100% transparent. Tax-deductible under Kenyan NGO Act.</span>
        </div>

        <button
    onClick={handleDonate}
    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-linear-to-r from-purple-900 to-purple-800 text-white font-bold rounded-2xl hover:from-purple-800 hover:to-purple-700 transition-all shadow-lg shadow-purple-900/25 active:scale-95"
  >
          <span>Sponsor This Impact ({currency === "USD" ? `$${amount}` : `Ksh ${amount.toLocaleString()}`})</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>;
};
export {
  ImpactCalculator
};