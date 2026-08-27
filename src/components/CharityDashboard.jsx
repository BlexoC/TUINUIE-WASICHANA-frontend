import { useState } from "react";
import {
  Users,
  PlusCircle,
  Package,
  GraduationCap,
  Search,
  CheckCircle2,
  Trash2,
  Heart,
  BarChart3,
  FileSpreadsheet,
  BookOpen
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
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
import {
  openAddBeneficiaryModal,
  closeAddBeneficiaryModal,
  addBeneficiary,
  distributeKitToBeneficiary,
  deleteBeneficiary,
  setBeneficiaryFilterStatus,
  setBeneficiarySearchQuery
} from "../store/slices/beneficiarySlice";
import { useToast } from "./ToastContext";
const CharityDashboard = () => {
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const { beneficiaries, isAddModalOpen, filterStatus, searchQuery } = useAppSelector((state) => state.beneficiary);
  const { user } = useAppSelector((state) => state.auth);
  const { charities } = useAppSelector((state) => state.charity);
  const { donations } = useAppSelector((state) => state.donation);
  const [activeTab, setActiveTab] = useState("roster");
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("14");
  const [schoolName, setSchoolName] = useState("");
  const [gradeLevel, setGradeLevel] = useState("Grade 8");
  const [story, setStory] = useState("");
  const charity = charities.find((c) => c.id === user?.charity_id) || charities[1];
  const charityDonations = donations.filter(
    (d) => d.charity_id === charity?.id
  );
  const filteredBeneficiaries = beneficiaries.filter((b) => {
    const matchesStatus = filterStatus === "all" || b.status === filterStatus;
    const matchesSearch = !searchQuery || b.full_name.toLowerCase().includes(searchQuery.toLowerCase()) || b.school_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });
  const distributionData = [
    { month: "Jan", kits: 180, attendance: 92 },
    { month: "Feb", kits: 240, attendance: 94 },
    { month: "Mar", kits: 310, attendance: 95 },
    { month: "Apr", kits: 290, attendance: 95.8 },
    { month: "May", kits: 420, attendance: 96.5 },
    { month: "Jun", kits: 510, attendance: 97.1 },
    { month: "Jul", kits: 480, attendance: 97.4 },
    { month: "Aug", kits: 630, attendance: 98.2 }
  ];
  const fundAllocationData = [
    { name: "Direct Reusable Kits", value: 70, color: "#6b21a8" },
    { name: "Logistics & Distribution", value: 15, color: "#f59e0b" },
    { name: "Health & Puberty Workshops", value: 10, color: "#10b981" },
    { name: "Program Monitoring", value: 5, color: "#64748b" }
  ];
  const handleAddBeneficiary = (e) => {
    e.preventDefault();
    if (!fullName || !schoolName) return;
    const newBen = {
      id: `ben_${Date.now()}`,
      charity_id: charity?.id || "ch_heshima",
      full_name: fullName,
      age: parseInt(age) || 14,
      school_name: schoolName,
      grade_level: gradeLevel,
      kits_received: 1,
      attendance_rate: 96,
      story: story || "Newly enrolled into school dignity kits and menstrual health support.",
      status: "active",
      last_kit_date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    dispatch(addBeneficiary(newBen));
    showToast(`Enrolled ${fullName} into dignity kit roster`);
    setFullName("");
    setSchoolName("");
    setStory("");
  };
  const handleExportCSV = () => {
    const headers = ["ID", "Full Name", "Age", "School Name", "Grade Level", "Kits Received", "Attendance Rate (%)", "Status", "Last Kit Date"];
    const rows = filteredBeneficiaries.map((b) => [
      b.id,
      `"${b.full_name}"`,
      b.age,
      `"${b.school_name}"`,
      `"${b.grade_level}"`,
      b.kits_received,
      b.attendance_rate,
      b.status,
      b.last_kit_date || "N/A"
    ]);
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Beneficiaries_Roster_${charity.name.replace(/\s+/g, "_")}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast("Beneficiary roster CSV exported successfully!");
  };
  return <div className="py-10 bg-slate-50 min-h-[calc(100vh-80px)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {
    /* Charity Hero & Metrics Header */
  }
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-900 text-xs font-bold uppercase tracking-wider mb-2">
              <span>{charity.org_type || "Accredited Partner NGO"}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif">
              {charity.name}
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              {charity.mission_statement}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-3 font-medium">
              <span>📍 {charity.address}</span>
              <span>•</span>
              <span>👤 Coordinator: {charity.contact_person}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto shrink-0">
            <button
    onClick={handleExportCSV}
    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-bold transition-colors inline-flex items-center gap-2 border border-slate-200"
  >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Export CSV</span>
            </button>

            <button
    id="btn-open-add-beneficiary"
    onClick={() => dispatch(openAddBeneficiaryModal())}
    className="px-5 py-2.5 bg-purple-900 hover:bg-purple-800 text-white rounded-2xl text-xs font-bold shadow-sm inline-flex items-center gap-2 transition-all active:scale-95"
  >
              <PlusCircle className="w-4 h-4" />
              <span>Enroll Beneficiary</span>
            </button>
          </div>
        </div>

        {
    /* Impact Stat Cards */
  }
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">
                Total Beneficiaries
              </span>
              <Users className="w-4 h-4 text-purple-900" />
            </div>
            <span className="text-3xl font-bold text-purple-950 font-serif">
              {beneficiaries.length} Girls
            </span>
            <p className="text-[11px] text-emerald-700 font-semibold mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 100% active in school
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">
                Kits Distributed
              </span>
              <Package className="w-4 h-4 text-purple-900" />
            </div>
            <span className="text-3xl font-bold text-purple-950 font-serif">
              {beneficiaries.reduce((acc, b) => acc + b.kits_received, 0)}
            </span>
            <p className="text-[11px] text-slate-500 mt-1">
              Quarterly dignity packs delivered
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">
                Avg Attendance Rate
              </span>
              <GraduationCap className="w-4 h-4 text-purple-900" />
            </div>
            <span className="text-3xl font-bold text-emerald-600 font-serif">
              97.4%
            </span>
            <p className="text-[11px] text-emerald-700 mt-1">
              +18.4% improvement baseline
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">
                Funds Raised
              </span>
              <Heart className="w-4 h-4 text-purple-900" />
            </div>
            <span className="text-3xl font-bold text-purple-950 font-serif">
              Ksh {charity.raised_amount.toLocaleString()}
            </span>
            <p className="text-[11px] text-slate-500 mt-1">
              Target: Ksh {charity.target_amount.toLocaleString()} ({Math.round(charity.raised_amount / charity.target_amount * 100)}%)
            </p>
          </div>
        </div>

        {
    /* Dashboard Sub-Tabs */
  }
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <button
    onClick={() => setActiveTab("roster")}
    className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${activeTab === "roster" ? "bg-purple-900 text-white" : "text-slate-600 hover:bg-slate-100"}`}
  >
            Beneficiary Roster ({filteredBeneficiaries.length})
          </button>
          <button
    onClick={() => setActiveTab("analytics")}
    className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${activeTab === "analytics" ? "bg-purple-900 text-white" : "text-slate-600 hover:bg-slate-100"}`}
  >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Analytics & KPIs</span>
          </button>
          <button
    onClick={() => setActiveTab("donations")}
    className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${activeTab === "donations" ? "bg-purple-900 text-white" : "text-slate-600 hover:bg-slate-100"}`}
  >
            <Heart className="w-3.5 h-3.5" />
            <span>Direct Donations ({charityDonations.length})</span>
          </button>
          <button
    onClick={() => setActiveTab("stories")}
    className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${activeTab === "stories" ? "bg-purple-900 text-white" : "text-slate-600 hover:bg-slate-100"}`}
  >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Beneficiary Stories</span>
          </button>
        </div>

        {
    /* Tab 1: Beneficiary Management Table */
  }
        {activeTab === "roster" && <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 font-serif">
                  Beneficiary Roster & Distribution Tracker
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Log kit dispatches, monitor school attendance, and document student success.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
    type="text"
    placeholder="Search by name or school..."
    value={searchQuery ?? ""}
    onChange={(e) => dispatch(setBeneficiarySearchQuery(e.target.value))}
    className="pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-700 focus:outline-none w-56"
  />
                </div>

                <select
    value={filterStatus ?? "all"}
    onChange={(e) => dispatch(setBeneficiaryFilterStatus(e.target.value))}
    className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-700 focus:outline-none"
  >
                  <option value="all">All Statuses</option>
                  <option value="active">Active Support</option>
                  <option value="graduated">Graduated</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="p-4 pl-6">Student Name & Age</th>
                    <th className="p-4">School & Grade</th>
                    <th className="p-4">Kits Received</th>
                    <th className="p-4">Attendance Rate</th>
                    <th className="p-4">Last Kit Date</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredBeneficiaries.map((ben) => <tr key={ben.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 pl-6">
                        <p className="font-bold text-slate-900 text-sm">{ben.full_name}</p>
                        <p className="text-[11px] text-slate-500">
                          {ben.age} years old
                        </p>
                      </td>
                      <td className="p-4">
                        <p className="font-semibold text-slate-800">
                          {ben.school_name}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {ben.grade_level}
                        </p>
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-purple-950 text-sm">
                          {ben.kits_received}
                        </span>{" "}
                        kits
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-emerald-700">
                            {ben.attendance_rate}%
                          </span>
                          <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div
    className="h-full bg-emerald-600 rounded-full"
    style={{ width: `${ben.attendance_rate}%` }}
  />
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-slate-600 font-mono text-[11px]">
                        {ben.last_kit_date || "2024-07-20"}
                      </td>
                      <td className="p-4">
                        <span
    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${ben.status === "graduated" ? "bg-blue-100 text-blue-800" : "bg-emerald-100 text-emerald-800"}`}
  >
                          {ben.status}
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
    onClick={() => {
      dispatch(
        distributeKitToBeneficiary({
          id: ben.id,
          kitDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
        })
      );
      showToast(`Logged dignity kit dispatch for ${ben.full_name}`);
    }}
    className="px-2.5 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-900 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1"
    title="Log kit distribution"
  >
                            <Package className="w-3 h-3" />
                            <span>+ Log Kit</span>
                          </button>
                          <button
    onClick={() => {
      if (window.confirm(`Delete record for ${ben.full_name}?`)) {
        dispatch(deleteBeneficiary(ben.id));
        showToast(`Removed ${ben.full_name}`);
      }
    }}
    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
  >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>)}
                </tbody>
              </table>
            </div>
          </div>}

        {
    /* Tab 2: Analytics & Reports */
  }
        {activeTab === "analytics" && <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {
    /* Chart 1: Monthly Distribution Trend */
  }
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-serif">
                    Monthly Kit Distribution Trend
                  </h3>
                  <p className="text-xs text-slate-500">
                    Number of complete hygiene packs delivered to schools
                  </p>
                </div>
                <div className="text-xs font-bold text-purple-900 bg-purple-50 px-3 py-1 rounded-xl">
                  2026 Year-to-Date
                </div>
              </div>

              <div className="h-64 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={distributionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip
    contentStyle={{
      backgroundColor: "#0f172a",
      borderRadius: "12px",
      color: "#fff",
      border: "none",
      fontSize: "12px"
    }}
  />
                    <Bar dataKey="kits" name="Kits Delivered" fill="#6b21a8" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {
    /* Chart 2: Fund Allocation Breakdown */
  }
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-serif">
                    Fund Utilization & Transparency
                  </h3>
                  <p className="text-xs text-slate-500">
                    Audited breakdown of every shilling disbursed
                  </p>
                </div>
                <div className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-xl">
                  100% Audited
                </div>
              </div>

              <div className="h-64 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
    data={fundAllocationData}
    cx="50%"
    cy="50%"
    innerRadius={60}
    outerRadius={85}
    paddingAngle={4}
    dataKey="value"
  >
                      {fundAllocationData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <Tooltip
    formatter={(val) => [`${val}%`, "Allocation"]}
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
    /* Tab 3: Direct Donations Received */
  }
        {activeTab === "donations" && <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-xl font-bold text-slate-900 font-serif">
              Direct Contributions Received
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Donor Name</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Channel</th>
                    <th className="py-3 px-4">Donor Note</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {charityDonations.map((d) => <tr key={d.id}>
                      <td className="py-3.5 px-4 text-slate-600 font-mono">
                        {new Date(d.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {d.is_anonymous ? "Anonymous Supporter" : d.donor_name || "Supporter"}
                      </td>
                      <td className="py-3.5 px-4 font-extrabold text-purple-950 text-sm">
                        {d.currency} {d.amount.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 uppercase font-bold text-slate-600">
                        {d.payment_method}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 italic">
                        "{d.message || "Support for girls education."}"
                      </td>
                    </tr>)}
                </tbody>
              </table>
            </div>
          </div>}

        {
    /* Tab 4: Beneficiary Stories */
  }
        {activeTab === "stories" && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {beneficiaries.map((ben) => <div
    key={ben.id}
    className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between"
  >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-900 bg-purple-100 px-2.5 py-0.5 rounded-full">
                      {ben.grade_level}
                    </span>
                    <span className="text-xs text-emerald-700 font-bold">
                      {ben.attendance_rate}% Attendance
                    </span>
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-slate-900 font-serif">
                      {ben.full_name} ({ben.age} yrs)
                    </h4>
                    <p className="text-xs text-slate-500 font-medium">{ben.school_name}</p>
                  </div>

                  <p className="text-xs text-slate-600 italic leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    "{ben.story}"
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span>{ben.kits_received} Dignity Kits Delivered</span>
                  <span className="text-purple-900 font-bold">Verified Story</span>
                </div>
              </div>)}
          </div>}
      </div>

      {
    /* Add Beneficiary Modal */
  }
      {isAddModalOpen && <div
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
    role="dialog"
    aria-modal="true"
  >
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8 space-y-4">
            <h3 className="text-xl font-bold text-slate-900 font-serif">
              Enroll New Beneficiary
            </h3>
            <p className="text-xs text-slate-500">
              Register an adolescent student to receive regular dignity kits and tracking.
            </p>
            <form onSubmit={handleAddBeneficiary} className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
    type="text"
    required
    placeholder="e.g. Cynthia Moraa"
    value={fullName ?? ""}
    onChange={(e) => setFullName(e.target.value)}
    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-700"
  />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Age *
                  </label>
                  <input
    type="number"
    min={8}
    max={25}
    value={age ?? ""}
    onChange={(e) => setAge(e.target.value)}
    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Grade / Level *
                  </label>
                  <input
    type="text"
    value={gradeLevel ?? ""}
    onChange={(e) => setGradeLevel(e.target.value)}
    placeholder="Grade 8"
    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  School Name *
                </label>
                <input
    type="text"
    required
    placeholder="e.g. Kilifi Township Primary"
    value={schoolName ?? ""}
    onChange={(e) => setSchoolName(e.target.value)}
    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
  />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Student Story / Aspiration
                </label>
                <textarea
    rows={2}
    placeholder="Aspires to become an engineer..."
    value={story ?? ""}
    onChange={(e) => setStory(e.target.value)}
    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
  />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
    type="button"
    onClick={() => dispatch(closeAddBeneficiaryModal())}
    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
  >
                  Cancel
                </button>
                <button
    type="submit"
    className="px-5 py-2 text-xs font-bold bg-purple-900 text-white rounded-xl hover:bg-purple-800 transition-colors shadow-sm"
  >
                  Enroll Beneficiary
                </button>
              </div>
            </form>
          </div>
        </div>}
    </div>;
};
export {
  CharityDashboard
};