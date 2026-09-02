import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  authApi,
  getAccessToken,
  getStoredUser,
  setSession,
  clearSession,
} from "../../lib/api";

// ---------------------------------------------------------------------------
// Thunks — every one of these talks to the real Flask API. No mock users,
// no fabricated tokens.
// ---------------------------------------------------------------------------
export const registerUser = createAsyncThunk(
  "auth/register",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await authApi.register(payload);
      // Set the token first so the follow-up /auth/me call is authenticated.
      setSession({ accessToken: data.access_token, refreshToken: data.refresh_token });
      // The register/login response omits charity_id/donor_id (only /auth/me
      // returns the "detailed" profile) — fetch it immediately so charity
      // and donor dashboards have what they need without a page refresh.
      const detailedUser = await authApi.me().catch(() => data.user);
      setSession({ user: detailedUser });
      return detailedUser;
    } catch (err) {
      return rejectWithValue(err.message || "Registration failed");
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await authApi.login(payload);
      setSession({ accessToken: data.access_token, refreshToken: data.refresh_token });
      const detailedUser = await authApi.me().catch(() => data.user);
      setSession({ user: detailedUser });
      return detailedUser;
    } catch (err) {
      return rejectWithValue(err.message || "Invalid email or password");
    }
  }
);

// Re-hydrates the authenticated user's profile on app load if a token is
// already stored (survives a page refresh).
export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const user = await authApi.me();
      setSession({ user });
      return user;
    } catch (err) {
      return rejectWithValue(err.message || "Session expired");
    }
  }
);

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  try {
    if (getAccessToken()) {
      await authApi.logout();
    }
  } catch {
    // Best-effort — clear the local session regardless of API result.
  }
  clearSession();
});

const initialState = {
  user: getStoredUser(),
  isAuthenticated: !!getAccessToken(),
  loading: false,
  error: null,
  isRoleSelectOpen: false,
  isAuthModalOpen: false,
  authMode: "login",
  selectedRoleForAuth: "donor",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    openRoleSelect: (state) => {
      state.isRoleSelectOpen = true;
    },
    closeRoleSelect: (state) => {
      state.isRoleSelectOpen = false;
    },
    setAuthMode: (state, action) => {
      state.authMode = action.payload;
    },
    openAuthModal: (state, action) => {
      state.isRoleSelectOpen = false;
      state.isAuthModalOpen = true;
      state.authMode = action.payload.mode;
      const targetRole = action.payload.defaultRole || action.payload.role;
      if (targetRole) {
        state.selectedRoleForAuth = targetRole;
      }
    },
    closeAuthModal: (state) => {
      state.isAuthModalOpen = false;
      state.error = null;
    },
    clearAuthError: (state) => {
      state.error = null;
    },
    // Used by the API client when a refresh attempt fails so the redux
    // state stays in sync with the (already-cleared) local session.
    sessionExpired: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isAuthModalOpen = false;
        state.isRoleSelectOpen = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isAuthModalOpen = false;
        state.isRoleSelectOpen = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      });
  },
});

export const {
  openRoleSelect,
  closeRoleSelect,
  setAuthMode,
  openAuthModal,
  closeAuthModal,
  clearAuthError,
  sessionExpired,
} = authSlice.actions;

export default authSlice.reducer;
