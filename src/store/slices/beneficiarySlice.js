import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { beneficiariesApi, inventoryApi } from "../../lib/api";

// ---------------------------------------------------------------------------
// Thunks
//
// NOTE on field shapes: the backend's `beneficiaries` table only stores
// full_name, age, gender, location, description, photo_url — it has no
// columns for school_name, grade_level, kits_received, attendance_rate,
// grade_progression, or per-beneficiary "story" text the way the old
// mock data did. Those richer fields would need new columns/tables on
// the backend to be persisted for real; for now `description` is used
// as a free-text field that can hold whatever narrative a charity wants
// to record, and kit counts should be read from the real inventory
// distribution log (fetchDistributionsForBeneficiary) rather than a
// fabricated `kits_received` counter.
// ---------------------------------------------------------------------------

export const fetchBeneficiaries = createAsyncThunk(
  "beneficiary/fetchAll",
  async (params, { rejectWithValue }) => {
    try {
      return await beneficiariesApi.list(params);
    } catch (err) {
      return rejectWithValue(err.message || "Failed to load beneficiaries");
    }
  }
);

export const createBeneficiary = createAsyncThunk(
  "beneficiary/create",
  async (payload, { rejectWithValue }) => {
    try {
      return await beneficiariesApi.create(payload);
    } catch (err) {
      return rejectWithValue(err.message || "Failed to add beneficiary");
    }
  }
);

export const updateBeneficiary = createAsyncThunk(
  "beneficiary/update",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      return await beneficiariesApi.update(id, payload);
    } catch (err) {
      return rejectWithValue(err.message || "Failed to update beneficiary");
    }
  }
);

export const deleteBeneficiary = createAsyncThunk(
  "beneficiary/delete",
  async (id, { rejectWithValue }) => {
    try {
      await beneficiariesApi.remove(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to delete beneficiary");
    }
  }
);

// Records a real inventory distribution (decrements stock, logs the
// beneficiary who received it) instead of just bumping a local counter.
export const distributeKitToBeneficiary = createAsyncThunk(
  "beneficiary/distributeKit",
  async ({ inventoryItemId, beneficiaryId, quantity = 1, notes }, { rejectWithValue }) => {
    try {
      const distribution = await inventoryApi.distribute(inventoryItemId, {
        beneficiary_id: beneficiaryId,
        quantity,
        notes,
      });
      return { beneficiaryId, distribution };
    } catch (err) {
      return rejectWithValue(err.message || "Failed to record distribution");
    }
  }
);

const initialState = {
  beneficiaries: [],
  pagination: null,
  selectedBeneficiary: null,
  isAddModalOpen: false,
  filterStatus: "all",
  searchQuery: "",
  loading: false,
  error: null,
  // Offline queueing is a real UX concern for field workers with patchy
  // connectivity, but there is no backend sync endpoint for it yet — this
  // stays a local-only staging area until such an endpoint exists.
  isOfflineMode: false,
  offlineQueue: [],
};

const beneficiarySlice = createSlice({
  name: "beneficiary",
  initialState,
  reducers: {
    openAddBeneficiaryModal: (state) => {
      state.isAddModalOpen = true;
    },
    closeAddBeneficiaryModal: (state) => {
      state.isAddModalOpen = false;
    },
    setBeneficiaryFilterStatus: (state, action) => {
      state.filterStatus = action.payload;
    },
    setBeneficiarySearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    toggleOfflineMode: (state) => {
      state.isOfflineMode = !state.isOfflineMode;
    },
    setOfflineMode: (state, action) => {
      state.isOfflineMode = action.payload;
    },
    queueOfflineBeneficiary: (state, action) => {
      state.offlineQueue.push({
        id: `queue_${Date.now()}`,
        type: "add_beneficiary",
        data: action.payload,
        timestamp: new Date().toISOString(),
        status: "pending",
      });
      state.beneficiaries.unshift({ ...action.payload, is_offline_synced: false });
      state.isAddModalOpen = false;
    },
    clearOfflineQueue: (state) => {
      state.beneficiaries.forEach((b) => {
        b.is_offline_synced = true;
      });
      state.offlineQueue = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBeneficiaries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBeneficiaries.fulfilled, (state, action) => {
        state.loading = false;
        state.beneficiaries = (action.payload.items || []).map((b) => ({
          ...b,
          is_offline_synced: true,
        }));
        state.pagination = action.payload.pagination || null;
      })
      .addCase(fetchBeneficiaries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createBeneficiary.fulfilled, (state, action) => {
        state.beneficiaries.unshift({ ...action.payload, is_offline_synced: true });
        state.isAddModalOpen = false;
      })
      .addCase(updateBeneficiary.fulfilled, (state, action) => {
        const idx = state.beneficiaries.findIndex((b) => b.id === action.payload.id);
        if (idx !== -1) state.beneficiaries[idx] = { ...state.beneficiaries[idx], ...action.payload };
      })
      .addCase(deleteBeneficiary.fulfilled, (state, action) => {
        state.beneficiaries = state.beneficiaries.filter((b) => b.id !== action.payload);
      })
      .addCase(distributeKitToBeneficiary.fulfilled, (state, action) => {
        const ben = state.beneficiaries.find((b) => b.id === action.payload.beneficiaryId);
        if (ben) {
          ben.last_distribution = action.payload.distribution;
        }
      });
  },
});

export const {
  openAddBeneficiaryModal,
  closeAddBeneficiaryModal,
  setBeneficiaryFilterStatus,
  setBeneficiarySearchQuery,
  toggleOfflineMode,
  setOfflineMode,
  queueOfflineBeneficiary,
  clearOfflineQueue,
} = beneficiarySlice.actions;

export default beneficiarySlice.reducer;
