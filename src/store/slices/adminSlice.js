import { createSlice } from "@reduxjs/toolkit";
const initialStats = {
  activeCharities: 150,
  donorsJoined: 12450,
  schoolDaysSaved: 25e5,
  totalDonationsRaised: 489e5,
  pendingCharitiesCount: 3,
  totalBeneficiariesCount: 8940
};
const initialUsers = [
  {
    id: "usr_admin_1",
    username: "Zawadi Admin",
    email: "zawadi.admin@tuinuewasichana.or.ke",
    role: "admin",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    phone: "+254 700 000 001",
    status: "active",
    created_at: "2023-01-10T08:00:00Z"
  },
  {
    id: "usr_charity_heshima",
    username: "Mary Wanjiku (Coordinator)",
    email: "mary@heshimaproject.org",
    role: "charity",
    charity_id: "ch_heshima",
    avatar: "https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=150&auto=format&fit=crop&q=80",
    phone: "+254 723 987 654",
    status: "active",
    created_at: "2023-11-10T10:30:00Z"
  },
  {
    id: "usr_charity_grace",
    username: "Grace Muthoni (Lead)",
    email: "grace@emergencykits.or.ke",
    role: "charity",
    charity_id: "ch_emergency_kits",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    phone: "+254 712 345 678",
    status: "active",
    created_at: "2024-01-15T08:00:00Z"
  },
  {
    id: "usr_donor_demo",
    username: "Amina Kimani",
    email: "amina.kimani@example.org",
    role: "donor",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    phone: "+254 712 345 890",
    status: "active",
    created_at: "2024-02-01T14:20:00Z"
  },
  {
    id: "usr_donor_brian",
    username: "Brian Omondi",
    email: "brian.omondi@globalgiving.org",
    role: "donor",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    phone: "+254 733 908 112",
    status: "active",
    created_at: "2024-04-18T11:15:00Z"
  }
];
const initialAuditLogs = [
  {
    id: "log_001",
    actor_id: "usr_admin_1",
    actor_name: "Zawadi Admin",
    actor_role: "admin",
    action: "KYC Approved",
    target: "Heshima Project (CBO-2019/042)",
    timestamp: "10 mins ago",
    status: "success",
    details: "Verified NGO certificate and audited financials."
  },
  {
    id: "log_002",
    actor_id: "usr_donor_demo",
    actor_name: "Amina Kimani",
    actor_role: "donor",
    action: "M-Pesa STK Push Completed",
    target: "KES 2,500 to Heshima Project (QK982HX982)",
    timestamp: "2 hours ago",
    status: "info",
    details: "Payment processed via Safaricom Daraja API."
  },
  {
    id: "log_003",
    actor_id: "usr_charity_grace",
    actor_name: "Grace Muthoni",
    actor_role: "charity",
    action: "Beneficiary Enrolled",
    target: "Mercy Akinyi (Kilifi Primary, Grade 7)",
    timestamp: "5 hours ago",
    status: "success",
    details: "Supplied with 6-month reusable eco kit."
  },
  {
    id: "log_004",
    actor_id: "usr_admin_1",
    actor_name: "Zawadi Admin",
    actor_role: "admin",
    action: "Role Elevated",
    target: "Mary Wanjiku to Charity Coordinator",
    timestamp: "1 day ago",
    status: "warning",
    details: "Granted coordinator rights for Nakuru cluster."
  }
];
const initialState = {
  activeTab: "charities",
  stats: initialStats,
  selectedCharityForReview: null,
  reviewNotes: "",
  isReviewModalOpen: false,
  users: initialUsers,
  auditLogs: initialAuditLogs
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
    incrementApprovedCharityStat: (state) => {
      state.stats.activeCharities += 1;
      if (state.stats.pendingCharitiesCount > 0) {
        state.stats.pendingCharitiesCount -= 1;
      }
    },
    updateUserRole: (state, action) => {
      const user = state.users.find((u) => u.id === action.payload.userId);
      if (user) {
        const oldRole = user.role;
        user.role = action.payload.newRole;
        state.auditLogs.unshift({
          id: `log_${Date.now()}`,
          actor_id: "usr_admin_1",
          actor_name: "Zawadi Admin",
          actor_role: "admin",
          action: "User Role Changed",
          target: `${user.username} (${oldRole} -> ${action.payload.newRole})`,
          timestamp: "Just now",
          status: "warning",
          details: `Admin updated permissions for ${user.email}`
        });
      }
    },
    toggleUserStatus: (state, action) => {
      const user = state.users.find((u) => u.id === action.payload);
      if (user) {
        user.status = user.status === "active" ? "suspended" : "active";
        state.auditLogs.unshift({
          id: `log_${Date.now()}`,
          actor_id: "usr_admin_1",
          actor_name: "Zawadi Admin",
          actor_role: "admin",
          action: `User Account ${user.status === "active" ? "Reactivated" : "Suspended"}`,
          target: user.username,
          timestamp: "Just now",
          status: user.status === "active" ? "success" : "warning",
          details: `Status toggled to ${user.status}`
        });
      }
    },
    addAuditLog: (state, action) => {
      state.auditLogs.unshift(action.payload);
    }
  }
});
const {
  setAdminActiveTab,
  openCharityReviewModal,
  closeCharityReviewModal,
  setReviewNotes,
  incrementApprovedCharityStat,
  updateUserRole,
  toggleUserStatus,
  addAuditLog
} = adminSlice.actions;
var stdin_default = adminSlice.reducer;
export {
  addAuditLog,
  closeCharityReviewModal,
  stdin_default as default,
  incrementApprovedCharityStat,
  openCharityReviewModal,
  setAdminActiveTab,
  setReviewNotes,
  toggleUserStatus,
  updateUserRole
};
