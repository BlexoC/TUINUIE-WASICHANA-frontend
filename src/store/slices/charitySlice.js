import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { charitiesApi } from "../../lib/api";

// ---------------------------------------------------------------------------
// Thunks — real data from the Flask API. No seeded/mock charities.
// ---------------------------------------------------------------------------
export const fetchCharities = createAsyncThunk(
  "charity/fetchCharities",
  async ({ search, page = 1, perPage = 6 } = {}, { rejectWithValue }) => {
    try {
      const result = await charitiesApi.list({ search, page, per_page: perPage });
      return result; // { items, pagination }
    } catch (err) {
      return rejectWithValue(err.message || "Failed to load charities");
    }
  }
);

export const fetchCharityById = createAsyncThunk(
  "charity/fetchCharityById",
  async (id, { rejectWithValue }) => {
    try {
      return await charitiesApi.get(id);
    } catch (err) {
      return rejectWithValue(err.message || "Failed to load charity");
    }
  }
);

export const fetchCharityStats = createAsyncThunk(
  "charity/fetchCharityStats",
  async (id, { rejectWithValue }) => {
    try {
      return await charitiesApi.stats(id);
    } catch (err) {
      return rejectWithValue(err.message || "Failed to load charity stats");
    }
  }
);

export const updateCharity = createAsyncThunk(
  "charity/updateCharity",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      return await charitiesApi.update(id, payload);
    } catch (err) {
      return rejectWithValue(err.message || "Failed to update charity");
    }
  }
);

// Submits a new charity application. The caller must already be
// authenticated with role "charity" (see server/api/routes/charities.py).
export const applyForCharity = createAsyncThunk(
  "charity/applyForCharity",
  async (payload, { rejectWithValue }) => {
    try {
      return await charitiesApi.apply(payload);
    } catch (err) {
      return rejectWithValue(err.message || "Failed to submit application");
    }
  }
);

const initialState = {
  charities: [],
  pagination: null,
  selectedCategory: "All",
  searchQuery: "",
  currentPage: 1,
  perPage: 6,
  total: 0,
  selectedCharity: null,
  charityStats: null,
  loading: false,
  error: null,
  applyStatus: "idle", // idle | loading | succeeded | failed
  applyError: null,

  // UI-only state below: these features (partner wizard, in-app charity
  // messaging, active crisis appeals, AI impact predictor, blockchain
  // ledger, corporate portal) have no matching tables in the backend
  // schema yet, so there is nothing to fetch — they start empty rather
  // than pre-seeded with fake records. See project notes for what a
  // real backend model for each would need.
  partnerWizardOpen: false,
  messages: [],
  isMessageModalOpen: false,
  activeMessageCharity: null,
  crisisCampaigns: [],
  isCrisisModalOpen: false,
  isAiPredictorModalOpen: false,
  isBlockchainModalOpen: false,
  isCorporateModalOpen: false,
};

const charitySlice = createSlice({
  name: "charity",
  initialState,
  reducers: {
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
      state.currentPage = 1;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.currentPage = 1;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    selectCharity: (state, action) => {
      state.selectedCharity = action.payload;
    },
    openPartnerWizard: (state) => {
      state.partnerWizardOpen = true;
      state.applyStatus = "idle";
      state.applyError = null;
    },
    closePartnerWizard: (state) => {
      state.partnerWizardOpen = false;
    },
    // Client-only preference — there is no favorites/follows table in the
    // backend, so this does not persist across sessions or devices.
    toggleFavorite: (state, action) => {
      const ch = state.charities.find((c) => c.id === action.payload);
      if (ch) ch.is_favorite = !ch.is_favorite;
    },
    toggleFollow: (state, action) => {
      const ch = state.charities.find((c) => c.id === action.payload);
      if (ch) ch.is_following = !ch.is_following;
    },
    openMessageModal: (state, action) => {
      state.activeMessageCharity = action.payload;
      state.isMessageModalOpen = true;
    },
    closeMessageModal: (state) => {
      state.isMessageModalOpen = false;
      state.activeMessageCharity = null;
    },
    // In-app charity messaging isn't backed by an API endpoint yet, so
    // this only affects the current session.
    sendCharityMessage: (state, action) => {
      state.messages.unshift(action.payload);
      state.isMessageModalOpen = false;
      state.activeMessageCharity = null;
    },
    replyCharityMessage: (state, action) => {
      const msg = state.messages.find((m) => m.id === action.payload.id);
      if (msg) {
        msg.reply = action.payload.reply;
        msg.replied_at = new Date().toISOString();
      }
    },
    openCrisisModal: (state) => {
      state.isCrisisModalOpen = true;
    },
    closeCrisisModal: (state) => {
      state.isCrisisModalOpen = false;
    },
    openAiPredictorModal: (state) => {
      state.isAiPredictorModalOpen = true;
    },
    closeAiPredictorModal: (state) => {
      state.isAiPredictorModalOpen = false;
    },
    openBlockchainModal: (state) => {
      state.isBlockchainModalOpen = true;
    },
    closeBlockchainModal: (state) => {
      state.isBlockchainModalOpen = false;
    },
    openCorporateModal: (state) => {
      state.isCorporateModalOpen = true;
    },
    closeCorporateModal: (state) => {
      state.isCorporateModalOpen = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCharities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCharities.fulfilled, (state, action) => {
        state.loading = false;
        state.charities = action.payload.items || [];
        state.pagination = action.payload.pagination || null;
        state.total = action.payload.pagination?.total ?? state.charities.length;
      })
      .addCase(fetchCharities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCharityById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCharityById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCharity = action.payload;
      })
      .addCase(fetchCharityById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCharityStats.fulfilled, (state, action) => {
        state.charityStats = action.payload;
      })
      .addCase(updateCharity.fulfilled, (state, action) => {
        state.selectedCharity = action.payload;
        const idx = state.charities.findIndex((c) => c.id === action.payload.id);
        if (idx !== -1) state.charities[idx] = { ...state.charities[idx], ...action.payload };
      })
      .addCase(applyForCharity.pending, (state) => {
        state.applyStatus = "loading";
        state.applyError = null;
      })
      .addCase(applyForCharity.fulfilled, (state) => {
        state.applyStatus = "succeeded";
        state.partnerWizardOpen = false;
      })
      .addCase(applyForCharity.rejected, (state, action) => {
        state.applyStatus = "failed";
        state.applyError = action.payload;
      });
  },
});

export const {
  setSelectedCategory,
  setSearchQuery,
  setCurrentPage,
  selectCharity,
  openPartnerWizard,
  closePartnerWizard,
  toggleFavorite,
  toggleFollow,
  openMessageModal,
  closeMessageModal,
  sendCharityMessage,
  replyCharityMessage,
  openCrisisModal,
  closeCrisisModal,
  openAiPredictorModal,
  closeAiPredictorModal,
  openBlockchainModal,
  closeBlockchainModal,
  openCorporateModal,
  closeCorporateModal,
} = charitySlice.actions;

export default charitySlice.reducer;
