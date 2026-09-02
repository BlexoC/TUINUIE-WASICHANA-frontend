import { useState, useEffect } from "react";
import {
  PlusCircle,
  Search,
  ArrowRight,
  Heart,
  ChevronLeft,
  ChevronRight,
  Share2,
  Sparkles
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store";
import {
  setSearchQuery,
  setCurrentPage,
  openPartnerWizard,
  fetchCharities
} from "../store/slices/charitySlice";
import { openDonationModal } from "../store/slices/donationSlice";
import { ShareModal } from "./ShareModal";

const CharitiesSection = () => {
  const dispatch = useAppDispatch();
  const { charities, searchQuery, currentPage, perPage, pagination, loading } = useAppSelector(
    (state) => state.charity
  );
  const [shareCharity, setShareCharity] = useState(null);

  // Debounced server-side search + pagination against the real API —
  // there's no client-side category filtering anymore since charities
  // have no category/tag column on the backend.
  useEffect(() => {
    const handle = setTimeout(() => {
      dispatch(fetchCharities({ search: searchQuery, page: currentPage, perPage }));
    }, 300);
    return () => clearTimeout(handle);
  }, [dispatch, searchQuery, currentPage, perPage]);

  const totalPages = pagination?.pages || 1;

  return <section id="charities-section" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

        <div className="flex flex-col md:flex-row md:items-center justify-end gap-4 mb-10 pb-6 border-b border-slate-100">
          <div className="relative min-w-70">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="charity-search-input"
              type="text"
              placeholder="Search charities by name or mission..."
              value={searchQuery ?? ""}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-700 focus:bg-white transition-all font-medium"
            />
          </div>
        </div>

        {loading && charities.length === 0 ? (
          <div className="text-center py-16 text-slate-500 text-sm">Loading charities…</div>
        ) : charities.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 rounded-3xl border border-slate-100 p-8">
            <Heart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-base font-semibold text-slate-700">
              No charities found matching your query.
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Try adjusting your search, or register a new charity.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {charities.map((charity) => (
              <div
                key={charity.id}
                id={`charity-card-${charity.id}`}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group"
              >
                <div className="relative aspect-video bg-slate-100 overflow-hidden">
                  <img
                    src="/images/dignity_kits_1787607033508.jpg"
                    alt={charity.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <button
                    onClick={() => setShareCharity(charity)}
                    className="absolute top-3 left-3 p-2 rounded-full bg-white/90 text-slate-700 hover:bg-white hover:text-purple-900 shadow-sm transition-colors"
                    title="Share campaign"
                    aria-label="Share campaign"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 font-serif leading-snug mb-2 group-hover:text-purple-900 transition-colors">
                      {charity.name}
                    </h3>

                    <p className="text-slate-600 text-xs line-clamp-3 leading-relaxed">
                      {charity.mission_statement || charity.description}
                    </p>

                    {charity.address && (
                      <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-3 border-t border-slate-100 mt-3 font-medium">
                        <span>📍 {charity.address.split(",")[0]}</span>
                      </div>
                    )}
                  </div>

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
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-between border-t border-slate-100 pt-6">
            <p className="text-xs text-slate-500">
              Page <span className="font-bold text-slate-800">{currentPage}</span> of{" "}
              <span className="font-bold text-slate-800">{totalPages}</span> ·{" "}
              <span className="font-bold text-slate-800">{pagination?.total ?? 0}</span> charities
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
          </div>
        )}
      </div>

      <ShareModal
        charity={shareCharity}
        isOpen={Boolean(shareCharity)}
        onClose={() => setShareCharity(null)}
      />
    </section>;
};

export { CharitiesSection };
