import { useState } from "react";
import {
  X,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User as UserIcon,
  Heart,
  Shield,
  Key,
  Building2,
  Sparkles
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store";
import {
  closeAuthModal,
  setAuthMode,
  loginSuccess
} from "../store/slices/authSlice";
import { addNotification } from "../store/slices/notificationSlice";
import { useToast } from "./ToastContext";
const AuthModal = () => {
  const dispatch = useAppDispatch();
  const { isAuthModalOpen, authMode, selectedRoleForAuth } = useAppSelector(
    (state) => state.auth
  );
  const { showToast } = useToast();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminKey, setAdminKey] = useState("");
  const [role, setRole] = useState(selectedRoleForAuth || "donor");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  if (!isAuthModalOpen) return null;
  const handleAutoFill = (targetRole) => {
    setRole(targetRole);
    if (targetRole === "admin") {
      setEmail("admin@tuinuewasichana.org");
      setPassword("AdminSecurePassword2026!");
      setAdminKey("TW-ADMIN-2026");
      setUsername("Sarah Ochieng (Platform Admin)");
    } else if (targetRole === "charity") {
      setEmail("coordinator@heshimaproject.org");
      setPassword("CharityPassword123!");
      setUsername("Mary Wanjiku (Heshima Coordinator)");
    } else {
      setEmail("amina.kimani@example.org");
      setPassword("DonorPassword123!");
      setUsername("Amina Kimani");
    }
    setError(null);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password || authMode === "register" && !username) {
      setError("Please fill in all required fields");
      return;
    }
    if (role === "admin" && !adminKey.trim()) {
      setError("Admin Security Key is required.");
      return;
    }
    const effectiveName = username || email.split("@")[0] || "User";
    const mockUser = {
      id: `usr_${Date.now()}`,
      username: effectiveName,
      email,
      role,
      charity_id: role === "charity" ? "ch_heshima" : void 0,
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    const mockToken = `jwt_token_${mockUser.id}_${role}`;
    dispatch(loginSuccess({ user: mockUser, token: mockToken }));
    dispatch(
      addNotification({
        title: authMode === "register" ? "Account Created" : "Login Successful",
        message: authMode === "register" ? `Welcome to Tuinue Wasichana, ${effectiveName}! Your ${role} account has been activated.` : `Welcome back, ${effectiveName}! Authenticated as ${role.toUpperCase()}.`,
        type: "account"
      })
    );
    showToast(
      authMode === "register" ? `Welcome to Tuinue Wasichana, ${effectiveName}!` : `Signed in successfully as ${role}!`,
      "success"
    );
    dispatch(closeAuthModal());
  };
  return <div
    id="auth-modal-overlay"
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200"
  >
      <div
    id="auth-modal-card"
    className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden"
  >
        {
    /* Header */
  }
        <div className="p-6 sm:p-7 bg-purple-950 text-white relative">
          <button
    onClick={() => dispatch(closeAuthModal())}
    className="absolute top-5 right-5 p-2 text-purple-200 hover:text-white rounded-full hover:bg-white/10 transition-colors"
  >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-4 h-4 fill-purple-400 text-purple-300" />
            <span className="text-[11px] font-semibold text-purple-300 uppercase tracking-wider">
              Tuinue Wasichana
            </span>
          </div>

          <h2 className="text-2xl font-bold font-serif">
            {authMode === "register" ? "Create Account" : "Welcome Back"}
          </h2>
          <p className="text-purple-200 text-xs mt-1">
            {authMode === "register" ? "Join our mission to empower schoolgirls with menstrual dignity." : "Enter your credentials to access your dashboard."}
          </p>
        </div>

        {
    /* Form Body */
  }
        <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-3.5 text-slate-900">
          {error && <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {error}
            </div>}

          {
    /* Role selector */
  }
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">
                Account Role
              </label>
              <button
    type="button"
    onClick={() => handleAutoFill(role)}
    className="text-[11px] font-semibold text-purple-900 hover:underline flex items-center gap-1"
  >
                <Sparkles className="w-3 h-3 text-purple-700" />
                <span>Fill Demo</span>
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
    type="button"
    onClick={() => setRole("donor")}
    className={`py-2 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all ${role === "donor" ? "bg-purple-900 text-white border-purple-900 shadow-xs" : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"}`}
  >
                <UserIcon className="w-3.5 h-3.5" />
                <span>Donor</span>
              </button>
              <button
    type="button"
    onClick={() => setRole("charity")}
    className={`py-2 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all ${role === "charity" ? "bg-purple-900 text-white border-purple-900 shadow-xs" : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"}`}
  >
                <Building2 className="w-3.5 h-3.5" />
                <span>Charity</span>
              </button>
              <button
    type="button"
    onClick={() => setRole("admin")}
    className={`py-2 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all ${role === "admin" ? "bg-purple-900 text-white border-purple-900 shadow-xs" : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"}`}
  >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>
            </div>
          </div>

          {authMode === "register" && <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                {role === "charity" ? "Organization Name *" : "Full Name *"}
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
    type="text"
    placeholder={role === "charity" ? "e.g. Heshima Project Foundation" : "e.g. Amina Kimani"}
    value={username ?? ""}
    onChange={(e) => setUsername(e.target.value)}
    className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-700 focus:outline-hidden"
  />
              </div>
            </div>}

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
    type="email"
    placeholder="name@example.org"
    value={email ?? ""}
    onChange={(e) => setEmail(e.target.value)}
    className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-700 focus:outline-hidden"
  />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
              Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
    type={showPassword ? "text" : "password"}
    placeholder="••••••••"
    value={password ?? ""}
    onChange={(e) => setPassword(e.target.value)}
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

          {role === "admin" && <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">
                  Admin Key *
                </label>
                <span className="text-[10px] text-purple-700 font-mono">Demo: TW-ADMIN-2026</span>
              </div>
              <div className="relative">
                <Key className="w-4 h-4 text-purple-700 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
    type="password"
    placeholder="TW-ADMIN-2026"
    value={adminKey ?? ""}
    onChange={(e) => setAdminKey(e.target.value)}
    className="w-full pl-10 pr-4 py-2 text-sm bg-purple-50/50 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-700 focus:outline-hidden font-mono"
  />
              </div>
            </div>}

          <button
    type="submit"
    id="btn-auth-submit"
    className="w-full py-2.5 bg-purple-900 hover:bg-purple-950 text-white font-bold rounded-full shadow-md transition-colors text-sm mt-3"
  >
            {authMode === "register" ? "Create Account" : "Sign In"}
          </button>

          <div className="text-center pt-2">
            <button
    type="button"
    onClick={() => dispatch(
      setAuthMode(authMode === "register" ? "login" : "register")
    )}
    className="text-xs text-slate-600 hover:text-purple-950 font-medium"
  >
              {authMode === "register" ? "Already have an account? Sign In" : "Don't have an account? Create Account"}
            </button>
          </div>
        </form>
      </div>
    </div>;
};
export {
  AuthModal
};
