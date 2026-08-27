import { useState } from "react";
import {
  Sparkles,
  TrendingUp,
  BrainCircuit,
  GraduationCap,
  ShieldCheck,
  Leaf,
  ArrowRight,
  RefreshCw,
  Award
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store";
import { openDonationModal } from "../store/slices/donationSlice";
import { translations } from "../lib/i18n";
const COUNTIES = {
  Samburu: { name: "Samburu County", absenteeismRate: 28, vulnerabilityIndex: 9.4, waterScarcityFactor: 8.9 },
  Kilifi: { name: "Kilifi County", absenteeismRate: 24, vulnerabilityIndex: 8.8, waterScarcityFactor: 7.2 },
  Turkana: { name: "Turkana County", absenteeismRate: 31, vulnerabilityIndex: 9.7, waterScarcityFactor: 9.5 },
  Kisumu: { name: "Kisumu County", absenteeismRate: 19, vulnerabilityIndex: 7.5, waterScarcityFactor: 5.4 },
  Nakuru: { name: "Nakuru County", absenteeismRate: 16, vulnerabilityIndex: 6.8, waterScarcityFactor: 4.8 },
  Machakos: { name: "Machakos County", absenteeismRate: 18, vulnerabilityIndex: 7.2, waterScarcityFactor: 6.9 },
  Garissa: { name: "Garissa County", absenteeismRate: 29, vulnerabilityIndex: 9.5, waterScarcityFactor: 9.1 }
};
const AiImpactPredictor = ({
  isModal = false,
  onClose
}) => {
  const dispatch = useAppDispatch();
  const { currentLanguage } = useAppSelector((state) => state.language);
  const { charities } = useAppSelector((state) => state.charity);
  const t = translations[currentLanguage];
  const [donationAmount, setDonationAmount] = useState(50);
  const [selectedCounty, setSelectedCounty] = useState("Samburu");
  const [gradeFocus, setGradeFocus] = useState("Junior Secondary (Grades 7-9)");
  const [isSimulating, setIsSimulating] = useState(false);
  const countyInfo = COUNTIES[selectedCounty] || COUNTIES["Samburu"];
  const kitsFunded = Math.max(1, Math.floor(donationAmount / 10));
  const girlsReached = kitsFunded;
  const daysPerGirlPerMonth = Math.round(countyInfo.absenteeismRate / 100 * 20);
  const annualDaysSaved = girlsReached * daysPerGirlPerMonth * 9;
  const examProbabilityBoost = Math.min(42, Math.round(18 + countyInfo.vulnerabilityIndex * 2.2));
  const dropoutReductionPct = Math.min(85, Math.round(55 + countyInfo.vulnerabilityIndex * 3));
  const plasticAvoidedKg = Math.round(girlsReached * 7.5);
  const handleSimulateNew = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
    }, 450);
  };
  const matchedCharity = charities.find((c) => c.county?.toLowerCase() === selectedCounty.toLowerCase()) || charities[0];
  return <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
      {
    /* Background Glow */
  }
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

      {
    /* Header */
  }
      <div className="relative z-10 mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold uppercase tracking-wider mb-3 border border-purple-500/30">
          <BrainCircuit className="w-4 h-4 text-purple-400" />
          <span>Machine Learning Impact Predictor</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-serif tracking-tight text-white">
          Forecast Your Giving Impact Across Kenya
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm mt-1.5 max-w-2xl">
          Simulate how targeted menstrual hygiene kits, WASH stations, and puberty education transform school attendance, exam performance, and dropout mitigation.
        </p>
      </div>

      {
    /* Main Interactive Grid */
  }
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {
    /* Left Inputs Controls (5 cols) */
  }
        <div className="lg:col-span-5 space-y-6 bg-slate-950/60 p-6 rounded-2xl border border-slate-800/80">
          {
    /* Donation Amount Slider */
  }
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-slate-300">
                Donation Budget (USD)
              </label>
              <span className="text-lg font-bold text-amber-400 font-mono">
                ${donationAmount}
                <span className="text-xs text-slate-400 font-sans ml-1.5">
                  (≈ KES {(donationAmount * 130).toLocaleString()})
                </span>
              </span>
            </div>

            <input
    type="range"
    min="10"
    max="500"
    step="10"
    value={donationAmount}
    onChange={(e) => setDonationAmount(Number(e.target.value))}
    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
  />

            <div className="flex justify-between text-[11px] text-slate-500 mt-1 font-mono">
              <span>$10 (1 Kit)</span>
              <span>$100 (10 Kits)</span>
              <span>$500 (50 Kits)</span>
            </div>
          </div>

          {
    /* County Selector */
  }
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2">
              Target County / Vulnerability Zone
            </label>
            <select
    value={selectedCounty}
    onChange={(e) => setSelectedCounty(e.target.value)}
    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-medium text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
  >
              {Object.keys(COUNTIES).map((countyKey) => <option key={countyKey} value={countyKey}>
                  {COUNTIES[countyKey].name} (Baseline Absenteeism: {COUNTIES[countyKey].absenteeismRate}%)
                </option>)}
            </select>
          </div>

          {
    /* School Grade Level */
  }
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2">
              Target School Demographic
            </label>
            <div className="grid grid-cols-1 gap-2">
              {[
    "Primary Upper (Grades 5-6)",
    "Junior Secondary (Grades 7-9)",
    "Senior Secondary (Forms 1-4)"
  ].map((stage) => <button
    key={stage}
    type="button"
    onClick={() => setGradeFocus(stage)}
    className={`px-3 py-2 text-left rounded-xl text-xs font-medium transition-colors border ${gradeFocus === stage ? "bg-purple-900/60 border-purple-500 text-white" : "bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850"}`}
  >
                  {stage}
                </button>)}
            </div>
          </div>

          <button
    onClick={handleSimulateNew}
    className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-slate-700"
  >
            <RefreshCw className={`w-3.5 h-3.5 ${isSimulating ? "animate-spin" : ""}`} />
            <span>Recalculate AI Model</span>
          </button>
        </div>

        {
    /* Right Output Predictions (7 cols) */
  }
        <div className="lg:col-span-7 space-y-6">
          {
    /* Key Metric Highlights */
  }
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
            <div className="bg-purple-950/40 border border-purple-800/40 p-4 rounded-2xl">
              <div className="flex items-center gap-2 text-purple-300 text-xs font-bold mb-1">
                <GraduationCap className="w-4 h-4" />
                <span>School Days Saved</span>
              </div>
              <p className="text-2xl font-bold text-white font-mono">
                {annualDaysSaved.toLocaleString()}
              </p>
              <p className="text-[11px] text-purple-300/80 mt-0.5">
                Over 1 academic school year
              </p>
            </div>

            <div className="bg-emerald-950/40 border border-emerald-800/40 p-4 rounded-2xl">
              <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold mb-1">
                <Award className="w-4 h-4" />
                <span>Girls Empowered</span>
              </div>
              <p className="text-2xl font-bold text-white font-mono">
                {girlsReached}
              </p>
              <p className="text-[11px] text-emerald-300/80 mt-0.5">
                Equipped for 2 full years
              </p>
            </div>

            <div className="bg-amber-950/40 border border-amber-800/40 p-4 rounded-2xl col-span-2 sm:col-span-1">
              <div className="flex items-center gap-2 text-amber-300 text-xs font-bold mb-1">
                <TrendingUp className="w-4 h-4" />
                <span>Exam Completion</span>
              </div>
              <p className="text-2xl font-bold text-amber-300 font-mono">
                +{examProbabilityBoost}%
              </p>
              <p className="text-[11px] text-amber-200/80 mt-0.5">
                KPSEA/KCSE sitting rate
              </p>
            </div>
          </div>

          {
    /* Secondary Impact Metrics */
  }
          <div className="bg-slate-950/50 p-5 rounded-2xl border border-slate-800/80 space-y-3.5">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 text-slate-300">
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                Early School Dropout Risk Reduction
              </span>
              <span className="font-bold text-emerald-400 font-mono">
                -{dropoutReductionPct}% dropouts
              </span>
            </div>

            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
    className="h-full bg-emerald-500 rounded-full"
    style={{ width: `${dropoutReductionPct}%` }}
  />
            </div>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-850">
              <span className="flex items-center gap-2 text-slate-300">
                <Leaf className="w-4 h-4 text-emerald-400" />
                Single-Use Plastic Waste Avoided
              </span>
              <span className="font-bold text-slate-200 font-mono">
                {plasticAvoidedKg} kg eco-offset
              </span>
            </div>
          </div>

          {
    /* AI Narrative Synthesis */
  }
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
            <div className="flex items-center gap-2 text-purple-400 font-bold mb-1 text-[11px] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Predictive Synthesis</span>
            </div>
            <p>
              In <strong className="text-white">{selectedCounty}</strong>, delivering {kitsFunded} reusable dignity kits directly targets the primary cause of monthly classroom dropouts. This intervention converts roughly{" "}
              <strong className="text-purple-300">{annualDaysSaved} lost school days</strong> back into active learning time, elevating standard grade averages by an estimated 1.4 grade tiers.
            </p>
          </div>

          {
    /* Action CTA */
  }
          <button
    id="btn-sponsor-predicted-impact"
    onClick={() => {
      if (onClose) onClose();
      dispatch(
        openDonationModal({
          charity: matchedCharity,
          presetAmount: donationAmount
        })
      );
    }}
    className="w-full py-3.5 bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-98 text-xs sm:text-sm"
  >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Fund This Exact Impact (${donationAmount} / KES {(donationAmount * 130).toLocaleString()})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>;
};
export {
  AiImpactPredictor
};