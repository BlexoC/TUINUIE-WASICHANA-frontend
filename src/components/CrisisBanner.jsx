import { AlertTriangle, Zap, ArrowRight, Heart } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store";
import { openDonationModal } from "../store/slices/donationSlice";
import { openCrisisModal } from "../store/slices/charitySlice";
import { translations } from "../lib/i18n";
const CrisisBanner = () => {
  const dispatch = useAppDispatch();
  const { currentLanguage } = useAppSelector((state) => state.language);
  const { crisisCampaigns } = useAppSelector((state) => state.charity);
  const { charities } = useAppSelector((state) => state.charity);
  const t = translations[currentLanguage];
  const activeCrisis = crisisCampaigns.find((c) => c.is_active);
  if (!activeCrisis) return null;
  const progressPercent = Math.min(
    100,
    Math.round(activeCrisis.raised_amount / activeCrisis.target_amount * 100)
  );
  const emergencyCharity = charities.find((c) => c.category === "Urgent Need") || charities[0];
  return <div
    id="crisis-response-banner"
    className="bg-linear-to-r from-rose-900 via-rose-800 to-purple-950 text-white py-3.5 px-4 sm:px-6 relative shadow-md border-b border-rose-700/50"
  >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="shrink-0 w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-rose-300 animate-pulse">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-rose-500/30 text-rose-200 border border-rose-400/30 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                Emergency Alert
              </span>
              <span className="font-bold text-white tracking-wide">
                {activeCrisis.title}
              </span>
            </div>
            <p className="text-rose-100/90 text-xs mt-0.5 line-clamp-1">
              {activeCrisis.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
          {
    /* Multiplier Match Indicator */
  }
          <div className="hidden lg:flex items-center gap-1.5 bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2.5 py-1 rounded-xl text-xs font-semibold">
            <Zap className="w-3.5 h-3.5 fill-amber-300" />
            <span>2x Match Active by {activeCrisis.matching_partner}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
    id="btn-view-crisis-details"
    onClick={() => dispatch(openCrisisModal())}
    className="px-3 py-1.5 bg-white/15 hover:bg-white/25 text-white rounded-xl text-xs font-semibold transition-colors"
  >
              Situation Report
            </button>

            <button
    id="btn-crisis-donate-now"
    onClick={() => dispatch(
      openDonationModal({
        charity: emergencyCharity,
        presetAmount: 30
      })
    )}
    className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs shadow-sm transition-all active:scale-95"
  >
              <Heart className="w-3.5 h-3.5 fill-slate-950" />
              <span>Send Emergency Kits</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>;
};
export {
  CrisisBanner
};