import { useState, useEffect } from "react";
import {
  Users,
  PlusCircle,
  Package,
  Search,
  Trash2,
  Heart,
  BookOpen,
  AlertCircle
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store";
import {
  fetchBeneficiaries,
  createBeneficiary,
  deleteBeneficiary,
  setBeneficiarySearchQuery,
  openAddBeneficiaryModal,
  closeAddBeneficiaryModal
} from "../store/slices/beneficiarySlice";
import { fetchCharityById, fetchCharityStats } from "../store/slices/charitySlice";
import { fetchDonationsForCharity } from "../store/slices/donationSlice";
import { storiesApi, inventoryApi } from "../lib/api";
import { useToast } from "./ToastContext";

// NOTE: the backend's `beneficiaries` table only has full_name, age, gender,
// location, description, photo_url — there's no school_name/grade_level/
// kits_received/attendance_rate the earlier mock UI displayed. Those would
// need new columns to track for real. Similarly, "kits distributed" and
// "fund target" aren't aggregate fields the API exposes, so they've been
// replaced with what charities/:id/stats and /inventory actually return.
const CharityDashboard = () => {
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const { beneficiaries, isAddModalOpen, searchQuery, loading: beneficiariesLoading } =
    useAppSelector((state) => state.beneficiary);
  const { user } = useAppSelector((state) => state.auth);
  const { selectedCharity: charity, charityStats } = useAppSelector((state) => state.charity);
  const { charityDonations } = useAppSelector((state) => state.donation);

  const [activeTab, setActiveTab] = useState("roster");
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("14");
  const [gender, setGender] = useState("female");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  const [inventoryItems, setInventoryItems] = useState([]);
  const [newItemName, setNewItemName] = useState("");
  const [newItemQty, setNewItemQty] = useState("");

  const [stories, setStories] = useState([]);
  const [storyTitle, setStoryTitle] = useState("");
  const [storyContent, setStoryContent] = useState("");

  const charityId = user?.charity_id;

  useEffect(() => {
    if (!charityId) return;
    dispatch(fetchCharityById(charityId));
    dispatch(fetchCharityStats(charityId));
    dispatch(fetchBeneficiaries({ charity_id: charityId }));
    dispatch(fetchDonationsForCharity({ charityId }));
    inventoryApi.list({ charity_id: charityId }).then(setInventoryItems).catch(() => {});
    storiesApi.list({ charity_id: charityId }).then((r) => setStories(r.items || [])).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [charityId]);

  const filteredBeneficiaries = beneficiaries.filter(
    (b) => !searchQuery || b.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddBeneficiary = async (e) => {
    e.preventDefault();
    if (!fullName) return;
    const result = await dispatch(
      createBeneficiary({
        charity_id: charityId,
        full_name: fullName,
        age: parseInt(age) || undefined,
        gender,
        location: location || undefined,
        description: description || undefined,
      })
    );
    if (result.meta.requestStatus === "fulfilled") {
      showToast(`Enrolled ${fullName} into the beneficiary roster`);
      setFullName("");
      setLocation("");
      setDescription("");
    } else {
      showToast(result.payload || "Could not add beneficiary", "error");
    }
  };

  const handleAddInventoryItem = async (e) => {
    e.preventDefault();
    if (!newItemName || !newItemQty) return;
    try {
      const item = await inventoryApi.create({
        charity_id: charityId,
        item_name: newItemName,
        category: "dignity_kit",
        unit: "units",
        quantity_available: parseInt(newItemQty),
      });
      setInventoryItems((prev) => [item, ...prev]);
      setNewItemName("");
      setNewItemQty("");
      showToast("Inventory item added");
    } catch (err) {
      showToast(err.message || "Could not add inventory item", "error");
    }
  };

  const handleDistribute = async (itemId, beneficiaryId, beneficiaryName) => {
    try {
      await inventoryApi.distribute(itemId, { beneficiary_id: beneficiaryId, quantity: 1 });
      const refreshed = await inventoryApi.list({ charity_id: charityId });
      setInventoryItems(refreshed);
      showToast(`Logged a distribution to ${beneficiaryName}`);
    } catch (err) {
      showToast(err.message || "Could not log distribution", "error");
    }
  };

  const handleAddStory = async (e) => {
    e.preventDefault();
    if (!storyTitle || !storyContent) return;
    try {
      const story = await storiesApi.create({
        charity_id: charityId,
        title: storyTitle,
        content: storyContent,
      });
      setStories((prev) => [story, ...prev]);
      setStoryTitle("");
      setStoryContent("");
      showToast("Story published");
    } catch (err) {
      showToast(err.message || "Could not publish story", "error");
    }
  };

  const handleExportCSV = () => {
    const headers = ["ID", "Full Name", "Age", "Gender", "Location", "Description"];
    const rows = filteredBeneficiaries.map((b) => [
      b.id,
      `"${b.full_name}"`,
      b.age ?? "",
      b.gender ?? "",
      `"${b.location || ""}"`,
      `"${(b.description || "").replace(/"/g, "'")}"`,
    ]);
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Beneficiaries_Roster_${(charity?.name || "charity").replace(/\s+/g, "_")}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast("Beneficiary roster CSV exported!");
  };

  if (!charityId) {
    return (
      <div className="py-16 max-w-2xl mx-auto px-4 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">No charity linked to this account yet</h2>
        <p className="text-sm text-slate-600">
          Your charity account isn't linked to an approved organization yet. Submit an
          application from the Charities page, and this dashboard will unlock once an
          administrator approves it.
        </p>
      </div>
    );
  }

  return <div className="py-10 bg-slate-50 min-h-[calc(100vh-80px)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-900 text-xs font-bold uppercase tracking-wider mb-2">
              <span>{charity?.status === "active" ? "Accredited Partner" : charity?.status || "Loading…"}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif">
              {charity?.name || "Your Charity"}
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              {charity?.mission_statement}
            </p>
            {charity?.address && (
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-3 font-medium">
                <span>📍 {charity.address}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto shrink-0">
            <button
              onClick={() => dispatch(openAddBeneficiaryModal())}
              className="px-5 py-2.5 bg-purple-900 hover:bg-purple-800 text-white rounded-2xl text-xs font-bold shadow-sm inline-flex items-center gap-2 transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Enroll Beneficiary</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Beneficiaries</span>
              <Users className="w-4 h-4 text-purple-900" />
            </div>
            <span className="text-3xl font-bold text-purple-950 font-serif">
              {beneficiaries.length}
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Total Raised</span>
              <Heart className="w-4 h-4 text-purple-900" />
            </div>
            <span className="text-3xl font-bold text-purple-950 font-serif">
              Ksh {Number(charityStats?.total_raised ?? 0).toLocaleString()}
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Donations</span>
              <Package className="w-4 h-4 text-purple-900" />
            </div>
            <span className="text-3xl font-bold text-emerald-600 font-serif">
              {charityStats?.total_donations ?? 0}
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Unique Donors</span>
              <Users className="w-4 h-4 text-purple-900" />
            </div>
            <span className="text-3xl font-bold text-purple-950 font-serif">
              {charityStats?.unique_donors ?? 0}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab("roster")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors shrink-0 ${activeTab === "roster" ? "bg-purple-900 text-white" : "text-slate-600 hover:bg-slate-100"}`}
          >
            Beneficiary Roster ({filteredBeneficiaries.length})
          </button>
          <button
            onClick={() => setActiveTab("inventory")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors shrink-0 flex items-center gap-1.5 ${activeTab === "inventory" ? "bg-purple-900 text-white" : "text-slate-600 hover:bg-slate-100"}`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Inventory ({inventoryItems.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("donations")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors shrink-0 flex items-center gap-1.5 ${activeTab === "donations" ? "bg-purple-900 text-white" : "text-slate-600 hover:bg-slate-100"}`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Direct Donations ({charityDonations.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("stories")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors shrink-0 flex items-center gap-1.5 ${activeTab === "stories" ? "bg-purple-900 text-white" : "text-slate-600 hover:bg-slate-100"}`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Stories ({stories.length})</span>
          </button>
        </div>

        {activeTab === "roster" && <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 font-serif">Beneficiary Roster</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manage the girls your organization supports.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by name..."
                    value={searchQuery ?? ""}
                    onChange={(e) => dispatch(setBeneficiarySearchQuery(e.target.value))}
                    className="pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-700 focus:outline-none w-56"
                  />
                </div>
                <button
                  onClick={handleExportCSV}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                >
                  Export CSV
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              {beneficiariesLoading ? (
                <div className="p-12 text-center text-slate-500 text-sm">Loading…</div>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="p-4 pl-6">Name & Age</th>
                      <th className="p-4">Gender</th>
                      <th className="p-4">Location</th>
                      <th className="p-4">Notes</th>
                      <th className="p-4 pr-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filteredBeneficiaries.map((ben) => <tr key={ben.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-4 pl-6">
                          <p className="font-bold text-slate-900 text-sm">{ben.full_name}</p>
                          <p className="text-[11px] text-slate-500">{ben.age ? `${ben.age} years old` : "—"}</p>
                        </td>
                        <td className="p-4 capitalize text-slate-700">{ben.gender || "—"}</td>
                        <td className="p-4 text-slate-700">{ben.location || "—"}</td>
                        <td className="p-4 text-slate-600 max-w-xs truncate">{ben.description || "—"}</td>
                        <td className="p-4 pr-6 text-right">
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
                        </td>
                      </tr>)}
                  </tbody>
                </table>
              )}
            </div>
          </div>}

        {activeTab === "inventory" && <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-xl font-bold text-slate-900 font-serif">Dignity Kit Inventory</h3>

            <form onSubmit={handleAddInventoryItem} className="flex flex-wrap items-end gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">Item name</label>
                <input
                  type="text"
                  placeholder="e.g. Reusable pad kit"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl w-56"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">Quantity</label>
                <input
                  type="number"
                  min={1}
                  placeholder="100"
                  value={newItemQty}
                  onChange={(e) => setNewItemQty(e.target.value)}
                  className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl w-28"
                />
              </div>
              <button type="submit" className="px-4 py-2 bg-purple-900 text-white text-xs font-bold rounded-xl">
                Add Item
              </button>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {inventoryItems.map((item) => (
                <div key={item.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900 text-sm">{item.item_name}</span>
                    <span className="text-xs font-bold text-purple-900">
                      {item.quantity_available} {item.unit} in stock
                    </span>
                  </div>
                  <select
                    onChange={(e) => {
                      const ben = beneficiaries.find((b) => b.id === Number(e.target.value));
                      if (ben) handleDistribute(item.id, ben.id, ben.full_name);
                      e.target.value = "";
                    }}
                    defaultValue=""
                    className="w-full text-xs px-2 py-1.5 rounded-lg border border-slate-200"
                  >
                    <option value="" disabled>
                      Log a distribution to…
                    </option>
                    {beneficiaries.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.full_name}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
              {inventoryItems.length === 0 && (
                <p className="text-sm text-slate-500 col-span-2 text-center py-6">
                  No inventory items yet — add your first one above.
                </p>
              )}
            </div>
          </div>}

        {activeTab === "donations" && <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-xl font-bold text-slate-900 font-serif">
              Direct Contributions Received
            </h3>
            {charityDonations.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8">No donations recorded yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Donor</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Channel</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {charityDonations.map((d) => <tr key={d.id}>
                        <td className="py-3.5 px-4 text-slate-600 font-mono">
                          {d.donated_at ? new Date(d.donated_at).toLocaleDateString() : "—"}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          {d.donor_id === null ? "Anonymous Supporter" : `Donor #${d.donor_id}`}
                        </td>
                        <td className="py-3.5 px-4 font-extrabold text-purple-950 text-sm">
                          {d.currency} {Number(d.amount).toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 uppercase font-bold text-slate-600">
                          {d.payment_provider}
                        </td>
                        <td className="py-3.5 px-4 capitalize text-slate-600">{d.payment_status}</td>
                      </tr>)}
                  </tbody>
                </table>
              </div>
            )}
          </div>}

        {activeTab === "stories" && <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-lg font-bold text-slate-900 font-serif">Publish a Story</h3>
              <form onSubmit={handleAddStory} className="space-y-2">
                <input
                  type="text"
                  placeholder="Title"
                  value={storyTitle}
                  onChange={(e) => setStoryTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
                <textarea
                  rows={3}
                  placeholder="Tell the story..."
                  value={storyContent}
                  onChange={(e) => setStoryContent(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
                <button type="submit" className="px-4 py-2 bg-purple-900 text-white text-xs font-bold rounded-xl">
                  Publish
                </button>
              </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stories.map((s) => (
                <div key={s.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-2">
                  <h4 className="text-base font-bold text-slate-900 font-serif">{s.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{s.content}</p>
                </div>
              ))}
              {stories.length === 0 && (
                <p className="text-sm text-slate-500 col-span-3 text-center py-6">
                  No stories published yet.
                </p>
              )}
            </div>
          </div>}
      </div>

      {isAddModalOpen && <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
      >
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8 space-y-4">
            <h3 className="text-xl font-bold text-slate-900 font-serif">Enroll New Beneficiary</h3>
            <form onSubmit={handleAddBeneficiary} className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cynthia Moraa"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Age</label>
                  <input
                    type="number"
                    min={5}
                    max={25}
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Location</label>
                <input
                  type="text"
                  placeholder="e.g. Kilifi Township"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Notes</label>
                <textarea
                  rows={2}
                  placeholder="Any relevant notes..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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

export { CharityDashboard };
