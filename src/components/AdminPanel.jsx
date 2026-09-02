import { useState, useEffect } from "react";
import {
  Shield,
  CheckCircle2,
  XCircle,
  Building2,
  Users,
  AlertCircle,
  BarChart3,
  Search,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store";
import {
  fetchDashboardStats,
  fetchApplications,
  approveApplication,
  rejectApplication,
  fetchUsers,
  deactivateUser,
  setAdminActiveTab,
} from "../store/slices/adminSlice";
import { fetchCharities } from "../store/slices/charitySlice";
import { useToast } from "./ToastContext";

const AdminPanel = () => {
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const { activeTab, stats, applications, applicationsLoading, users, usersLoading } =
    useAppSelector((state) => state.admin);
  const { charities } = useAppSelector((state) => state.charity);
  const [userSearch, setUserSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    dispatch(fetchDashboardStats());
    dispatch(fetchApplications({ status: "pending" }));
    dispatch(fetchUsers());
    dispatch(fetchCharities({ perPage: 12 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleApprove = async (id) => {
    const result = await dispatch(approveApplication(id));
    if (result.meta.requestStatus === "fulfilled") {
      showToast("Charity application approved — it's now live on the platform.", "success");
    } else {
      showToast(result.payload || "Could not approve application", "error");
    }
  };

  const handleReject = async (id) => {
    if (!rejectReason.trim()) {
      showToast("Please give a reason for rejecting this application.", "error");
      return;
    }
    const result = await dispatch(rejectApplication({ id, rejection_reason: rejectReason.trim() }));
    if (result.meta.requestStatus === "fulfilled") {
      showToast("Application rejected.", "info");
      setRejectingId(null);
      setRejectReason("");
    } else {
      showToast(result.payload || "Could not reject application", "error");
    }
  };

  const handleDeactivate = async (userId) => {
    const result = await dispatch(deactivateUser(userId));
    if (result.meta.requestStatus === "fulfilled") {
      showToast("User account deactivated", "info");
    } else {
      showToast(result.payload || "Could not deactivate user", "error");
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    const matchesSearch =
      !userSearch ||
      u.username.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const approvedCharities = charities.filter((c) => c.status === "active");

  return (
    <div className="py-10 bg-slate-50 min-h-[calc(100vh-80px)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Admin Header */}
        <div className="bg-linear-to-r from-purple-950 via-purple-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-800/80 text-purple-200 flex items-center justify-center border border-purple-600/40">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold font-serif mt-1">
                Tuinue Wasichana Admin Console
              </h1>
              <p className="text-xs text-purple-200 mt-0.5">
                Charity accreditation, platform stats, and user accounts
              </p>
            </div>
          </div>
        </div>

        {/* Stats — real numbers from GET /api/admin/dashboard */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Pending Applications
            </span>
            <span className="text-3xl font-bold text-amber-600 font-serif">
              {stats?.pending_applications ?? "—"}
            </span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Active Charities
            </span>
            <span className="text-3xl font-bold text-purple-950 font-serif">
              {stats?.total_active_charities ?? "—"}
            </span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Total Donors
            </span>
            <span className="text-3xl font-bold text-emerald-600 font-serif">
              {stats?.total_donors ?? "—"}
            </span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Total Raised
            </span>
            <span className="text-3xl font-bold text-purple-950 font-serif">
              Ksh {Number(stats?.total_amount_raised ?? 0).toLocaleString()}
            </span>
            <p className="text-[11px] text-slate-400 mt-1">
              across {stats?.total_donations ?? 0} completed donations
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto custom-scrollbar">
          <button
            onClick={() => dispatch(setAdminActiveTab("queue"))}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-colors shrink-0 flex items-center gap-2 ${activeTab === "queue" ? "bg-purple-900 text-white" : "text-slate-600 hover:bg-slate-100"}`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Accreditation Queue ({applications.length})</span>
          </button>
          <button
            onClick={() => dispatch(setAdminActiveTab("users"))}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-colors shrink-0 flex items-center gap-2 ${activeTab === "users" ? "bg-purple-900 text-white" : "text-slate-600 hover:bg-slate-100"}`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Users ({users.length})</span>
          </button>
          <button
            onClick={() => dispatch(setAdminActiveTab("directory"))}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-colors shrink-0 flex items-center gap-2 ${activeTab === "directory" ? "bg-purple-900 text-white" : "text-slate-600 hover:bg-slate-100"}`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Active Charities ({approvedCharities.length})</span>
          </button>
        </div>

        {/* Tab 1: Verification Queue */}
        {activeTab === "queue" && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900 font-serif flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                  <span>Charity Accreditation Queue</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Review new charity applications before they go live on the platform.
                </p>
              </div>
              <span className="px-3 py-1 bg-amber-50 text-amber-800 text-xs font-bold rounded-full border border-amber-200">
                {applications.length} Pending
              </span>
            </div>

            {applicationsLoading ? (
              <div className="p-12 text-center text-slate-500 text-sm">Loading applications…</div>
            ) : applications.length === 0 ? (
              <div className="p-12 text-center text-slate-500 text-sm space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <p className="font-bold text-slate-800 text-base">
                  All charity applications have been processed!
                </p>
                <p className="text-xs text-slate-400">
                  New submissions from the partner wizard will automatically queue here.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    className="p-6 hover:bg-slate-50/60 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                  >
                    <div className="space-y-2 max-w-2xl">
                      <span className="text-xs text-slate-400 font-mono">#{app.id}</span>
                      <h3 className="text-lg font-bold text-slate-900 font-serif">
                        {app.organization_name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                        <span>✉️ {app.contact_email}</span>
                        <span>
                          Submitted{" "}
                          {app.submitted_at ? new Date(app.submitted_at).toLocaleDateString() : "—"}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-start lg:items-end gap-2 self-start lg:self-auto shrink-0">
                      <div className="flex items-center gap-2">
                        <button
                          id={`btn-approve-${app.id}`}
                          onClick={() => handleApprove(app.id)}
                          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-2xl shadow-sm transition-all flex items-center gap-1.5 active:scale-95"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Approve</span>
                        </button>
                        <button
                          id={`btn-reject-${app.id}`}
                          onClick={() =>
                            setRejectingId(rejectingId === app.id ? null : app.id)
                          }
                          className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-2xl border border-rose-200 transition-colors flex items-center gap-1.5"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Reject</span>
                        </button>
                      </div>
                      {rejectingId === app.id && (
                        <div className="w-full lg:w-72 space-y-2">
                          <textarea
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Reason for rejection (required)"
                            className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-purple-700 focus:outline-hidden"
                            rows={2}
                          />
                          <button
                            onClick={() => handleReject(app.id)}
                            className="w-full py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg"
                          >
                            Confirm Rejection
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: User Management */}
        {activeTab === "users" && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 font-serif">Platform Users</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Deactivate accounts that violate platform policy. Role changes and
                  reactivation aren't exposed by the API yet.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-700 focus:outline-none w-52"
                  />
                </div>
                <select
                  value={roleFilter}
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
              {usersLoading ? (
                <div className="p-12 text-center text-slate-500 text-sm">Loading users…</div>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="p-4 pl-6">User</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Role</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 pr-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-4 pl-6">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-900 font-bold flex items-center justify-center shrink-0">
                              {u.username.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 text-sm">{u.username}</p>
                              <p className="text-[11px] text-slate-500 font-mono">#{u.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-slate-800">{u.email}</td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-purple-50 text-purple-950 border border-purple-200 capitalize">
                            {u.role}
                          </span>
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${!u.is_active ? "bg-rose-100 text-rose-800" : "bg-emerald-100 text-emerald-800"}`}
                          >
                            {u.is_active ? "Active" : "Deactivated"}
                          </span>
                        </td>
                        <td className="p-4 pr-6 text-right">
                          {u.role !== "admin" && u.is_active && (
                            <button
                              onClick={() => handleDeactivate(u.id)}
                              className="px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100"
                            >
                              Deactivate
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Active Charities Directory */}
        {activeTab === "directory" && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            <h2 className="text-xl font-bold text-slate-900 font-serif">
              Active Partner Charities
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {approvedCharities.map((c) => (
                <div
                  key={c.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3 text-xs"
                >
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-slate-900 text-sm block">{c.name}</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold uppercase text-[10px]">
                      Active
                    </span>
                  </div>
                  <p className="text-slate-600 line-clamp-2">{c.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export { AdminPanel };
