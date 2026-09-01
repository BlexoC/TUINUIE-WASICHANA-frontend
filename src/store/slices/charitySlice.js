import { createSlice } from "@reduxjs/toolkit";
const initialCrisisCampaigns = [
  {
    id: "crisis_samburu_drought",
    title: "Samburu & Turkana Acute Drought Hygiene Relief",
    county: "Samburu & Turkana",
    urgency: "critical",
    description: "Severe prolonged drought has dried up community boreholes and disrupted schools. Over 3,500 pastoralist schoolgirls urgently require emergency sanitary kits, antiseptic wipes, and water purification tablets to remain in school.",
    target_kits: 5e3,
    delivered_kits: 3120,
    target_amount: 15e5,
    raised_amount: 118e4,
    matching_partner: "Equity Group Foundation CSR Pool",
    matching_multiplier: 2,
    is_active: true
  },
  {
    id: "crisis_tana_floods",
    title: "Tana River Basin School Flood Recovery WASH Kits",
    county: "Tana River & Kilifi",
    urgency: "high",
    description: "Flash flooding displaced 14 primary schools. Immediate delivery of sealed reusable dignity packs to temporary learning shelters.",
    target_kits: 2500,
    delivered_kits: 1400,
    target_amount: 75e4,
    raised_amount: 49e4,
    matching_partner: "Safaricom Foundation Ndoto Zetu",
    matching_multiplier: 2,
    is_active: true
  }
];
const initialMessages = [
  {
    id: "msg_001",
    charity_id: "ch_heshima",
    charity_name: "Heshima Project",
    sender_name: "Amina Kimani",
    sender_email: "amina.kimani@example.org",
    sender_role: "donor",
    subject: "Term 3 Distribution Schedule & Kit Longevity",
    message: "Hello Mary, thank you for the wonderful updates on Faith Chebet. Could you share when the next distribution run to Nakuru East will take place?",
    reply: "Hi Amina! We have scheduled deliveries for Sept 18th. We will send photos and updated attendance logs right here.",
    replied_at: "2026-08-20T14:30:00Z",
    created_at: "2026-08-19T09:15:00Z"
  }
];
const initialCharities = [
  {
    id: "ch_emergency_kits",
    name: "Emergency Dignity Kits Distribution",
    year_established: "2021",
    org_type: "Community Based Organization",
    mission_statement: "Providing comprehensive menstrual hygiene kits, including reusable sanitary towels, soap, and essential underwear to keep vulnerable schoolgirls in class.",
    address: "Kilifi South County, Coast Region, Kenya",
    email: "help@emergencykits.or.ke",
    phone: "+254 712 345 678",
    website: "https://emergencykits.or.ke",
    contact_person: "Grace Muthoni",
    status: "approved",
    category: "Urgent Need",
    tag: "Urgent Need",
    target_amount: 5e5,
    raised_amount: 25e4,
    currency: "KES",
    image_url: "/images/dignity_kits_1787607033508.jpg",
    what_they_do: "Distributes sealed dignity packs with reusable eco-friendly pads, antimicrobial underwear, soap, and informative booklets to schools before each term begins.",
    how_it_started: "Started by community youth leaders after visiting 12 rural primary schools where girls routinely stayed home for 4-5 days every menstrual cycle.",
    impact_summary: "Over 4,500 kits delivered across 38 schools, reducing monthly absenteeism by 88%.",
    created_at: "2024-01-15T08:00:00Z",
    beneficiaries_count: 850,
    county: "Kilifi",
    is_favorite: true,
    is_following: true
  },
  {
    id: "ch_heshima",
    name: "Heshima Project",
    year_established: "2019",
    org_type: "Non-Governmental Organization (NGO)",
    mission_statement: "Distributing high-quality, sustainable sanitary towels to schools in remote areas, ensuring no girl misses class due to lack of supplies.",
    address: "Nakuru East District, Rift Valley, Kenya",
    email: "info@heshimaproject.org",
    phone: "+254 723 987 654",
    website: "https://heshimaproject.org",
    contact_person: "Mary Wanjiku (Lead Educator)",
    status: "approved",
    category: "Sanitary Distribution",
    tag: "Sanitary Distribution",
    target_amount: 8e5,
    raised_amount: 56e4,
    currency: "KES",
    image_url: "/images/hero_schoolgirls_1787607019295.jpg",
    what_they_do: "Distributing high-quality, sustainable sanitary towels to schools in remote areas, ensuring no girl misses class due to lack of supplies.",
    how_it_started: "Founded by a local teacher who noticed a stark drop in attendance among her female students every month. She started buying supplies with her own salary before rallying community support.",
    impact_summary: "Directly sustaining 1,420 female students across 16 partner secondary institutions.",
    created_at: "2023-11-10T10:30:00Z",
    beneficiaries_count: 1420,
    county: "Nakuru",
    is_favorite: true,
    is_following: true
  },
  {
    id: "ch_workshops",
    name: "Menstrual Health Education Workshops",
    year_established: "2022",
    org_type: "Educational Trust",
    mission_statement: "Funding expert facilitators to conduct empowering educational sessions in community centers, breaking stigmas and building confidence.",
    address: "Kisumu Central, Western Kenya",
    email: "workshops@elimubora.org",
    phone: "+254 734 112 233",
    website: "https://elimubora.org/mhm",
    contact_person: "Dr. Faith Atieno",
    status: "approved",
    category: "Education",
    tag: "Education",
    target_amount: 4e5,
    raised_amount: 3e5,
    currency: "KES",
    image_url: "/images/health_workshop_1787607048989.jpg",
    what_they_do: "Conducts interactive, stigma-free puberty and menstrual hygiene workshops for girls and boys, providing peer-led mentorship and counseling.",
    how_it_started: "Initiated by public health graduates addressing harmful cultural taboos and lack of factual reproductive health knowledge among adolescent youth.",
    impact_summary: "Trained 60 peer champions and held 120 school workshops reached over 6,000 learners.",
    created_at: "2024-03-01T12:00:00Z",
    beneficiaries_count: 620,
    county: "Kisumu",
    is_favorite: false,
    is_following: false
  },
  {
    id: "ch_sanitation_safe",
    name: "Safe Haven Sanitation & Clean Water Stations",
    year_established: "2020",
    org_type: "Foundation",
    mission_statement: "Constructing private, clean, lockable WASH facilities with running water and incinerators at schools to guarantee menstrual hygiene dignity.",
    address: "Machakos County, Eastern Kenya",
    email: "wash@safehavengirls.org",
    phone: "+254 711 889 900",
    website: "https://safehavengirls.org",
    contact_person: "John Mutua",
    status: "approved",
    category: "Sanitation",
    tag: "Sanitation",
    target_amount: 12e5,
    raised_amount: 89e4,
    currency: "KES",
    image_url: "/images/hero_schoolgirls_1787607019295.jpg",
    what_they_do: "Builds dedicated girl-friendly sanitation blocks with solar water pumps, safe pad disposal bins, and mirror hygiene stations.",
    how_it_started: "Created after field survey showed 40% of schools lacked basic running water and private latrines for adolescent girls.",
    impact_summary: "Constructed 14 modern WASH blocks serving 3,200 girls with 100% operational maintenance.",
    created_at: "2023-09-20T14:00:00Z",
    beneficiaries_count: 1100,
    county: "Machakos",
    is_favorite: false,
    is_following: false
  },
  {
    id: "ch_samburu_girls",
    name: "Samburu Nomadic Girls Literacy & Pad Bank",
    year_established: "2023",
    org_type: "Grassroots Initiative",
    mission_statement: "Delivering mobile hygiene kits and solar study lamps to pastoralist girls in arid remote lands to prevent early dropouts.",
    address: "Maralal, Samburu County, Kenya",
    email: "contact@samburugirls.org",
    phone: "+254 700 445 566",
    website: "https://samburugirls.org",
    contact_person: "Lilian Leshoro",
    status: "pending",
    category: "Sanitary Distribution",
    tag: "Sanitary Distribution",
    target_amount: 6e5,
    raised_amount: 12e4,
    currency: "KES",
    image_url: "/images/dignity_kits_1787607033508.jpg",
    what_they_do: "Operates camel-backed mobile resource deliveries with menstrual products and study materials to nomadic settlements.",
    how_it_started: "Started by pastoralist female teachers who experienced firsthand the isolation of rural schools during periods.",
    impact_summary: "Currently supporting 420 girls who would otherwise miss 60 days of school annually.",
    created_at: "2024-07-10T09:00:00Z",
    beneficiaries_count: 420,
    county: "Samburu",
    is_favorite: false,
    is_following: false
  }
];
const initialState = {
  charities: initialCharities,
  selectedCategory: "All",
  searchQuery: "",
  currentPage: 1,
  perPage: 6,
  total: initialCharities.length,
  selectedCharity: initialCharities[1],
  loading: false,
  error: null,
  partnerWizardOpen: false,
  messages: initialMessages,
  isMessageModalOpen: false,
  activeMessageCharity: null,
  crisisCampaigns: initialCrisisCampaigns,
  isCrisisModalOpen: false,
  isAiPredictorModalOpen: false,
  isBlockchainModalOpen: false,
  isCorporateModalOpen: false
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
    },
    closePartnerWizard: (state) => {
      state.partnerWizardOpen = false;
    },
    toggleFavorite: (state, action) => {
      const ch = state.charities.find((c) => c.id === action.payload);
      if (ch) {
        ch.is_favorite = !ch.is_favorite;
      }
    },
    toggleFollow: (state, action) => {
      const ch = state.charities.find((c) => c.id === action.payload);
      if (ch) {
        ch.is_following = !ch.is_following;
      }
    },
    openMessageModal: (state, action) => {
      state.activeMessageCharity = action.payload;
      state.isMessageModalOpen = true;
    },
    closeMessageModal: (state) => {
      state.isMessageModalOpen = false;
      state.activeMessageCharity = null;
    },
    sendCharityMessage: (state, action) => {
      state.messages.unshift(action.payload);
      state.isMessageModalOpen = false;
      state.activeMessageCharity = null;
    },
    replyCharityMessage: (state, action) => {
      const msg = state.messages.find((m) => m.id === action.payload.id);
      if (msg) {
        msg.reply = action.payload.reply;
        msg.replied_at = (/* @__PURE__ */ new Date()).toISOString();
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
    addCharityApplication: (state, action) => {
      state.charities.unshift(action.payload);
      state.total = state.charities.length;
      state.partnerWizardOpen = false;
    },
    updateCharityStatus: (state, action) => {
      const ch = state.charities.find((c) => c.id === action.payload.id);
      if (ch) {
        ch.status = action.payload.status;
      }
    },
    updateCharityRaisedAmount: (state, action) => {
      const ch = state.charities.find((c) => c.id === action.payload.id);
      if (ch) {
        ch.raised_amount += action.payload.addedAmount;
      }
    }
  }
});
const {
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
  addCharityApplication,
  updateCharityStatus,
  updateCharityRaisedAmount
} = charitySlice.actions;
var stdin_default = charitySlice.reducer;
export {
  addCharityApplication,
  closeAiPredictorModal,
  closeBlockchainModal,
  closeCorporateModal,
  closeCrisisModal,
  closeMessageModal,
  closePartnerWizard,
  stdin_default as default,
  openAiPredictorModal,
  openBlockchainModal,
  openCorporateModal,
  openCrisisModal,
  openMessageModal,
  openPartnerWizard,
  replyCharityMessage,
  selectCharity,
  sendCharityMessage,
  setCurrentPage,
  setSearchQuery,
  setSelectedCategory,
  toggleFavorite,
  toggleFollow,
  updateCharityRaisedAmount,
  updateCharityStatus
};
