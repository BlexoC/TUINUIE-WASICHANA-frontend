import { useState } from "react";
import {
  X,
  Shield,
  User as UserIcon,
  Users,
  Lock,
  Mail,
  Key,
  Eye,
  EyeOff,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Building2
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store";
import {
  closeRoleSelect,
  loginSuccess
} from "../store/slices/authSlice";
import { addNotification } from "../store/slices/notificationSlice";
import { useToast } from "./ToastContext";
const RoleSelectModal = () => {
  const dispatch = useAppDispatch();
  const { isRoleSelectOpen } = useAppSelector((state) => state.auth);
  const { showToast } = useToast();
  const [activeStep, setActiveStep] = useState("select");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    adminKey: "",
    userSubRole: "donor",
    rememberMe: true
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  if (!isRoleSelectOpen) return null;
  const handleClose = () => {
    setActiveStep("select");
    setError(null);
    dispatch(closeRoleSelect());
  };
  const handleAutoFill = (roleType) => {
    if (roleType === "admin") {
      setActiveStep("admin");
      setFormData((prev) => ({
        ...prev,
        email: "admin@tuinuewasichana.org",
        password: "AdminSecurePassword2026!",
        adminKey: "TW-ADMIN-2026"
      }));
    } else if (roleType === "charity") {
      setActiveStep("user");
      setFormData((prev) => ({
        ...prev,
        userSubRole: "charity",
        email: "coordinator@heshimaproject.org",
        password: "CharityPassword123!"
      }));
    } else {
      setActiveStep("user");
      setFormData((prev) => ({
        ...prev,
        userSubRole: "donor",
        email: "amina.kimani@example.org",
        password: "DonorPassword123!"
      }));
    }
    setError(null);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    if (!formData.email.trim() || !formData.password) {
      setError("Please fill in email and password.");
      return;
    }
    if (activeStep === "admin") {
      if (!formData.adminKey.trim()) {
        setError("Admin Security Key is required.");
        return;
      }
      if (formData.adminKey.trim() !== "TW-ADMIN-2026" && formData.adminKey.trim() !== "admin") {
        setError('Invalid Admin Key. Use "TW-ADMIN-2026".');
        return;
      }
    }
    if (activeStep === "register") {
      if (!formData.name.trim()) {
        setError("Please enter your full or organization name.");
        return;
      }
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      let assignedRole = "donor";
      let username = formData.name.trim();
      if (activeStep === "admin") {
        assignedRole = "admin";
        username = username || "Sarah Ochieng (Platform Admin)";
      } else if (activeStep === "user") {
        assignedRole = formData.userSubRole;
        username = formData.userSubRole === "charity" ? "Mary Wanjiku (Heshima Coordinator)" : "Amina Kimani";
      } else if (activeStep === "register") {
        assignedRole = formData.userSubRole;
        username = formData.name;
      }
      const mockUser = {
        id: `usr_${Date.now()}`,
        username,
        email: formData.email,
        role: assignedRole,
        charity_id: assignedRole === "charity" ? "ch_heshima" : void 0,
        created_at: (/* @__PURE__ */ new Date()).toISOString()
      };
      const mockToken = `jwt_token_${mockUser.id}_${assignedRole}`;
      dispatch(loginSuccess({ user: mockUser, token: mockToken }));
      dispatch(
        addNotification({
          title: activeStep === "register" ? "Account Created" : "Login Successful",
          message: activeStep === "register" ? `Welcome to Tuinue Wasichana, ${username}!` : `Logged in with ${assignedRole.toUpperCase()} privileges.`,
          type: "account"
        })
      );
      showToast(
        activeStep === "register" ? `Welcome to Tuinue Wasichana, ${username}!` : `Signed in as ${assignedRole}!`,
        "success"
      );
      handleClose();
    }, 500);
  };
  return <div
    id="role-select-modal-overlay"
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200"
  >
      <div
    id="role-select-card"
    className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden p-6 sm:p-8 text-slate-900"
  >
        {
    /* Top Header Action Buttons */
  }
        <div className="flex items-center justify-between mb-4">
          {activeStep !== "select" ? <button
    type="button"
    onClick={() => {
      setActiveStep("select");
      setError(null);
    }}
    className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-900 hover:text-purple-950 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-full transition-colors"
  >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button> : <div />}

          <button
    onClick={handleClose}
    className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
  >
            <X className="w-5 h-5" />
          </button>
        </div>

        {
    /* Title Matching Screenshot Reference */
  }
        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif tracking-tight">
            Welcome!!!
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xs mx-auto leading-relaxed">
            Login to continue your journey with Tuinue Wasichana
          </p>
        </div>

        {
    /* 3 Role Selection Cards */
  }
        {activeStep === "select" && <div className="space-y-4">
            <p className="text-xs font-bold text-slate-700 tracking-wide text-left">
              I am logging in as
            </p>

            {
    /* Option 1: Admin */
  }
            <button
    id="modal-role-btn-admin"
    type="button"
    onClick={() => {
      setActiveStep("admin");
      setError(null);
    }}
    className="w-full p-4 rounded-2xl border border-slate-200 hover:border-purple-600 hover:shadow-md bg-white hover:bg-purple-50/30 transition-all flex items-center gap-3.5 text-left group"
  >
              <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-purple-900 group-hover:text-white transition-colors shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-purple-950">
                  Admin
                </h3>
                <p className="text-xs text-slate-500 truncate">
                  Manage platform and users
                </p>
              </div>
            </button>

            {
    /* Option 2: User (Active highlight border matching design reference) */
  }
            <button
    id="modal-role-btn-user"
    type="button"
    onClick={() => {
      setActiveStep("user");
      setError(null);
    }}
    className="w-full p-4 rounded-2xl border-2 border-purple-600 shadow-xs bg-purple-50/20 hover:bg-purple-50/60 hover:shadow-md transition-all flex items-center gap-3.5 text-left group"
  >
              <div className="w-7 h-7 rounded-full bg-pink-500 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                2
              </div>
              <div className="w-10 h-10 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                <UserIcon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-purple-950">
                  User
                </h3>
                <p className="text-xs text-slate-500 truncate">
                  Login to your account
                </p>
              </div>
            </button>

            {
    /* Option 3: Register */
  }
            <button
    id="modal-role-btn-register"
    type="button"
    onClick={() => {
      setActiveStep("register");
      setError(null);
    }}
    className="w-full p-4 rounded-2xl border border-slate-200 hover:border-emerald-600 hover:shadow-md bg-white hover:bg-emerald-50/30 transition-all flex items-center gap-3.5 text-left group"
  >
              <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                3
              </div>
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-900">
                  Register
                </h3>
                <p className="text-xs text-slate-500 truncate">
                  Create a new account
                </p>
              </div>
            </button>

            {
    /* Demo Quick Access */
  }
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Quick Demo:</span>
              <div className="flex gap-2">
                <button
    type="button"
    onClick={() => handleAutoFill("donor")}
    className="px-2.5 py-1 font-semibold text-purple-900 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200"
  >
                  Donor
                </button>
                <button
    type="button"
    onClick={() => handleAutoFill("charity")}
    className="px-2.5 py-1 font-semibold text-pink-900 bg-pink-50 hover:bg-pink-100 rounded-lg border border-pink-200"
  >
                  Charity
                </button>
                <button
    type="button"
    onClick={() => handleAutoFill("admin")}
    className="px-2.5 py-1 font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-300"
  >
                  Admin
                </button>
              </div>
            </div>
          </div>}

        {
    /* Active Forms */
  }
        {activeStep !== "select" && <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                {error}
              </div>}

            {
    /* Quick Auto Fill Button */
  }
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                {activeStep === "admin" ? "Admin Authentication" : activeStep === "user" ? "User Account Sign In" : "Create New Account"}
              </span>
              <button
    type="button"
    onClick={() => handleAutoFill(
      activeStep === "admin" ? "admin" : formData.userSubRole === "charity" ? "charity" : "donor"
    )}
    className="text-purple-900 font-semibold hover:underline flex items-center gap-1"
  >
                <Sparkles className="w-3.5 h-3.5 text-purple-700" />
                <span>Fill Demo</span>
              </button>
            </div>

            {
    /* Sub-role tabs for User / Register */
  }
            {(activeStep === "user" || activeStep === "register") && <div className="grid grid-cols-2 gap-2">
                <button
    type="button"
    onClick={() => setFormData((prev) => ({ ...prev, userSubRole: "donor" }))}
    className={`py-1.5 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all ${formData.userSubRole === "donor" ? "bg-purple-900 text-white border-purple-900 shadow-xs" : "bg-slate-50 text-slate-600 border-slate-200"}`}
  >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span>Donor</span>
                </button>
                <button
    type="button"
    onClick={() => setFormData((prev) => ({ ...prev, userSubRole: "charity" }))}
    className={`py-1.5 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all ${formData.userSubRole === "charity" ? "bg-purple-900 text-white border-purple-900 shadow-xs" : "bg-slate-50 text-slate-600 border-slate-200"}`}
  >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Charity</span>
                </button>
              </div>}

            {
    /* Name for Register */
  }
            {activeStep === "register" && <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full / Organization Name *
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
    type="text"
    placeholder="e.g. Amina Kimani"
    value={formData.name ?? ""}
    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
    className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-700 focus:outline-hidden"
  />
                </div>
              </div>}

            {
    /* Email */
  }
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
    type="email"
    placeholder="name@example.org"
    value={formData.email ?? ""}
    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
    className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-700 focus:outline-hidden"
  />
              </div>
            </div>

            {
    /* Password */
  }
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
    type={showPassword ? "text" : "password"}
    placeholder="••••••••"
    value={formData.password ?? ""}
    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
    className="w-full pl-10 pr-10 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-700 focus:outline-hidden"
  />
                <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
  >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {
    /* Admin Key */
  }
            {activeStep === "admin" && <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Admin Security Key *
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-purple-700 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
    type="password"
    placeholder="TW-ADMIN-2026"
    value={formData.adminKey ?? ""}
    onChange={(e) => setFormData({ ...formData, adminKey: e.target.value })}
    className="w-full pl-10 pr-4 py-2 text-sm bg-purple-50/50 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-700 focus:outline-hidden font-mono"
  />
                </div>
              </div>}

            {
    /* Confirm Password for Register */
  }
            {activeStep === "register" && <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
    type={showPassword ? "text" : "password"}
    placeholder="••••••••"
    value={formData.confirmPassword ?? ""}
    onChange={(e) => setFormData({
      ...formData,
      confirmPassword: e.target.value
    })}
    className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-700 focus:outline-hidden"
  />
                </div>
              </div>}

            {
    /* Submit button */
  }
            <button
    type="submit"
    disabled={loading}
    className="w-full py-2.5 bg-purple-900 hover:bg-purple-950 text-white font-bold rounded-full shadow-md transition-all text-sm mt-3 flex items-center justify-center gap-2 cursor-pointer"
  >
              {loading ? <span>Authenticating...</span> : <>
                  <span>
                    {activeStep === "register" ? "Create Account" : activeStep === "admin" ? "Enter Admin Portal" : "Sign In"}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>}
            </button>
          </form>}
      </div>
    </div>;
};
export {
  RoleSelectModal
};
