import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  User as UserIcon,
  Users,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Building2,
  ArrowRight
} from "lucide-react";
import { useAppDispatch } from "../store";
import { loginUser, registerUser } from "../store/slices/authSlice";
import { useToast } from "./ToastContext";

// initialRole: "user" (sign in) or "register". There is no admin
// self-service option — the backend provisions admins directly in the
// database, so admins simply sign in through the same "user" form.
const LoginPage = ({ initialRole = null }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const onNavigateHome = () => navigate("/");
  const onNavigateToTab = (tab) => navigate(tab === "home" ? "/" : `/${tab}`);
  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    userSubRole: "donor",
    agreeTerms: true,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
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
    if (selectedRole === "register") {
      if (!formData.name.trim()) {
        setError("Please enter your full name or organization name.");
        return;
      }
      if (formData.password.length < 8) {
        setError("Password must be at least 8 characters.");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match. Please re-enter.");
        return;
      }
    }

    setLoading(true);
    const action =
      selectedRole === "register"
        ? registerUser({
            username: formData.name.trim(),
            email: formData.email.trim(),
            password: formData.password,
            role: formData.userSubRole,
          })
        : loginUser({ email: formData.email.trim(), password: formData.password });

    const result = await dispatch(action);
    setLoading(false);

    if (result.meta.requestStatus === "fulfilled") {
      const user = result.payload;
      showToast(
        selectedRole === "register"
          ? `Welcome to Tuinue Wasichana, ${user.username}!`
          : `Signed in successfully as ${user.role}!`,
        "success"
      );
      if (user.role === "admin") onNavigateToTab("admin");
      else if (user.role === "charity") onNavigateToTab("charity-dashboard");
      else onNavigateToTab("home");
    } else {
      setError(result.payload || "Something went wrong. Please try again.");
    }
  };

  return (
    <div
      id="login-page-container"
      className="min-h-[88vh] flex flex-col justify-between py-8 sm:py-12 px-4 sm:px-6 relative overflow-hidden bg-slate-900/95"
    >
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-full max-w-4xl h-72 bg-purple-900/15 rounded-full blur-3xl pointer-events-none" />

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

      <div className="relative z-10 w-full max-w-md mx-auto my-auto">
        <div
          id="login-role-card"
          className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 sm:p-8 text-slate-900 transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            {selectedRole ? (
              <button
                type="button"
                onClick={() => {
                  setSelectedRole(null);
                  setError(null);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-900 hover:text-purple-950 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-full transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Change role</span>
              </button>
            ) : (
              <div />
            )}

            <button
              onClick={onNavigateHome}
              aria-label="Close login dialog"
              className="text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
            >
              <span className="text-xl font-bold leading-none">×</span>
            </button>
          </div>

          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif tracking-tight">
              Welcome!!!
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xs mx-auto leading-relaxed">
              Login to continue your journey with Tuinue Wasichana
            </p>
          </div>

          {!selectedRole && (
            <div className="space-y-4">
              <p className="text-xs font-bold text-slate-700 tracking-wide text-left">
                Continue as
              </p>

              <button
                id="role-option-user"
                type="button"
                onClick={() => {
                  setSelectedRole("user");
                  setError(null);
                }}
                className="w-full p-4 rounded-2xl border-2 border-purple-600 shadow-xs bg-purple-50/20 hover:bg-purple-50/60 hover:shadow-md transition-all flex items-center gap-3.5 text-left group"
              >
                <div className="w-10 h-10 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                  <UserIcon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-purple-950">
                    Sign In
                  </h3>
                  <p className="text-xs text-slate-500 truncate">
                    Access your donor, charity, or admin dashboard
                  </p>
                </div>
              </button>

              <button
                id="role-option-register"
                type="button"
                onClick={() => {
                  setSelectedRole("register");
                  setError(null);
                }}
                className="w-full p-4 rounded-2xl border border-slate-200 hover:border-emerald-600 hover:shadow-md bg-white hover:bg-emerald-50/40 transition-all flex items-center gap-3.5 text-left group"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-900">
                    Register
                  </h3>
                  <p className="text-xs text-slate-500 truncate">
                    Create a new donor or charity account
                  </p>
                </div>
              </button>
            </div>
          )}

          {selectedRole && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center gap-2.5">
                  {selectedRole === "user" && (
                    <div className="w-8 h-8 rounded-xl bg-pink-500 text-white flex items-center justify-center">
                      <UserIcon className="w-4 h-4" />
                    </div>
                  )}
                  {selectedRole === "register" && (
                    <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                      <Users className="w-4 h-4" />
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-bold text-slate-900 capitalize">
                      {selectedRole === "register" ? "New Account Registration" : "Sign In"}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      {selectedRole === "user"
                        ? "Donor, charity, and admin portal access"
                        : "Join the menstrual dignity network"}
                    </p>
                  </div>
                </div>
              </div>

              {selectedRole === "register" && (
                <div>
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
                </div>
              )}

              {selectedRole === "register" && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {formData.userSubRole === "charity" ? "Contact / Organization Name *" : "Full Name *"}
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder={formData.userSubRole === "charity" ? "e.g. Mary Wanjiku" : "e.g. Amina Kimani"}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-700 focus:outline-hidden"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="name@example.org"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-700 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Password *
                  </label>
                  {selectedRole === "user" && (
                    <button
                      type="button"
                      onClick={() =>
                        showToast(
                          "Password reset isn't wired up yet — contact support for now.",
                          "info"
                        )
                      }
                      className="text-[11px] text-purple-900 hover:underline font-medium"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
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

              {selectedRole === "register" && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-700 focus:outline-hidden"
                    />
                  </div>
                </div>
              )}

              {selectedRole === "register" ? (
                <label className="flex items-start gap-2 text-xs text-slate-600 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={formData.agreeTerms}
                    onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                    className="rounded-sm border-slate-300 text-purple-900 focus:ring-purple-700 mt-0.5"
                  />
                  <span>
                    I agree to the Tuinue Wasichana{" "}
                    <span className="text-purple-900 underline font-semibold">Terms of Service</span>{" "}
                    and{" "}
                    <span className="text-purple-900 underline font-semibold">
                      Child Safeguarding Charter
                    </span>
                    .
                  </span>
                </label>
              ) : (
                <div className="flex items-center justify-end text-xs text-slate-600 pt-1">
                  <span className="text-emerald-700 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>256-Bit SSL Encrypted</span>
                  </span>
                </div>
              )}

              <button
                id="btn-login-submit"
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-purple-900 hover:bg-purple-950 text-white font-bold rounded-full shadow-md hover:shadow-lg transition-all text-sm mt-2 flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <span>{selectedRole === "register" ? "Create Account" : "Sign In to Account"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                {selectedRole === "register" ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRole("user");
                      setError(null);
                    }}
                    className="text-xs text-slate-600 hover:text-purple-950 font-medium"
                  >
                    Already have an account?{" "}
                    <span className="text-purple-900 font-bold underline">Sign In</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRole("register");
                      setError(null);
                    }}
                    className="text-xs text-slate-600 hover:text-purple-950 font-medium"
                  >
                    Don't have an account?{" "}
                    <span className="text-purple-900 font-bold underline">Create Account</span>
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto w-full pt-8 text-center text-xs text-slate-400">
        <div className="flex items-center justify-center gap-6 mb-2">
          <span className="hover:text-purple-300 transition-colors cursor-pointer">Privacy Policy</span>
          <span>•</span>
          <span className="hover:text-purple-300 transition-colors cursor-pointer">Terms of Service</span>
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
    </div>
  );
};

export { LoginPage };
