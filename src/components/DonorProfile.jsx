import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Award, Repeat, Calendar, CheckCircle2, PauseCircle, PlayCircle, XCircle, FileText, Sparkles } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store";
import { openReceiptModal, updateSubscriptionStatus, openDonationModal } from "../store/slices/donationSlice";
import { useToast } from "./ToastContext";
import { ImpactCalculator } from "./ImpactCalculator";
const DonorProfile = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const onNavigateToCharities = () => navigate("/charities");
  const { showToast } = useToast();
  const { user } = useAppSelector((state) => state.auth);
  const { donations, subscriptions, donorBadges } = useAppSelector(
    (state) => state.donation
  );
  const [activeTab, setActiveTab] = useState("overview");
  const userDonations = donations.filter(
    (d) => d.donor_id === user?.id || d.donor_email === user?.email || user?.role === "donor"
  );
  const totalDonatedKES = userDonations.filter((d) => d.payment_status === "completed").reduce((acc, d) => acc + (d.currency === "KES" ? d.amount : d.amount * 130), 0);
  const estimatedGirlsHelped = Math.max(1, Math.floor(totalDonatedKES / 1300));
  const estimatedDaysSaved = estimatedGirlsHelped * 24;
  const handleToggleSub = (id, currentStatus) => {
    const nextStatus = currentStatus === "active" ? "paused" : "active";
    dispatch(updateSubscriptionStatus({ id, status: nextStatus }));
    showToast(
      `Recurring pledge has been ${nextStatus === "active" ? "resumed" : "paused"}`
    );
  };
  const handleCancelSub = (id) => {
    if (window.confirm("Are you sure you want to cancel this monthly dignity pledge?")) {
      dispatch(updateSubscriptionStatus({ id, status: "cancelled" }));
      showToast("Recurring subscription cancelled");
    }
  };
  return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {
    /* Donor Banner Header */
  }
      <div className="bg-linear-to-r from-purple-950 via-purple-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl z-0" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 border-2 border-purple-400/40 p-1 flex items-center justify-center text-3xl font-serif font-black text-purple-200">
              {user?.avatar ? <img
    src={user.avatar}
    alt={user.username}
    className="w-full h-full rounded-xl object-cover"
  /> : user?.username?.charAt(0) || "D"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-amber-400 text-purple-950 text-xs font-black uppercase tracking-wider rounded-full">
                  Verified Donor
                </span>
                <span className="text-xs text-purple-300">
                  Member since {user?.created_at ? new Date(user.created_at).getFullYear() : "2024"}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-serif mt-1">
                {user?.username || "Generous Supporter"}
              </h1>
              <p className="text-sm text-purple-200">{user?.email || "amina.kimani@example.org"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
    onClick={() => dispatch(openDonationModal({}))}
    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-purple-950 font-bold text-sm rounded-2xl hover:bg-purple-100 transition-all shadow-lg active:scale-95"
  >
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              <span>Make New Donation</span>
            </button>
          </div>
        </div>

        {
    /* Highlight KPI Counters */
  }
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
              Girls Sustained with Dignity
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-serif mt-1">
              {estimatedGirlsHelped} Adolescent Girls
            </div>
            <div className="text-xs text-purple-300 mt-0.5">
              Equipped with full reusable hygiene kits
            </div>
          </div>

          <div className="bg-purple-900/40 backdrop-blur-md rounded-2xl p-4 border border-purple-700/40">
            <div className="text-xs font-bold uppercase tracking-wider text-purple-300">
              Class Attendance Days Saved
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-300 font-serif mt-1">
              {estimatedDaysSaved} Days
            </div>
            <div className="text-xs text-purple-300 mt-0.5">
              Zero dropouts reported across sponsored schools
            </div>
          </div>
        </div>
      </div>

      {
    /* Navigation Sub-Tabs */
  }
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-2 custom-scrollbar">
        <button
    onClick={() => setActiveTab("overview")}
    className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-colors shrink-0 flex items-center gap-2 ${activeTab === "overview" ? "bg-purple-900 text-white" : "text-slate-600 hover:bg-slate-100"}`}
  >
          <Award className="w-4 h-4" />
          <span>Giving Overview & Badges</span>
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
          <span>Donation History & Receipts ({userDonations.length})</span>
        </button>

        <button
    onClick={() => setActiveTab("calculator")}
    className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-colors shrink-0 flex items-center gap-2 ${activeTab === "calculator" ? "bg-purple-900 text-white" : "text-slate-600 hover:bg-slate-100"}`}
  >
          <Sparkles className="w-4 h-4" />
          <span>Impact Calculator</span>
        </button>
      </div>

      {
    /* Tab 1: Giving Overview & Badges */
  }
      {activeTab === "overview" && <div className="space-y-8">
          {
    /* Recognition Badges */
  }
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900 font-serif">
                Your Donor Recognition Badges
              </h3>
              <p className="text-slate-600 text-sm mt-0.5">
                Earn badges as you empower more adolescent girls and advance period equity.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {donorBadges.map((badge) => <div
    key={badge.id}
    className={`p-5 rounded-2xl border transition-all ${badge.unlocked ? "bg-linear-to-b from-purple-50/60 to-white border-purple-200 shadow-sm" : "bg-slate-50 border-slate-200 opacity-60"}`}
  >
                  <div className="text-3xl mb-3">{badge.icon}</div>
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 text-sm">
                      {badge.title}
                    </h4>
                    {badge.unlocked ? <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                        Unlocked
                      </span> : <span className="text-[10px] font-semibold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">
                        Locked
                      </span>}
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {badge.description}
                  </p>
                  {badge.unlocked_at && <div className="text-[10px] text-purple-700 font-medium mt-3">
                      Earned on {new Date(badge.unlocked_at).toLocaleDateString()}
                    </div>}
                </div>)}
            </div>
          </div>

          {
    /* Quick Active Recurring Pledge Banner */
  }
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

      {
    /* Tab 2: Recurring Subscriptions */
  }
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
    onClick={() => dispatch(openDonationModal({}))}
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
    onClick={() => dispatch(openDonationModal({}))}
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
                        {sub.frequency} • {sub.payment_method}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900">
                      {sub.charity_name}
                    </h4>

                    <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                      <span className="font-bold text-purple-950 text-sm">
                        {sub.currency} {sub.amount.toLocaleString()} / mo
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        Next charge: {sub.next_billing_date}
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

      {
    /* Tab 3: Donation History & Tax Receipts */
  }
      {activeTab === "history" && <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900 font-serif">
                Donation History & Official Receipts
              </h3>
              <p className="text-slate-600 text-sm mt-0.5">
                Every transaction generates an official, verifiable tax receipt.
              </p>
            </div>

            <span className="text-xs font-bold text-purple-900 bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-100">
              {userDonations.length} Contributions Recorded
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Beneficiary</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Method & Ref</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Tax Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {userDonations.map((don) => <tr key={don.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-xs text-slate-600">
                      {new Date(don.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {don.charity_name}
                      <div className="text-[11px] font-normal text-slate-500 capitalize">
                        {don.frequency} gift
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-purple-950 font-serif">
                      {don.currency} {don.amount.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-xs font-mono text-slate-600">
                      <span className="uppercase font-bold text-[10px] text-slate-400 block font-sans">
                        {don.payment_method}
                      </span>
                      {don.mpesa_receipt || don.stripe_payment_id?.slice(0, 14) || "REF-VERIFIED"}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Completed</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
    onClick={() => dispatch(openReceiptModal(don))}
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
        </div>}

      {
    /* Tab 4: Impact Calculator */
  }
      {activeTab === "calculator" && <div className="space-y-6">
          <ImpactCalculator embedded />
        </div>}
    </div>;
};
export {
  DonorProfile
};