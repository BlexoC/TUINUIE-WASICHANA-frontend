import { createSlice } from "@reduxjs/toolkit";
const initialSavedUser = (() => {
  try {
    const saved = localStorage.getItem("tw_user");
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
})();
const initialSavedToken = (() => {
  try {
    return localStorage.getItem("tw_token") || null;
  } catch {
    return null;
  }
})();
const initialState = {
  user: initialSavedUser || {
    id: "usr_donor_demo",
    username: "Amina Kimani",
    email: "amina.kimani@example.org",
    role: "donor",
    created_at: (/* @__PURE__ */ new Date()).toISOString()
  },
  isAuthenticated: true,
  token: initialSavedToken || "demo_jwt_token_donor",
  loading: false,
  error: null,
  isRoleSelectOpen: false,
  isAuthModalOpen: false,
  authMode: "login",
  selectedRoleForAuth: "donor"
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
    },
    setAuthLoading: (state, action) => {
      state.loading = action.payload;
    },
    setAuthError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
      state.isAuthModalOpen = false;
      state.isRoleSelectOpen = false;
      try {
        localStorage.setItem("tw_user", JSON.stringify(action.payload.user));
        localStorage.setItem("tw_token", action.payload.token);
      } catch (e) {
        console.error(e);
      }
    },
    switchRoleDirectly: (state, action) => {
      const role = action.payload;
      let mockUser;
      if (role === "admin") {
        mockUser = {
          id: "usr_admin_1",
          username: "Sarah Ochieng (Platform Admin)",
          email: "admin@tuinuewasichana.org",
          role: "admin",
          created_at: (/* @__PURE__ */ new Date()).toISOString()
        };
      } else if (role === "charity") {
        mockUser = {
          id: "usr_charity_heshima",
          username: "Mary Wanjiku (Heshima Coordinator)",
          email: "coordinator@heshimaproject.org",
          role: "charity",
          charity_id: "ch_heshima",
          created_at: (/* @__PURE__ */ new Date()).toISOString()
        };
      } else {
        mockUser = {
          id: "usr_donor_demo",
          username: "Amina Kimani",
          email: "amina.kimani@example.org",
          role: "donor",
          created_at: (/* @__PURE__ */ new Date()).toISOString()
        };
      }
      state.user = mockUser;
      state.isAuthenticated = true;
      state.token = `jwt_token_${role}_simulated`;
      state.isRoleSelectOpen = false;
      state.isAuthModalOpen = false;
      try {
        localStorage.setItem("tw_user", JSON.stringify(mockUser));
        localStorage.setItem("tw_token", state.token);
      } catch (e) {
        console.error(e);
      }
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.token = null;
      state.error = null;
      try {
        localStorage.removeItem("tw_user");
        localStorage.removeItem("tw_token");
      } catch (e) {
        console.error(e);
      }
    }
  }
});
const {
  openRoleSelect,
  closeRoleSelect,
  setAuthMode,
  openAuthModal,
  closeAuthModal,
  setAuthLoading,
  setAuthError,
  loginSuccess,
  switchRoleDirectly,
  logout
} = authSlice.actions;
var stdin_default = authSlice.reducer;
export {
  closeAuthModal,
  closeRoleSelect,
  stdin_default as default,
  loginSuccess,
  logout,
  openAuthModal,
  openRoleSelect,
  setAuthError,
  setAuthLoading,
  setAuthMode,
  switchRoleDirectly
};
