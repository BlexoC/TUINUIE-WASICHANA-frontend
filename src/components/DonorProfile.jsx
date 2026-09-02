import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  Award,
  Repeat,
  Calendar,
  CheckCircle2,
  PauseCircle,
  PlayCircle,
  XCircle,
  FileText,
  Sparkles
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store";
import {
  openReceiptModal,
  openDonationModal,
  fetchMyDonations,
  fetchMyRecurringPlans,
  updateRecurringPlan,
  cancelRecurringPlan
} from "../store/slices/donationSlice";
import { fetchCharities } from "../store/slices/charitySlice";
import { useToast } from "./ToastContext";
import { ImpactCalculator } from "./ImpactCalculator";

const DonorProfile = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user } = useAppSelector((state) => state.auth);
  const { donations, subscriptions } = useAppSelector((state) => state.donation);
  const { charities } = useAppSelector((state) => state.charity);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    dispatch(fetchMyDonations());
    dispatch(fetchMyRecurringPlans());
    dispatch(fetchCharities({ perPage: 100 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const charityName = (id) => charities.find((c) => c.id === id)?.name || `Charity #${id}`;

  const completedDonations = donations.filter((d) => d.payment_status === "completed");
  const totalDonatedKES = completedDonations.reduce(
    (acc, d) => acc + (d.currency === "KES" ? Number(d.amount) : Number(d.amount) * 130),
    0
  );
  const estimatedGirlsHelped = Math.max(completedDonations.length ? 1 : 0, Math.floor(totalDonatedKES / 1300));
  const estimatedDaysSaved = estimatedGirlsHelped * 24;

  const handleToggleSub = async (id, currentStatus) => {
    const nextStatus = currentStatus === "active" ? "paused" : "active";
    const result = await dispatch(updateRecurringPlan({ id, payload: { status: nextStatus } }));
    if (result.meta.requestStatus === "fulfilled") {
      showToast(`Recurring pledge has been ${nextStatus === "active" ? "resumed" : "paused"}`);
    } else {
      showToast(result.payload || "Could not update pledge", "error");
    }
  };

  const handleCancelSub = async (id) => {
    if (window.confirm("Are you sure you want to cancel this monthly dignity pledge?")) {
      const result = await dispatch(cancelRecurringPlan(id));
      if (result.meta.requestStatus === "fulfilled") {
        showToast("Recurring subscription cancelled");
      } else {
        showToast(result.payload || "Could not cancel pledge", "error");
      }
    }
  };

  return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="bg-linear-to-r from-purple-950 via-purple-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl z-0" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 border-2 border-purple-400/40 p-1 flex items-center justify-center text-3xl font-serif font-black text-purple-200">
              {user?.username?.charAt(0)?.toUpperCase() || "D"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-amber-400 text-purple-950 text-xs font-black uppercase tracking-wider rounded-full">
                  Donor
                </span>
                <span className="text-xs text-purple-300">
                  Member since {user?.created_at ? new Date(user.created_at).getFullYear() : "—"}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-serif mt-1">
                {user?.username || "Generous Supporter"}
              </h1>
              <p className="text-sm text-purple-200">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => navigate("/charities")}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-purple-950 font-bold text-sm rounded-2xl hover:bg-purple-100 transition-all shadow-lg active:scale-95"
            >
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              <span>Make New Donation</span>
            </button>
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-8 border-t border-purple-800/80">
          <div className="bg-purple-900/40 backdrop-blur-md rounded-2xl p-4 border border-purple-700/40">
            <div className="text-xs font-bold uppercase tracking-wider text-purple-300">
              Total Contributions
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-serif mt-1">
              Ksh {totalDonatedKES.toLocaleString()}
            </div>
            <div className="text-xs text-purple-300 mt-0.5">
              ~${Math.round(totalDonatedKES / 130).toLocaleString()} USD
            </div>
          </div>

          <div className="bg-purple-900/40 backdrop-blur-md rounded-2xl p-4 border border-purple-700/40">
            <div className="text-xs font-bold uppercase tracking-wider text-purple-300">
              Estimated Girls Sustained
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-serif mt-1">
              {estimatedGirlsHelped} Adolescent Girls
            </div>
            <div className="text-xs text-purple-300 mt-0.5">
              Estimate based on Ksh 1,300 per girl per term
            </div>
          </div>

          <div className="bg-purple-900/40 backdrop-blur-md rounded-2xl p-4 border border-purple-700/40">
            <div className="text-xs font-bold uppercase tracking-wider text-purple-300">
              Est. Class Attendance Days Saved
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-300 font-serif mt-1">
              {estimatedDaysSaved} Days
            </div>
            <div className="text-xs text-purple-300 mt-0.5">
              Rough estimate, not tracked per-beneficiary yet
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-2 custom-scrollbar">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-colors shrink-0 flex items-center gap-2 ${activeTab === "overview" ? "bg-purple-900 text-white" : "text-slate-600 hover:bg-slate-100"}`}
        >
          <Award className="w-4 h-4" />
          <span>Giving Overview</span>
        </button>

        <button
          onClick={() => setActiveTab("subscriptions")}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-colors shrink-0 flex items-center gap-2 ${activeTab === "subscriptions" ? "bg-purple-900 text-white" : "text-slate-600 hover:bg-slate-100"}`}
        >
          <Repeat className="w-4 h-4" />
          <span>Recurring Pledges ({subscriptions.filter((s) => s.status === "active").length})</span>
        </button>

        <button
          onClick={() => setActiveTab("history")}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-colors shrink-0 flex items-center gap-2 ${activeTab === "history" ? "bg-purple-900 text-white" : "text-slate-600 hover:bg-slate-100"}`}
        >
          <FileText className="w-4 h-4" />
          <span>Donation History ({donations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("calculator")}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-colors shrink-0 flex items-center gap-2 ${activeTab === "calculator" ? "bg-purple-900 text-white" : "text-slate-600 hover:bg-slate-100"}`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Impact Calculator</span>
        </button>
      </div>

      {activeTab === "overview" && <div className="space-y-8">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900 font-serif">
                Donor Recognition Badges
              </h3>
              <p className="text-slate-600 text-sm mt-0.5">
                Badge tracking isn't wired up on the backend yet — this section will populate
                once a real achievements system is built.
              </p>
            </div>
            <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-2xl text-sm text-slate-400">
              Coming soon
            </div>
          </div>

          <div className="bg-amber-50/70 border border-amber-200 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-900 bg-amber-200/70 px-2.5 py-0.5 rounded-full">
                <Repeat className="w-3.5 h-3.5" />
                <span>Monthly Sustaining Impact</span>
              </div>
              <h4 className="text-lg font-bold text-slate-900 font-serif">
                Monthly Pledges Keep Programs Active Throughout the School Term
              </h4>
              <p className="text-xs text-slate-600 max-w-xl">
                Charity coordinators rely on predictable monthly contributions to purchase bulk materials and schedule termly school visits ahead of time.
              </p>
            </div>

            <button
              onClick={() => setActiveTab("subscriptions")}
              className="px-5 py-2.5 bg-purple-900 text-white rounded-xl text-xs font-bold hover:bg-purple-800 transition-colors shrink-0"
            >
              Manage Pledges
            </button>
          </div>
        </div>}

      {activeTab === "subscriptions" && <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900 font-serif">
                Recurring Monthly Pledges
              </h3>
              <p className="text-slate-600 text-sm mt-0.5">
                Automated monthly donations processed via Safaricom M-Pesa STK or Stripe.
              </p>
            </div>

            <button
              onClick={() => navigate("/charities")}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-900 text-white text-xs font-bold rounded-xl hover:bg-purple-800 transition-colors"
            >
              <Repeat className="w-3.5 h-3.5" />
              <span>Add Monthly Pledge</span>
            </button>
          </div>

          {subscriptions.length === 0 ? <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl space-y-3">
              <Repeat className="w-10 h-10 text-slate-400 mx-auto" />
              <div className="font-bold text-slate-700">No active subscriptions</div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Setting up a monthly pledge guarantees a steady supply of sanitary kits for schoolgirls throughout their academic year.
              </p>
              <button
                onClick={() => navigate("/charities")}
                className="mt-2 px-4 py-2 bg-purple-900 text-white text-xs font-bold rounded-xl hover:bg-purple-800"
              >
                Set Up Monthly Pledge
              </button>
            </div> : <div className="space-y-4">
              {subscriptions.map((sub) => <div
                key={sub.id}
                className="p-5 sm:p-6 rounded-2xl border border-slate-200/80 bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
              >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full ${sub.status === "active" ? "bg-emerald-100 text-emerald-800" : sub.status === "paused" ? "bg-amber-100 text-amber-800" : "bg-rose-100 text-rose-800"}`}
                      >
                        {sub.status}
                      </span>
                      <span className="text-xs font-bold uppercase text-slate-500">
                        {sub.frequency}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900">
                      {charityName(sub.charity_id)}
                    </h4>

                    <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                      <span className="font-bold text-purple-950 text-sm">
                        {sub.currency} {Number(sub.amount).toLocaleString()} / mo
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        Next charge:{" "}
                        {sub.next_donation_date
                          ? new Date(sub.next_donation_date).toLocaleDateString()
                          : "—"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    {sub.status !== "cancelled" && <button
                      onClick={() => handleToggleSub(sub.id, sub.status)}
                      className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors ${sub.status === "active" ? "bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100" : "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"}`}
                    >
                        {sub.status === "active" ? <>
                            <PauseCircle className="w-4 h-4" />
                            <span>Pause Pledge</span>
                          </> : <>
                            <PlayCircle className="w-4 h-4" />
                            <span>Resume Pledge</span>
                          </>}
                      </button>}

                    {sub.status !== "cancelled" && <button
                      onClick={() => handleCancelSub(sub.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                      title="Cancel pledge"
                    >
                        <XCircle className="w-5 h-5" />
                      </button>}
                  </div>
                </div>)}
            </div>}
        </div>}

      {activeTab === "history" && <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900 font-serif">
                Donation History & Receipts
              </h3>
              <p className="text-slate-600 text-sm mt-0.5">
                Every transaction generates a verifiable receipt.
              </p>
            </div>

            <span className="text-xs font-bold text-purple-900 bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-100">
              {donations.length} Contributions Recorded
            </span>
          </div>

          {donations.length === 0 ? (
            <div className="text-center py-12 text-sm text-slate-500">
              No donations yet — your first gift will show up here.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Beneficiary</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Method & Ref</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {donations.map((don) => <tr key={don.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 text-xs text-slate-600">
                        {don.donated_at ? new Date(don.donated_at).toLocaleDateString() : "—"}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {charityName(don.charity_id)}
                        <div className="text-[11px] font-normal text-slate-500 capitalize">
                          {don.donation_type} gift
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-extrabold text-purple-950 font-serif">
                        {don.currency} {Number(don.amount).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-xs font-mono text-slate-600">
                        <span className="uppercase font-bold text-[10px] text-slate-400 block font-sans">
                          {don.payment_provider}
                        </span>
                        {don.provider_transaction_id}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${don.payment_status === "completed" ? "bg-emerald-100 text-emerald-800" : don.payment_status === "failed" ? "bg-rose-100 text-rose-800" : "bg-amber-100 text-amber-800"}`}
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{don.payment_status}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() =>
                            dispatch(
                              openReceiptModal({ ...don, charity_name: charityName(don.charity_id) })
                            )
                          }
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-purple-100 text-purple-900 rounded-xl text-xs font-bold transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>View Receipt</span>
                        </button>
                      </td>
                    </tr>)}
                </tbody>
              </table>
            </div>
          )}
        </div>}

      {activeTab === "calculator" && <div className="space-y-6">
          <ImpactCalculator embedded />
        </div>}
    </div>;
};

export { DonorProfile };
