import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  Shield,
  User as UserIcon,
  Users,
  Lock,
  Mail,
  Key,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Building2,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { useAppDispatch } from "../store";
import { loginSuccess } from "../store/slices/authSlice";
import { addNotification } from "../store/slices/notificationSlice";
import { useToast } from "./ToastContext";
const LoginPage = ({ initialRole = null }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const onNavigateHome = () => navigate("/");
  const onNavigateToTab = (tab) => navigate(tab === "home" ? "/" : `/${tab}`);
  const [selectedRole, setSelectedRole] = useState(
    initialRole
  );
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    adminKey: "",
    userSubRole: "donor",
    rememberMe: true,
    agreeTerms: true
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const handleAutoFill = (roleType) => {
    if (roleType === "admin") {
      setSelectedRole("admin");
      setFormData((prev) => ({
        ...prev,
        email: "admin@tuinuewasichana.org",
        password: "AdminSecurePassword2026!",
        adminKey: "TW-ADMIN-2026"
      }));
    } else if (roleType === "charity") {
      setSelectedRole("user");
      setFormData((prev) => ({
        ...prev,
        userSubRole: "charity",
        email: "coordinator@heshimaproject.org",
        password: "CharityPassword123!"
      }));
    } else {
      setSelectedRole("user");
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
    if (!formData.email.trim()) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!formData.password) {
      setError("Please enter your password.");
      return;
    }
    if (selectedRole === "admin") {
      if (!formData.adminKey.trim()) {
        setError("Admin Security Key / Master PIN is required for administrator access.");
        return;
      }
      if (formData.adminKey.trim() !== "TW-ADMIN-2026" && formData.adminKey.trim() !== "admin") {
        setError('Invalid Admin Security Key. Use "TW-ADMIN-2026" or demo credentials.');
        return;
      }
    }
    if (selectedRole === "register") {
      if (!formData.name.trim()) {
        setError("Please enter your full name or organization name.");
        return;
      }
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match. Please re-enter.");
        return;
      }
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      let assignedRole = "donor";
      let username = formData.name.trim();
      if (selectedRole === "admin") {
        assignedRole = "admin";
        username = username || "Sarah Ochieng (Platform Admin)";
      } else if (selectedRole === "user") {
        assignedRole = formData.userSubRole;
        username = formData.userSubRole === "charity" ? "Mary Wanjiku (Heshima Coordinator)" : "Amina Kimani";
      } else if (selectedRole === "register") {
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
          title: selectedRole === "register" ? "Account Created" : "Login Successful",
          message: selectedRole === "register" ? `Welcome to Tuinue Wasichana, ${username}! Your ${assignedRole} account is ready.` : `Welcome back, ${username}! Authenticated with ${assignedRole.toUpperCase()} privileges.`,
          type: "account"
        })
      );
      showToast(
        selectedRole === "register" ? `Welcome to Tuinue Wasichana, ${username}!` : `Signed in successfully as ${assignedRole}!`,
        "success"
      );
      if (assignedRole === "admin" && onNavigateToTab) {
        onNavigateToTab("admin");
      } else if (assignedRole === "charity" && onNavigateToTab) {
        onNavigateToTab("charity-dashboard");
      } else if (onNavigateToTab) {
        onNavigateToTab("home");
      } else {
        onNavigateHome();
      }
    }, 600);
  };
  return <div
    id="login-page-container"
    className="min-h-[88vh] flex flex-col justify-between py-8 sm:py-12 px-4 sm:px-6 relative overflow-hidden bg-slate-900/95"
  >
      {
    /* Background Decorative Mesh / Ambient Lights */
  }
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-full max-w-4xl h-72 bg-purple-900/15 rounded-full blur-3xl pointer-events-none" />

      {
    /* Top Branding Bar */
  }
      <div className="relative z-10 max-w-4xl mx-auto w-full flex items-center justify-between mb-4">
        <button
    onClick={onNavigateHome}
    className="flex items-center gap-2 text-white hover:text-purple-300 transition-colors group"
  >
          <div className="w-9 h-9 rounded-xl bg-purple-900/80 border border-purple-500/30 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Heart className="w-5 h-5 text-purple-300 fill-purple-400" />
          </div>
          <span className="font-serif font-bold text-xl tracking-tight text-white">
            Tuinue Wasichana
          </span>
        </button>

        <button
    onClick={onNavigateHome}
    className="text-xs font-semibold text-purple-200 hover:text-white px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center gap-1.5"
  >
          <span>Return Home</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {
    /* Main Center Auth Card */
  }
      <div className="relative z-10 w-full max-w-md mx-auto my-auto">
        <div
    id="login-role-card"
    className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 sm:p-8 text-slate-900 transition-all"
  >
          {
    /* Top Close / Return if in sub-form */
  }
          <div className="flex items-center justify-between mb-4">
            {selectedRole ? <button
    type="button"
    onClick={() => {
      setSelectedRole(null);
      setError(null);
    }}
    className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-900 hover:text-purple-950 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-full transition-colors"
  >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Change role</span>
              </button> : <div />}

            <button
    onClick={onNavigateHome}
    aria-label="Close login dialog"
    className="text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
  >
              <span className="text-xl font-bold leading-none">×</span>
            </button>
          </div>

          {
    /* Header matching Design Reference */
  }
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif tracking-tight">
              Welcome!!!
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xs mx-auto leading-relaxed">
              Login to continue your journey with Tuinue Wasichana
            </p>
          </div>

          {
    /* View 1: 3 Role Cards Selection (Matching Screenshot Reference) */
  }
          {!selectedRole && <div className="space-y-4">
              <p className="text-xs font-bold text-slate-700 tracking-wide text-left">
                I am logging in as
              </p>

              {
    /* Option 1: Admin */
  }
              <button
    id="role-option-admin"
    type="button"
    onClick={() => {
      setSelectedRole("admin");
      setError(null);
    }}
    className="w-full p-4 rounded-2xl border border-slate-200 hover:border-purple-600 hover:shadow-md bg-white hover:bg-purple-50/40 transition-all flex items-center gap-3.5 text-left group"
  >
                <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-purple-900 group-hover:text-white transition-colors shrink-0">
                  <UserIcon className="w-5 h-5" />
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
    /* Option 2: User (Active border styled matching reference screenshot) */
  }
              <button
    id="role-option-user"
    type="button"
    onClick={() => {
      setSelectedRole("user");
      setError(null);
    }}
    className="w-full p-4 rounded-2xl border-2 border-purple-600 shadow-xs bg-purple-50/20 hover:bg-purple-50/60 hover:shadow-md transition-all flex items-center gap-3.5 text-left group"
  >
                {
    /* Numbered Pink/Purple Badge 2 */
  }
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
    /* Option 3: Register (Green accent styled matching reference screenshot) */
  }
              <button
    id="role-option-register"
    type="button"
    onClick={() => {
      setSelectedRole("register");
      setError(null);
    }}
    className="w-full p-4 rounded-2xl border border-slate-200 hover:border-emerald-600 hover:shadow-md bg-white hover:bg-emerald-50/40 transition-all flex items-center gap-3.5 text-left group"
  >
                {
    /* Numbered Green Badge 3 */
  }
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
    /* Demo 1-Click Credentials Quick Bar */
  }
              <div className="pt-3 border-t border-slate-100">
                <p className="text-[11px] font-semibold text-slate-400 text-center uppercase tracking-wider mb-2">
                  Quick Demo Access
                </p>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
    type="button"
    onClick={() => handleAutoFill("donor")}
    className="px-2 py-1.5 text-[11px] font-semibold bg-purple-50 text-purple-900 hover:bg-purple-100 rounded-lg transition-colors border border-purple-200"
  >
                    Demo Donor
                  </button>
                  <button
    type="button"
    onClick={() => handleAutoFill("charity")}
    className="px-2 py-1.5 text-[11px] font-semibold bg-pink-50 text-pink-900 hover:bg-pink-100 rounded-lg transition-colors border border-pink-200"
  >
                    Demo Charity
                  </button>
                  <button
    type="button"
    onClick={() => handleAutoFill("admin")}
    className="px-2 py-1.5 text-[11px] font-semibold bg-slate-100 text-slate-800 hover:bg-slate-200 rounded-lg transition-colors border border-slate-300"
  >
                    Demo Admin
                  </button>
                </div>
              </div>
            </div>}

          {
    /* View 2: Form for Selected Option (Admin / User / Register) */
  }
          {selectedRole && <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>}

              {
    /* Role Header Badge */
  }
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center gap-2.5">
                  {selectedRole === "admin" && <div className="w-8 h-8 rounded-xl bg-purple-900 text-white flex items-center justify-center">
                      <Shield className="w-4 h-4" />
                    </div>}
                  {selectedRole === "user" && <div className="w-8 h-8 rounded-xl bg-pink-500 text-white flex items-center justify-center">
                      <UserIcon className="w-4 h-4" />
                    </div>}
                  {selectedRole === "register" && <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                      <Users className="w-4 h-4" />
                    </div>}
                  <div>
                    <p className="text-xs font-bold text-slate-900 capitalize">
                      {selectedRole === "register" ? "New Account Registration" : `${selectedRole} Authentication`}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      {selectedRole === "admin" ? "Requires security key credentials" : selectedRole === "user" ? "Donor & Charity portal access" : "Join the menstrual dignity network"}
                    </p>
                  </div>
                </div>

                {
    /* Demo Quick Fill for Active Role */
  }
                {selectedRole === "admin" && <button
    type="button"
    onClick={() => handleAutoFill("admin")}
    className="text-[11px] font-semibold text-purple-900 hover:underline flex items-center gap-1"
  >
                    <Sparkles className="w-3 h-3 text-purple-700" />
                    <span>Auto-fill</span>
                  </button>}
                {selectedRole === "user" && <button
    type="button"
    onClick={() => handleAutoFill(formData.userSubRole)}
    className="text-[11px] font-semibold text-purple-900 hover:underline flex items-center gap-1"
  >
                    <Sparkles className="w-3 h-3 text-purple-700" />
                    <span>Auto-fill</span>
                  </button>}
              </div>

              {
    /* Sub-role selector if User or Register */
  }
              {(selectedRole === "user" || selectedRole === "register") && <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Account Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
    type="button"
    onClick={() => setFormData((prev) => ({ ...prev, userSubRole: "donor" }))}
    className={`py-2 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all ${formData.userSubRole === "donor" ? "bg-purple-900 text-white border-purple-900 shadow-xs" : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"}`}
  >
                      <UserIcon className="w-3.5 h-3.5" />
                      <span>Donor (Individual)</span>
                    </button>
                    <button
    type="button"
    onClick={() => setFormData((prev) => ({ ...prev, userSubRole: "charity" }))}
    className={`py-2 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all ${formData.userSubRole === "charity" ? "bg-purple-900 text-white border-purple-900 shadow-xs" : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"}`}
  >
                      <Building2 className="w-3.5 h-3.5" />
                      <span>Charity Partner</span>
                    </button>
                  </div>
                </div>}

              {
    /* Name field (Register only) */
  }
              {selectedRole === "register" && <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {formData.userSubRole === "charity" ? "Organization Name *" : "Full Name *"}
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
    type="text"
    placeholder={formData.userSubRole === "charity" ? "e.g. Heshima Project Foundation" : "e.g. Amina Kimani"}
    value={formData.name ?? ""}
    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
    className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-700 focus:outline-hidden"
  />
                  </div>
                </div>}

              {
    /* Email Address */
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
    className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-700 focus:outline-hidden"
  />
                </div>
              </div>

              {
    /* Password */
  }
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Password *
                  </label>
                  {selectedRole === "user" && <button
    type="button"
    onClick={() => showToast(
      "Password reset instructions sent to your email address.",
      "info"
    )}
    className="text-[11px] text-purple-900 hover:underline font-medium"
  >
                      Forgot password?
                    </button>}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
    type={showPassword ? "text" : "password"}
    placeholder="••••••••"
    value={formData.password ?? ""}
    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
    className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-700 focus:outline-hidden"
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
    /* Confirm Password (Register only) */
  }
              {selectedRole === "register" && <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
    type={showPassword ? "text" : "password"}
    placeholder="••••••••"
    value={formData.confirmPassword ?? ""}
    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
    className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-700 focus:outline-hidden"
  />
                  </div>
                </div>}

              {
    /* Admin Key (Admin only) */
  }
              {selectedRole === "admin" && <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Admin Security Key / Master PIN *
                    </label>
                    <span className="text-[10px] text-purple-700 font-mono">
                      Demo: TW-ADMIN-2026
                    </span>
                  </div>
                  <div className="relative">
                    <Key className="w-4 h-4 text-purple-700 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
    type="password"
    placeholder="TW-ADMIN-2026"
    value={formData.adminKey ?? ""}
    onChange={(e) => setFormData({ ...formData, adminKey: e.target.value })}
    className="w-full pl-10 pr-4 py-2.5 text-sm bg-purple-50/50 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-700 focus:outline-hidden font-mono tracking-wider"
  />
                  </div>
                </div>}

              {
    /* Terms checkbox for register / remember me for login */
  }
              {selectedRole === "register" ? <label className="flex items-start gap-2 text-xs text-slate-600 cursor-pointer pt-1">
                  <input
    type="checkbox"
    checked={formData.agreeTerms ?? true}
    onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
    className="rounded-sm border-slate-300 text-purple-900 focus:ring-purple-700 mt-0.5"
  />
                  <span>
                    I agree to the Tuinue Wasichana{" "}
                    <span className="text-purple-900 underline font-semibold">
                      Terms of Service
                    </span>{" "}
                    and{" "}
                    <span className="text-purple-900 underline font-semibold">
                      Child Safeguarding Charter
                    </span>
                    .
                  </span>
                </label> : <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
    type="checkbox"
    checked={formData.rememberMe}
    onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
    className="rounded-sm border-slate-300 text-purple-900 focus:ring-purple-700"
  />
                    <span>Remember my device</span>
                  </label>
                  <span className="text-emerald-700 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>256-Bit SSL Encrypted</span>
                  </span>
                </div>}

              {
    /* Submit Action Button */
  }
              <button
    id="btn-login-submit"
    type="submit"
    disabled={loading}
    className="w-full py-3 bg-purple-900 hover:bg-purple-950 text-white font-bold rounded-full shadow-md hover:shadow-lg transition-all text-sm mt-2 flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
  >
                {loading ? <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Authenticating...</span>
                  </> : <>
                    <span>
                      {selectedRole === "register" ? "Create Account" : selectedRole === "admin" ? "Enter Admin Portal" : "Sign In to Account"}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>}
              </button>

              {
    /* Switch between Login and Register inside form */
  }
              <div className="text-center pt-2">
                {selectedRole === "register" ? <button
    type="button"
    onClick={() => {
      setSelectedRole("user");
      setError(null);
    }}
    className="text-xs text-slate-600 hover:text-purple-950 font-medium"
  >
                    Already have an account?{" "}
                    <span className="text-purple-900 font-bold underline">
                      Sign In
                    </span>
                  </button> : <button
    type="button"
    onClick={() => {
      setSelectedRole("register");
      setError(null);
    }}
    className="text-xs text-slate-600 hover:text-purple-950 font-medium"
  >
                    Don't have an account?{" "}
                    <span className="text-purple-900 font-bold underline">
                      Create Account
                    </span>
                  </button>}
              </div>
            </form>}
        </div>
      </div>

      {
    /* Footer with Links */
  }
      <div className="relative z-10 max-w-4xl mx-auto w-full pt-8 text-center text-xs text-slate-400">
        <div className="flex items-center justify-center gap-6 mb-2">
          <span className="hover:text-purple-300 transition-colors cursor-pointer">
            Privacy Policy
          </span>
          <span>•</span>
          <span className="hover:text-purple-300 transition-colors cursor-pointer">
            Terms of Service
          </span>
          <span>•</span>
          <span className="hover:text-purple-300 transition-colors cursor-pointer">
            Beneficiary Protection
          </span>
          <span>•</span>
          <span className="hover:text-purple-300 transition-colors cursor-pointer">
            Support & Help Desk
          </span>
        </div>
        <p>© 2026 Tuinue Wasichana Foundation. Advancing Menstrual Dignity & Education.</p>
      </div>
    </div>;
};
export {
  LoginPage
};