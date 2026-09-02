import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { adminApi } from "../../lib/api";

// ---------------------------------------------------------------------------
// Thunks — all real /api/admin/* calls. Requires the logged-in user to have
// role "admin" (enforced server-side by @require_role("admin")).
// ---------------------------------------------------------------------------
export const fetchDashboardStats = createAsyncThunk(
  "admin/fetchDashboardStats",
  async (_, { rejectWithValue }) => {
    try {
      return await adminApi.dashboard();
    } catch (err) {
      return rejectWithValue(err.message || "Failed to load dashboard stats");
    }
  }
);

export const fetchApplications = createAsyncThunk(
  "admin/fetchApplications",
  async (params, { rejectWithValue }) => {
    try {
      return await adminApi.listApplications(params);
    } catch (err) {
      return rejectWithValue(err.message || "Failed to load applications");
    }
  }
);

export const fetchApplicationDetail = createAsyncThunk(
  "admin/fetchApplicationDetail",
  async (id, { rejectWithValue }) => {
    try {
      return await adminApi.getApplication(id);
    } catch (err) {
      return rejectWithValue(err.message || "Failed to load application");
    }
  }
);

export const approveApplication = createAsyncThunk(
  "admin/approveApplication",
  async (id, { rejectWithValue }) => {
    try {
      const result = await adminApi.approveApplication(id);
      return { id, result };
    } catch (err) {
      return rejectWithValue(err.message || "Failed to approve application");
    }
  }
);

export const rejectApplication = createAsyncThunk(
  "admin/rejectApplication",
  async ({ id, rejection_reason }, { rejectWithValue }) => {
    try {
      await adminApi.rejectApplication(id, { rejection_reason });
      return id;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to reject application");
    }
  }
);

export const fetchUsers = createAsyncThunk(
  "admin/fetchUsers",
  async (params, { rejectWithValue }) => {
    try {
      return await adminApi.listUsers(params);
    } catch (err) {
      return rejectWithValue(err.message || "Failed to load users");
    }
  }
);

export const deactivateUser = createAsyncThunk(
  "admin/deactivateUser",
  async (id, { rejectWithValue }) => {
    try {
      await adminApi.deactivateUser(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to deactivate user");
    }
  }
);

const initialState = {
  activeTab: "charities",
  // Real platform-wide counts from GET /api/admin/dashboard. Starts null
  // (not a set of made-up numbers) until fetched.
  stats: null,
  statsLoading: false,

  applications: [],
  applicationsPagination: null,
  applicationsLoading: false,
  selectedApplication: null,

  selectedCharityForReview: null,
  reviewNotes: "",
  isReviewModalOpen: false,

  users: [],
  usersPagination: null,
  usersLoading: false,

  // There is no audit-log table in the backend schema, so this can't be
  // fetched from anywhere real yet — left empty rather than faked.
  auditLogs: [],

  error: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setAdminActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    openCharityReviewModal: (state, action) => {
      state.selectedCharityForReview = action.payload;
      state.isReviewModalOpen = true;
      state.reviewNotes = "";
    },
    closeCharityReviewModal: (state) => {
      state.isReviewModalOpen = false;
      state.selectedCharityForReview = null;
    },
    setReviewNotes: (state, action) => {
      state.reviewNotes = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.statsLoading = true;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.stats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.statsLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchApplications.pending, (state) => {
        state.applicationsLoading = true;
      })
      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.applicationsLoading = false;
        state.applications = action.payload.items || [];
        state.applicationsPagination = action.payload.pagination || null;
      })
      .addCase(fetchApplications.rejected, (state, action) => {
        state.applicationsLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchApplicationDetail.fulfilled, (state, action) => {
        state.selectedApplication = action.payload;
      })
      .addCase(approveApplication.fulfilled, (state, action) => {
        state.applications = state.applications.filter((a) => a.id !== action.payload.id);
        state.isReviewModalOpen = false;
        state.selectedCharityForReview = null;
        if (state.stats) {
          state.stats.total_active_charities += 1;
          if (state.stats.pending_applications > 0) state.stats.pending_applications -= 1;
        }
      })
      .addCase(rejectApplication.fulfilled, (state, action) => {
        state.applications = state.applications.filter((a) => a.id !== action.payload);
        state.isReviewModalOpen = false;
        state.selectedCharityForReview = null;
        if (state.stats && state.stats.pending_applications > 0) {
          state.stats.pending_applications -= 1;
        }
      })
      .addCase(fetchUsers.pending, (state) => {
        state.usersLoading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.usersLoading = false;
        state.users = action.payload.items || [];
        state.usersPagination = action.payload.pagination || null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.usersLoading = false;
        state.error = action.payload;
      })
      .addCase(deactivateUser.fulfilled, (state, action) => {
        const user = state.users.find((u) => u.id === action.payload);
        if (user) user.is_active = false;
      });
  },
});

export const {
  setAdminActiveTab,
  openCharityReviewModal,
  closeCharityReviewModal,
  setReviewNotes,
} = adminSlice.actions;

export default adminSlice.reducer;
