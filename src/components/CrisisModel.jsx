import { X, AlertTriangle, Zap, Heart, MapPin } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store";
import { closeCrisisModal } from "../store/slices/charitySlice";
import { openDonationModal } from "../store/slices/donationSlice";
const CrisisModal = () => {
  const dispatch = useAppDispatch();
  const { isCrisisModalOpen, crisisCampaigns, charities } = useAppSelector(
    (state) => state.charity
  );
  if (!isCrisisModalOpen) return null;
  const emergencyCharity = charities.find((c) => c.category === "Urgent Need") || charities[0];
  return <div
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto"
    role="dialog"
    aria-modal="true"
  >
      <div className="bg-white rounded-3xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8">
        {
    /* Header */
  }
        <div className="bg-rose-950 text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-300 flex items-center justify-center border border-rose-500/30">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold font-serif">
                  Rapid Disaster & Crisis Response Protocol
                </h3>
                <span className="bg-rose-500/30 text-rose-200 text-[10px] font-bold px-2 py-0.5 rounded-full border border-rose-400/30 uppercase">
                  Active Relief
                </span>
              </div>
              <p className="text-xs text-rose-200/80">
                Coordinating emergency hygiene kits and WASH supplies during acute regional disruptions.
              </p>
            </div>
          </div>

          <button
    onClick={() => dispatch(closeCrisisModal())}
    className="p-2 text-rose-200 hover:text-white rounded-xl transition-colors"
    aria-label="Close modal"
  >
            <X className="w-5 h-5" />
          </button>
        </div>

        {
    /* Body */
  }
        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          {crisisCampaigns.map((crisis) => {
    const pct = Math.min(
      100,
      Math.round(crisis.raised_amount / crisis.target_amount * 100)
    );
    return <div
      key={crisis.id}
      className="p-6 rounded-3xl bg-slate-50 border border-slate-200/90 space-y-4"
    >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-900 border border-rose-200">
                        {crisis.urgency} Urgency
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-rose-700" />
                        {crisis.county}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-slate-900 font-serif">
                      {crisis.title}
                    </h4>
                  </div>

                  <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-xl text-xs font-bold self-start sm:self-auto">
                    <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>{crisis.matching_multiplier}x Match: {crisis.matching_partner}</span>
                  </div>
                </div>

                <p className="text-slate-600 text-xs leading-relaxed">
                  {crisis.description}
                </p>

                {
      /* Metrics */
    }
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                  <div className="bg-white p-3 rounded-2xl border border-slate-200">
                    <span className="text-[11px] text-slate-400 block">Kits Dispatched</span>
                    <span className="text-base font-bold text-slate-900 font-mono">
                      {crisis.delivered_kits.toLocaleString()} / {crisis.target_kits.toLocaleString()}
                    </span>
                  </div>

                  <div className="bg-white p-3 rounded-2xl border border-slate-200">
                    <span className="text-[11px] text-slate-400 block">Relief Raised</span>
                    <span className="text-base font-bold text-emerald-800 font-mono">
                      KES {crisis.raised_amount.toLocaleString()}
                    </span>
                  </div>

                  <div className="bg-white p-3 rounded-2xl border border-slate-200 col-span-2 sm:col-span-1">
                    <span className="text-[11px] text-slate-400 block">Goal Progress</span>
                    <span className="text-base font-bold text-purple-900 font-mono">
                      {pct}% Funded
                    </span>
                  </div>
                </div>

                {
      /* Progress bar */
    }
                <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
      className="h-full bg-linear-to-r from-rose-700 to-purple-800 rounded-full"
      style={{ width: `${pct}%` }}
    />
                </div>

                {
      /* Action button */
    }
                <button
      onClick={() => {
        dispatch(closeCrisisModal());
        dispatch(
          openDonationModal({
            charity: emergencyCharity,
            presetAmount: 30
          })
        );
      }}
      className="w-full py-3 bg-rose-900 hover:bg-rose-800 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98"
    >
                  <Heart className="w-4 h-4 fill-rose-300 text-rose-300" />
                  <span>Donate Emergency Kits ({crisis.matching_multiplier}x Multiplier Applied)</span>
                </button>
              </div>;
  })}
        </div>
      </div>
    </div>;
};
export {
  CrisisModal
};