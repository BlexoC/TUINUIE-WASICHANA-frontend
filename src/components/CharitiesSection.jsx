import { useState } from "react";
import {
  PlusCircle,
  Search,
  ArrowRight,
  Heart,
  ChevronLeft,
  ChevronRight,
  Share2,
  Sparkles,
  Users
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store";
import {
  setSelectedCategory,
  setSearchQuery,
  setCurrentPage,
  openPartnerWizard
} from "../store/slices/charitySlice";
import { openDonationModal } from "../store/slices/donationSlice";
import { ShareModal } from "./ShareModal";
const CharitiesSection = () => {
  const dispatch = useAppDispatch();
  const {
    charities,
    selectedCategory,
    searchQuery,
    currentPage,
    perPage
  } = useAppSelector((state) => state.charity);
  const [shareCharity, setShareCharity] = useState(null);
  const categories = [
    "All",
    "Urgent Need",
    "Education",
    "Sanitation",
    "Sanitary Distribution"
  ];
  const approvedCharities = charities.filter(
    (c) => c.status === "approved" || c.status === void 0
  );
  const filteredCharities = approvedCharities.filter((charity) => {
    const matchesCategory = selectedCategory === "All" || charity.category?.toLowerCase() === selectedCategory.toLowerCase() || charity.tag?.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = !searchQuery || charity.name.toLowerCase().includes(searchQuery.toLowerCase()) || charity.mission_statement.toLowerCase().includes(searchQuery.toLowerCase()) || charity.address?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  const totalPages = Math.ceil(filteredCharities.length / perPage) || 1;
  const startIndex = (currentPage - 1) * perPage;
  const paginatedCharities = filteredCharities.slice(
    startIndex,
    startIndex + perPage
  );
  const getTagColor = (tag) => {
    switch (tag?.toLowerCase()) {
      case "urgent need":
        return "bg-rose-900 text-white";
      case "education":
        return "bg-indigo-900 text-white";
      case "sanitation":
        return "bg-emerald-900 text-white";
      case "sanitary distribution":
        return "bg-purple-950 text-white";
      default:
        return "bg-purple-900 text-white";
    }
  };
  return <section id="charities-section" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {
    /* Header & Add Charity CTA */
  }
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-900 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Verified Grassroots Partners</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-950 font-serif tracking-tight">
              Active Community Projects
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Every initiative is audited, registered, and equipped to deliver measurable menstrual dignity.
            </p>
          </div>

          <button
    id="btn-add-charity"
    onClick={() => dispatch(openPartnerWizard())}
    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-purple-900 hover:bg-purple-800 text-white text-xs font-bold rounded-2xl shadow-sm transition-all self-start sm:self-auto active:scale-95"
  >
            <PlusCircle className="w-4 h-4" />
            <span>Register a Charity</span>
          </button>
        </div>

        {
    /* Filters & Search Row */
  }
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-100">
          {
    /* Category Chips */
  }
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => <button
    key={cat}
    id={`cat-filter-${cat.toLowerCase().replace(/\s+/g, "-")}`}
    onClick={() => dispatch(setSelectedCategory(cat))}
    className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all ${selectedCategory === cat ? "bg-purple-900 text-white shadow-sm" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
  >
                {cat}
              </button>)}
          </div>

          {
    /* Search Input */
  }
          <div className="relative min-w-70">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
    id="charity-search-input"
    type="text"
    placeholder="Search projects or counties..."
    value={searchQuery ?? ""}
    onChange={(e) => dispatch(setSearchQuery(e.target.value))}
    className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-700 focus:bg-white transition-all font-medium"
  />
          </div>
        </div>

        {
    /* Charity Cards Grid */
  }
        {paginatedCharities.length === 0 ? <div className="text-center py-16 bg-slate-50 rounded-3xl border border-slate-100 p-8">
            <Heart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-base font-semibold text-slate-700">
              No charities found matching your query.
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Try adjusting your search criteria or register a new charity.
            </p>
          </div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedCharities.map((charity) => {
    const target = charity.target_amount || 5e5;
    const raised = charity.raised_amount || 0;
    const percent = Math.min(100, Math.round(raised / target * 100));
    return <div
      key={charity.id}
      id={`charity-card-${charity.id}`}
      className="bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group"
    >
                  {
      /* Card Image */
    }
                  <div className="relative aspect-video bg-slate-100 overflow-hidden">
                    <img
      src={charity.image_url || "/src/assets/images/dignity_kits_1787607033508.jpg"}
      alt={charity.name}
      referrerPolicy="no-referrer"
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
    />
                    {
      /* Tag badge in top right */
    }
                    <div
      className={`absolute top-3 right-3 px-3 py-1 rounded-full text-[11px] font-bold shadow-sm ${getTagColor(
        charity.tag || charity.category
      )}`}
    >
                      {charity.tag || charity.category}
                    </div>

                    {
      /* Share Button top left */
    }
                    <button
      onClick={() => setShareCharity(charity)}
      className="absolute top-3 left-3 p-2 rounded-full bg-white/90 text-slate-700 hover:bg-white hover:text-purple-900 shadow-sm transition-colors"
      title="Share campaign"
      aria-label="Share campaign"
    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {
      /* Card Body */
    }
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 font-serif leading-snug mb-2 group-hover:text-purple-900 transition-colors">
                        {charity.name}
                      </h3>

                      <p className="text-slate-600 text-xs line-clamp-3 leading-relaxed">
                        {charity.mission_statement || charity.what_they_do}
                      </p>

                      <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-3 border-t border-slate-100 mt-3 font-medium">
                        <span>📍 {charity.address?.split(",")[0]}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3 text-purple-700" />
                          <span>{charity.beneficiaries_count || 500}+ Girls</span>
                        </span>
                      </div>
                    </div>

                    <div>
                      {
      /* Funding Progress Bar */
    }
                      <div className="mb-4">
                        <div className="flex justify-between items-center text-xs font-medium mb-1.5">
                          <span className="text-purple-950 font-bold">
                            Ksh {raised.toLocaleString()} Raised
                          </span>
                          <span className="text-slate-500 font-bold">
                            {percent}%
                          </span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
      className="h-full bg-linear-to-r from-purple-900 to-purple-700 rounded-full transition-all duration-500"
      style={{ width: `${percent}%` }}
    />
                        </div>
                        <div className="flex justify-between items-center text-[11px] text-slate-400 mt-1">
                          <span>Target: Ksh {target.toLocaleString()}</span>
                          <span className="text-emerald-700 font-semibold">
                            Ksh {Math.max(0, target - raised).toLocaleString()} left
                          </span>
                        </div>
                      </div>

                      {
      /* Donate Now Button */
    }
                      <button
      id={`btn-donate-${charity.id}`}
      onClick={() => dispatch(openDonationModal({ charity }))}
      className="w-full py-3 px-4 bg-purple-900 hover:bg-purple-800 text-white text-xs font-bold rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 active:scale-98"
    >
                        <Heart className="w-3.5 h-3.5 fill-purple-300 text-purple-300" />
                        <span>Sponsor Dignity Kits</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                      </button>
                    </div>
                  </div>
                </div>;
  })}
          </div>}

        {
    /* Pagination Bar */
  }
        {totalPages > 1 && <div className="mt-12 flex items-center justify-between border-t border-slate-100 pt-6">
            <p className="text-xs text-slate-500">
              Showing <span className="font-bold text-slate-800">{startIndex + 1}</span> to{" "}
              <span className="font-bold text-slate-800">
                {Math.min(startIndex + perPage, filteredCharities.length)}
              </span>{" "}
              of <span className="font-bold text-slate-800">{filteredCharities.length}</span>{" "}
              charities
            </p>

            <div className="flex items-center gap-2">
              <button
    id="pagination-prev-btn"
    disabled={currentPage === 1}
    onClick={() => dispatch(setCurrentPage(currentPage - 1))}
    className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold flex items-center gap-1"
  >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Previous</span>
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => <button
    key={pageNum}
    onClick={() => dispatch(setCurrentPage(pageNum))}
    className={`w-8 h-8 rounded-xl text-xs font-bold transition-colors ${currentPage === pageNum ? "bg-purple-900 text-white" : "text-slate-600 hover:bg-slate-100"}`}
  >
                    {pageNum}
                  </button>)}
              </div>

              <button
    id="pagination-next-btn"
    disabled={currentPage === totalPages}
    onClick={() => dispatch(setCurrentPage(currentPage + 1))}
    className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold flex items-center gap-1"
  >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>}
      </div>

      {
    /* Campaign Share Modal */
  }
      <ShareModal
    charity={shareCharity}
    isOpen={Boolean(shareCharity)}
    onClose={() => setShareCharity(null)}
  />
    </section>;
};
export {
  CharitiesSection
};
