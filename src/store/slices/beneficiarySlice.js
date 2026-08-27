import { createSlice } from "@reduxjs/toolkit";
const initialBeneficiaries = [
  {
    id: "ben_001",
    charity_id: "ch_heshima",
    full_name: "Faith Chebet",
    age: 14,
    school_name: "Moi Forces Academy Primary",
    grade_level: "Grade 8",
    kits_received: 6,
    attendance_rate: 98,
    previous_attendance_rate: 74,
    grade_progression: "Math: C+ -> A, Overall: Top 5%",
    story: "Faith aspires to become an aerospace engineer. Before receiving regular dignity kits, she missed an average of 4 school days every month. Her attendance is now nearly 100%.",
    status: "active",
    last_kit_date: "2024-07-20",
    created_at: "2023-11-15T09:00:00Z",
    is_offline_synced: true
  },
  {
    id: "ben_002",
    charity_id: "ch_heshima",
    full_name: "Amina Halima",
    age: 15,
    school_name: "Barani Secondary School",
    grade_level: "Form 1",
    kits_received: 8,
    attendance_rate: 96,
    previous_attendance_rate: 78,
    grade_progression: "Sciences: B- -> A, Top in class",
    story: "Amina was awarded top student in mathematics after having continuous school attendance throughout term 1 and term 2.",
    status: "active",
    last_kit_date: "2024-07-18",
    created_at: "2023-11-20T10:00:00Z",
    is_offline_synced: true
  },
  {
    id: "ben_003",
    charity_id: "ch_heshima",
    full_name: "Mercy Achieng",
    age: 16,
    school_name: "Lake View Girls High",
    grade_level: "Form 2",
    kits_received: 9,
    attendance_rate: 99,
    previous_attendance_rate: 80,
    grade_progression: "Physics & Chem: Distinction",
    story: "Mercy is the captain of the science club and leads peer mentorship on menstrual health for junior students.",
    status: "active",
    last_kit_date: "2024-07-15",
    created_at: "2023-12-01T11:00:00Z",
    is_offline_synced: true
  },
  {
    id: "ben_004",
    charity_id: "ch_emergency_kits",
    full_name: "Zawadi Mwende",
    age: 13,
    school_name: "Kilifi Township Primary",
    grade_level: "Grade 7",
    kits_received: 4,
    attendance_rate: 94,
    previous_attendance_rate: 70,
    grade_progression: "English: C -> B+",
    story: "Zawadi lives with her grandmother. Emergency dignity kit deliveries ensured she sat for her mid-term exams without stress.",
    status: "active",
    last_kit_date: "2024-06-30",
    created_at: "2024-01-20T08:30:00Z",
    is_offline_synced: true
  },
  {
    id: "ben_005",
    charity_id: "ch_heshima",
    full_name: "Esther Njeri",
    age: 17,
    school_name: "Nakuru Girls High",
    grade_level: "Form 4",
    kits_received: 14,
    attendance_rate: 100,
    previous_attendance_rate: 82,
    grade_progression: "KCSE Mean: A- (Pre-Med Admission)",
    story: "Graduated with honors and now enrolled in university pursuing Medicine. Continues to mentor young beneficiaries.",
    status: "graduated",
    last_kit_date: "2024-04-10",
    created_at: "2023-01-10T14:00:00Z",
    is_offline_synced: true
  }
];
const initialState = {
  beneficiaries: initialBeneficiaries,
  selectedBeneficiary: null,
  isAddModalOpen: false,
  filterStatus: "all",
  searchQuery: "",
  loading: false,
  isOfflineMode: false,
  offlineQueue: []
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
    addBeneficiary: (state, action) => {
      if (state.isOfflineMode) {
        const queueItem = {
          id: `queue_${Date.now()}`,
          type: "add_beneficiary",
          charity_id: action.payload.charity_id,
          data: action.payload,
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          status: "pending"
        };
        state.offlineQueue.push(queueItem);
        state.beneficiaries.unshift({
          ...action.payload,
          is_offline_synced: false
        });
      } else {
        state.beneficiaries.unshift({
          ...action.payload,
          is_offline_synced: true
        });
      }
      state.isAddModalOpen = false;
    },
    distributeKitToBeneficiary: (state, action) => {
      const ben = state.beneficiaries.find((b) => b.id === action.payload.id);
      if (ben) {
        ben.kits_received += 1;
        ben.last_kit_date = action.payload.kitDate;
        if (state.isOfflineMode) {
          state.offlineQueue.push({
            id: `queue_dist_${Date.now()}`,
            type: "distribute_kit",
            charity_id: ben.charity_id,
            data: { id: ben.id, kitDate: action.payload.kitDate },
            timestamp: (/* @__PURE__ */ new Date()).toISOString(),
            status: "pending"
          });
          ben.is_offline_synced = false;
        }
      }
    },
    syncOfflineQueue: (state) => {
      state.beneficiaries.forEach((b) => {
        b.is_offline_synced = true;
      });
      state.offlineQueue = [];
    },
    updateBeneficiaryAttendance: (state, action) => {
      const ben = state.beneficiaries.find((b) => b.id === action.payload.id);
      if (ben) {
        ben.attendance_rate = action.payload.attendance;
      }
    },
    deleteBeneficiary: (state, action) => {
      state.beneficiaries = state.beneficiaries.filter(
        (b) => b.id !== action.payload
      );
    }
  }
});
const {
  openAddBeneficiaryModal,
  closeAddBeneficiaryModal,
  setBeneficiaryFilterStatus,
  setBeneficiarySearchQuery,
  toggleOfflineMode,
  setOfflineMode,
  addBeneficiary,
  distributeKitToBeneficiary,
  syncOfflineQueue,
  updateBeneficiaryAttendance,
  deleteBeneficiary
} = beneficiarySlice.actions;
var stdin_default = beneficiarySlice.reducer;
export {
  addBeneficiary,
  closeAddBeneficiaryModal,
  stdin_default as default,
  deleteBeneficiary,
  distributeKitToBeneficiary,
  openAddBeneficiaryModal,
  setBeneficiaryFilterStatus,
  setBeneficiarySearchQuery,
  setOfflineMode,
  syncOfflineQueue,
  toggleOfflineMode,
  updateBeneficiaryAttendance
};
