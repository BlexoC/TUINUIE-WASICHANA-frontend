import { useState } from "react";
import {
  Shield,
  CheckCircle2,
  XCircle,
  FileText,
  Building2,
  Users,
  AlertCircle,
  BarChart3,
  Activity,
  Search,
  Clock,
  CheckCheck
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { useAppDispatch, useAppSelector } from "../store";
import { updateCharityStatus } from "../store/slices/charitySlice";
import { addNotification } from "../store/slices/notificationSlice";
import {
  incrementApprovedCharityStat,
  updateUserRole,
  toggleUserStatus,
  addAuditLog
} from "../store/slices/adminSlice";
import { useToast } from "./ToastContext";
const AdminPanel = () => {
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const { charities } = useAppSelector((state) => state.charity);
  const { stats, users, auditLogs } = useAppSelector((state) => state.admin);
  const { donations } = useAppSelector((state) => state.donation);
  const [activeTab, setActiveTab] = useState("queue");
  const [selectedCharity, setSelectedCharity] = useState(null);
  const [userSearch, setUserSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const pendingCharities = charities.filter((c) => c.status === "pending");
  const approvedCharities = charities.filter((c) => c.status === "approved");
  const monthlyPlatformVolume = [
    { month: "Jan", amount: 28e5, donors: 840 },
    { month: "Feb", amount: 39e5, donors: 1120 },
    { month: "Mar", amount: 52e5, donors: 1540 },
    { month: "Apr", amount: 48e5, donors: 1390 },
    { month: "May", amount: 64e5, donors: 1980 },
    { month: "Jun", amount: 79e5, donors: 2450 },
    { month: "Jul", amount: 88e5, donors: 2780 },
    { month: "Aug", amount: 91e5, donors: 3100 }
  ];
  const categoryDistribution = [
    { name: "Sanitary Distribution", value: 45, color: "#6b21a8" },
    { name: "Urgent Dignity Kits", value: 25, color: "#e11d48" },
    { name: "Education & Mentorship", value: 20, color: "#0284c7" },
    { name: "Sanitation & WASH", value: 10, color: "#059669" }
  ];
  const handleUpdateStatus = (charityId, status) => {
    dispatch(updateCharityStatus({ id: charityId, status }));
    if (status === "approved") {
      dispatch(incrementApprovedCharityStat());
    }
    const targetCharity = charities.find((c) => c.id === charityId);
    dispatch(
      addNotification({
        title: `Charity ${status === "approved" ? "Approved" : "Status Updated"}`,
        message: `Organization "${targetCharity?.name}" has been marked as ${status}.`,
        type: "charity_status"
      })
    );
    dispatch(
      addAuditLog({
        id: `log_${Date.now()}`,
        actor_id: "usr_admin_1",
        actor_name: "Zawadi Admin",
        actor_role: "admin",
        action: `Charity ${status === "approved" ? "Approved" : "Rejected"}`,
        target: targetCharity?.name || "Charity",
        timestamp: "Just now",
        status: status === "approved" ? "success" : "warning",
        details: `Compliance officer marked application as ${status}`
      })
    );
    showToast(`Charity ${status === "approved" ? "approved for fundraising" : "rejected"}`);
    setSelectedCharity(null);
  };
  const handleBulkApprove = () => {
    pendingCharities.forEach((c) => {
      dispatch(updateCharityStatus({ id: c.id, status: "approved" }));
      dispatch(incrementApprovedCharityStat());
    });
    showToast(`Bulk approved ${pendingCharities.length} pending charity applications!`);
  };
  const handleRoleChange = (userId, newRole) => {
    dispatch(updateUserRole({ userId, newRole }));
    showToast(`Updated user role to ${newRole}`);
  };
  const handleToggleUserStatus = (userId) => {
    dispatch(toggleUserStatus(userId));
    showToast("User account status updated");
  };
  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    const matchesSearch = !userSearch || u.username.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase());
    return matchesRole && matchesSearch;
  });
  return <div className="py-10 bg-slate-50 min-h-[calc(100vh-80px)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {
    /* Admin Header */
  }
        <div className="bg-gradient-to-r from-purple-950 via-purple-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-800/80 text-purple-200 flex items-center justify-center border border-purple-600/40">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-extrabold tracking-wider uppercase border border-emerald-500/30">
                  Governance Portal Live
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-serif mt-1">
                Tuinue Wasichana Admin Console
              </h1>
              <p className="text-xs text-purple-200 mt-0.5">
                KYC Verification, Fund Governance, Audit Logs, and User RBAC
              </p>
            </div>
          </div>

          {pendingCharities.length > 0 && <button
    onClick={handleBulkApprove}
    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-2xl shadow-sm inline-flex items-center gap-2 transition-all active:scale-95 self-start md:self-auto"
  >
              <CheckCheck className="w-4 h-4" />
              <span>Bulk Approve All ({pendingCharities.length})</span>
            </button>}
        </div>

        {
    /* High-Level Governance Stats */
  }
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Pending KYC Reviews
            </span>
            <span className="text-3xl font-bold text-amber-600 font-serif">
              {pendingCharities.length}
            </span>
            <p className="text-[11px] text-slate-400 mt-1">Awaiting compliance sign-off</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Active Charities
            </span>
            <span className="text-3xl font-bold text-purple-950 font-serif">
              {approvedCharities.length}
            </span>
            <p className="text-[11px] text-slate-400 mt-1">Fundraising campaigns active</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Total Community Donors
            </span>
            <span className="text-3xl font-bold text-emerald-600 font-serif">
              {stats.donorsJoined.toLocaleString()}
            </span>
            <p className="text-[11px] text-emerald-700 mt-1">+140 joined this month</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Gross Funds Mobilized
            </span>
            <span className="text-3xl font-bold text-purple-950 font-serif">
              Ksh {stats.totalDonationsRaised.toLocaleString()}
            </span>
            <p className="text-[11px] text-slate-400 mt-1">~${Math.round(stats.totalDonationsRaised / 130).toLocaleString()} USD</p>
          </div>
        </div>

        {
    /* Tab Controls */
  }
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto custom-scrollbar">
          <button
    onClick={() => setActiveTab("queue")}
    className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-colors shrink-0 flex items-center gap-2 ${activeTab === "queue" ? "bg-purple-900 text-white" : "text-slate-600 hover:bg-slate-100"}`}
  >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Accreditation Queue ({pendingCharities.length})</span>
          </button>

          <button
    onClick={() => setActiveTab("analytics")}
    className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-colors shrink-0 flex items-center gap-2 ${activeTab === "analytics" ? "bg-purple-900 text-white" : "text-slate-600 hover:bg-slate-100"}`}
  >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Platform Analytics</span>
          </button>

          <button
    onClick={() => setActiveTab("users")}
    className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-colors shrink-0 flex items-center gap-2 ${activeTab === "users" ? "bg-purple-900 text-white" : "text-slate-600 hover:bg-slate-100"}`}
  >
            <Users className="w-3.5 h-3.5" />
            <span>User Management & RBAC ({users.length})</span>
          </button>

          <button
    onClick={() => setActiveTab("audit")}
    className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-colors shrink-0 flex items-center gap-2 ${activeTab === "audit" ? "bg-purple-900 text-white" : "text-slate-600 hover:bg-slate-100"}`}
  >
            <Activity className="w-3.5 h-3.5" />
            <span>System Audit Trail ({auditLogs.length})</span>
          </button>

          <button
    onClick={() => setActiveTab("directory")}
    className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-colors shrink-0 flex items-center gap-2 ${activeTab === "directory" ? "bg-purple-900 text-white" : "text-slate-600 hover:bg-slate-100"}`}
  >
            <Building2 className="w-3.5 h-3.5" />
            <span>Approved Charities Directory ({approvedCharities.length})</span>
          </button>
        </div>

        {
    /* Tab 1: Verification Queue */
  }
        {activeTab === "queue" && <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900 font-serif flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                  <span>Charity Accreditation & Compliance Queue</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Review submitted NGO certificates, financial audits, and director credentials before approving fundraising.
                </p>
              </div>
              <span className="px-3 py-1 bg-amber-50 text-amber-800 text-xs font-bold rounded-full border border-amber-200">
                {pendingCharities.length} Pending
              </span>
            </div>

            {pendingCharities.length === 0 ? <div className="p-12 text-center text-slate-500 text-sm space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <p className="font-bold text-slate-800 text-base">
                  All charity applications have been processed!
                </p>
                <p className="text-xs text-slate-400">
                  New submissions from the 4-step partner wizard will automatically queue here.
                </p>
              </div> : <div className="divide-y divide-slate-100">
                {pendingCharities.map((charity) => <div
    key={charity.id}
    className="p-6 hover:bg-slate-50/60 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-6"
  >
                    <div className="space-y-2 max-w-2xl">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md bg-purple-100 text-purple-900 text-[11px] font-bold">
                          {charity.org_type || "NGO"}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          {charity.id}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 font-serif">
                        {charity.name}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {charity.mission_statement}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                        <span>📍 {charity.address}</span>
                        <span>✉️ {charity.email}</span>
                        <span>📞 {charity.phone}</span>
                      </div>

                      {
    /* Attached Verification Documents */
  }
                      <div className="flex flex-wrap items-center gap-2 pt-2">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-900 border border-purple-200 rounded-lg text-xs font-medium">
                          <FileText className="w-3.5 h-3.5 text-purple-700" />
                          <span>{charity.ngo_cert_name || "NGO_Certificate.pdf"}</span>
                        </div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-900 border border-purple-200 rounded-lg text-xs font-medium">
                          <FileText className="w-3.5 h-3.5 text-purple-700" />
                          <span>{charity.audit_doc_name || "Financial_Audit_2023.pdf"}</span>
                        </div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-900 border border-purple-200 rounded-lg text-xs font-medium">
                          <FileText className="w-3.5 h-3.5 text-purple-700" />
                          <span>{charity.director_id_name || "Director_National_ID.pdf"}</span>
                        </div>
                      </div>
                    </div>

                    {
    /* Actions */
  }
                    <div className="flex items-center gap-2 self-start lg:self-auto shrink-0">
                      <button
    id={`btn-approve-${charity.id}`}
    onClick={() => handleUpdateStatus(charity.id, "approved")}
    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-2xl shadow-sm transition-all flex items-center gap-1.5 active:scale-95"
  >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Approve Charity</span>
                      </button>

                      <button
    id={`btn-reject-${charity.id}`}
    onClick={() => handleUpdateStatus(charity.id, "rejected")}
    className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-2xl border border-rose-200 transition-colors flex items-center gap-1.5"
  >
                        <XCircle className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>)}
              </div>}
          </div>}

        {
    /* Tab 2: Platform Analytics */
  }
        {activeTab === "analytics" && <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {
    /* Chart 1: Platform Donation Volume */
  }
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-serif">
                    Platform Donation Mobilization
                  </h3>
                  <p className="text-xs text-slate-500">
                    Gross monthly volume processed across M-Pesa and Stripe (KES)
                  </p>
                </div>
                <span className="text-xs font-bold text-purple-900 bg-purple-50 px-3 py-1 rounded-xl">
                  YTD 2026
                </span>
              </div>

              <div className="h-64 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyPlatformVolume}>
                    <defs>
                      <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6b21a8" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#6b21a8" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `${v / 1e6}M`} />
                    <Tooltip
    formatter={(v) => [`Ksh ${v.toLocaleString()}`, "Total Raised"]}
    contentStyle={{
      backgroundColor: "#0f172a",
      borderRadius: "12px",
      color: "#fff",
      fontSize: "12px"
    }}
  />
                    <Area
    type="monotone"
    dataKey="amount"
    stroke="#6b21a8"
    strokeWidth={3}
    fillOpacity={1}
    fill="url(#colorAmount)"
  />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {
    /* Chart 2: Category Distribution */
  }
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-serif">
                    Charity Category Breakdown
                  </h3>
                  <p className="text-xs text-slate-500">
                    Focus area distribution across accredited programs
                  </p>
                </div>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-xl">
                  Active Programs
                </span>
              </div>

              <div className="h-64 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
    data={categoryDistribution}
    cx="50%"
    cy="50%"
    innerRadius={55}
    outerRadius={85}
    paddingAngle={4}
    dataKey="value"
  >
                      {categoryDistribution.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <Tooltip
    formatter={(val) => [`${val}%`, "Share"]}
    contentStyle={{
      backgroundColor: "#0f172a",
      borderRadius: "12px",
      color: "#fff",
      fontSize: "12px"
    }}
  />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>}

        {
    /* Tab 3: User Management & RBAC */
  }
        {activeTab === "users" && <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 font-serif">
                  Platform Users & Role-Based Access Control (RBAC)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manage user roles, verify coordinator accounts, or adjust security status.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
    type="text"
    placeholder="Search users..."
    value={userSearch ?? ""}
    onChange={(e) => setUserSearch(e.target.value)}
    className="pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-700 focus:outline-none w-52"
  />
                </div>

                <select
    value={roleFilter ?? "all"}
    onChange={(e) => setRoleFilter(e.target.value)}
    className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-700 focus:outline-none"
  >
                  <option value="all">All Roles</option>
                  <option value="donor">Donors</option>
                  <option value="charity">Charity Coordinators</option>
                  <option value="admin">Administrators</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="p-4 pl-6">User Profile</th>
                    <th className="p-4">Contact Info</th>
                    <th className="p-4">Current Role</th>
                    <th className="p-4">Account Status</th>
                    <th className="p-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredUsers.map((u) => <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-900 font-bold flex items-center justify-center shrink-0">
                            {u.avatar ? <img
    src={u.avatar}
    alt={u.username}
    className="w-full h-full rounded-xl object-cover"
  /> : u.username.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-sm">{u.username}</p>
                            <p className="text-[11px] text-slate-500 font-mono">{u.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="text-slate-800">{u.email}</p>
                        <p className="text-[11px] text-slate-500">{u.phone || "+254 700 000 000"}</p>
                      </td>
                      <td className="p-4">
                        <select
    value={u.role ?? "donor"}
    onChange={(e) => handleRoleChange(u.id, e.target.value)}
    className="px-2.5 py-1 text-xs font-bold rounded-lg bg-purple-50 text-purple-950 border border-purple-200 focus:outline-none capitalize"
  >
                          <option value="donor">Donor</option>
                          <option value="charity">Charity Coordinator</option>
                          <option value="admin">Platform Admin</option>
                        </select>
                      </td>
                      <td className="p-4">
                        <span
    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${u.status === "suspended" ? "bg-rose-100 text-rose-800" : "bg-emerald-100 text-emerald-800"}`}
  >
                          {u.status || "Active"}
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <button
    onClick={() => handleToggleUserStatus(u.id)}
    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${u.status === "suspended" ? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100" : "bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100"}`}
  >
                          {u.status === "suspended" ? "Reactivate" : "Suspend"}
                        </button>
                      </td>
                    </tr>)}
                </tbody>
              </table>
            </div>
          </div>}

        {
    /* Tab 4: System Audit Trail */
  }
        {activeTab === "audit" && <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-serif">
                System Governance & Financial Audit Trail
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Immutable, real-time logging of administrative decisions, role adjustments, and payment triggers.
              </p>
            </div>

            <div className="space-y-3">
              {auditLogs.map((log) => <div
    key={log.id}
    className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
  >
                  <div className="flex items-start gap-3">
                    <div
    className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${log.status === "success" ? "bg-emerald-500" : log.status === "warning" ? "bg-amber-500" : "bg-purple-600"}`}
  />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">
                          {log.action}
                        </span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-600 font-medium">
                          {log.target}
                        </span>
                      </div>
                      <p className="text-slate-500 mt-0.5">{log.details}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[11px] font-bold text-purple-900 block">
                      {log.actor_name} ({log.actor_role})
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono flex items-center justify-end gap-1 mt-0.5">
                      <Clock className="w-3 h-3" />
                      {log.timestamp}
                    </span>
                  </div>
                </div>)}
            </div>
          </div>}

        {
    /* Tab 5: Approved Charities Directory */
  }
        {activeTab === "directory" && <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            <h2 className="text-xl font-bold text-slate-900 font-serif">
              Accredited Partner Charities Directory
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {approvedCharities.map((c) => <div
    key={c.id}
    className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3 text-xs"
  >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-bold text-slate-900 text-sm block">
                        {c.name}
                      </span>
                      <span className="text-[11px] text-slate-500">{c.category}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold uppercase text-[10px]">
                      Approved
                    </span>
                  </div>
                  <p className="text-slate-600 line-clamp-2">{c.mission_statement}</p>
                  <div className="pt-2 border-t border-slate-200 flex justify-between font-medium">
                    <span className="text-purple-950 font-bold">
                      Ksh {c.raised_amount.toLocaleString()} Raised
                    </span>
                    <span className="text-slate-500">
                      Goal: Ksh {c.target_amount.toLocaleString()}
                    </span>
                  </div>
                </div>)}
            </div>
          </div>}
      </div>
    </div>;
};
export {
  AdminPanel
};
