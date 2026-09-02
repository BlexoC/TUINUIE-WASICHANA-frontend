import { useState } from "react";
import {
  X,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User as UserIcon,
  Heart,
  Building2
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store";
import {
  closeAuthModal,
  setAuthMode,
  registerUser,
  loginUser,
  clearAuthError
} from "../store/slices/authSlice";
import { useToast } from "./ToastContext";

const AuthModal = () => {
  const dispatch = useAppDispatch();
  const { isAuthModalOpen, authMode, selectedRoleForAuth, loading, error } = useAppSelector(
    (state) => state.auth
  );
  const { showToast } = useToast();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(selectedRoleForAuth || "donor");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState(null);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    dispatch(clearAuthError());

    if (!email || !password || (authMode === "register" && !username)) {
      setFormError("Please fill in all required fields");
      return;
    }
    if (authMode === "register" && password.length < 8) {
      setFormError("Password must be at least 8 characters");
      return;
    }

    const action =
      authMode === "register"
        ? registerUser({ username, email, password, role })
        : loginUser({ email, password });

    const result = await dispatch(action);
    if (result.meta.requestStatus === "fulfilled") {
      const effectiveName = result.payload?.username || email.split("@")[0];
      showToast(
        authMode === "register"
          ? `Welcome to Tuinue Wasichana, ${effectiveName}!`
          : `Signed in successfully as ${result.payload?.role}!`,
        "success"
      );
    }
  };

  return (
    <div
      id="auth-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        id="auth-modal-card"
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden"
      >
        {/* Header */}
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
            {authMode === "register"
              ? "Join our mission to empower schoolgirls with menstrual dignity."
              : "Enter your credentials to access your dashboard."}
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-3.5 text-slate-900">
          {(formError || error) && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {formError || error}
            </div>
          )}

          {authMode === "register" && (
            <>
              <div className="space-y-1">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">
                  Account Role
                </label>
                <div className="grid grid-cols-2 gap-2">
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
                </div>
                {role === "charity" && (
                  <p className="text-[11px] text-slate-500 pt-1">
                    Registering as a charity creates your login. You'll submit
                    your organization's application for admin review right
                    after.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  {role === "charity" ? "Contact Name / Organization *" : "Full Name *"}
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder={role === "charity" ? "e.g. Mary Wanjiku" : "e.g. Amina Kimani"}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-700 focus:outline-hidden"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="name@example.org"
                value={email}
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
                value={password}
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

          <button
            type="submit"
            id="btn-auth-submit"
            disabled={loading}
            className="w-full py-2.5 bg-purple-900 hover:bg-purple-950 text-white font-bold rounded-full shadow-md transition-colors text-sm mt-3 disabled:opacity-60"
          >
            {loading ? "Please wait…" : authMode === "register" ? "Create Account" : "Sign In"}
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                dispatch(clearAuthError());
                dispatch(setAuthMode(authMode === "register" ? "login" : "register"));
              }}
              className="text-xs text-slate-600 hover:text-purple-950 font-medium"
            >
              {authMode === "register"
                ? "Already have an account? Sign In"
                : "Don't have an account? Create Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export { AuthModal };
