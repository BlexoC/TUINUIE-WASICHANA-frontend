import { useState } from "react";
import {
  X,
  User as UserIcon,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowLeft,
  ArrowRight,
  Building2,
  LogIn,
  UserPlus
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store";
import { closeRoleSelect, loginUser, registerUser } from "../store/slices/authSlice";
import { useToast } from "./ToastContext";

// Entry point for "how do I get in": pick Sign In or Register, then a
// single real form backed by POST /api/auth/login or /api/auth/register.
// There is no separate "admin" path — the backend has no admin self-service
// login; admins are provisioned directly in the database and simply sign
// in with the regular email/password form like everyone else.
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
    userSubRole: "donor",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.email.trim() || !formData.password) {
      setError("Please fill in email and password.");
      return;
    }
    if (activeStep === "register") {
      if (!formData.name.trim()) {
        setError("Please enter your full or organization name.");
        return;
      }
      if (formData.password.length < 8) {
        setError("Password must be at least 8 characters.");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    }

    setLoading(true);
    const action =
      activeStep === "register"
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
        activeStep === "register"
          ? `Welcome to Tuinue Wasichana, ${user.username}!`
          : `Signed in as ${user.role}!`,
        "success"
      );
      handleClose();
    } else {
      setError(result.payload || "Something went wrong. Please try again.");
    }
  };

  return (
    <div
      id="role-select-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        id="role-select-card"
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden p-6 sm:p-8 text-slate-900"
      >
        <div className="flex items-center justify-between mb-4">
          {activeStep !== "select" ? (
            <button
              type="button"
              onClick={() => {
                setActiveStep("select");
                setError(null);
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-900 hover:text-purple-950 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-full transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={handleClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif tracking-tight">
            Welcome!!!
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xs mx-auto leading-relaxed">
            Login to continue your journey with Tuinue Wasichana
          </p>
        </div>

        {activeStep === "select" && (
          <div className="space-y-4">
            <button
              id="modal-role-btn-signin"
              type="button"
              onClick={() => {
                setActiveStep("login");
                setError(null);
              }}
              className="w-full p-4 rounded-2xl border border-slate-200 hover:border-purple-600 hover:shadow-md bg-white hover:bg-purple-50/30 transition-all flex items-center gap-3.5 text-left group"
            >
              <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-purple-900 group-hover:text-white transition-colors shrink-0">
                <LogIn className="w-5 h-5" />
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
              id="modal-role-btn-register"
              type="button"
              onClick={() => {
                setActiveStep("register");
                setError(null);
              }}
              className="w-full p-4 rounded-2xl border border-slate-200 hover:border-emerald-600 hover:shadow-md bg-white hover:bg-emerald-50/30 transition-all flex items-center gap-3.5 text-left group"
            >
              <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-emerald-700 group-hover:text-white transition-colors shrink-0">
                <UserPlus className="w-5 h-5" />
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

        {activeStep !== "select" && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                {error}
              </div>
            )}

            <div className="text-xs">
              <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                {activeStep === "register" ? "Create New Account" : "Sign In"}
              </span>
            </div>

            {activeStep === "register" && (
              <div className="grid grid-cols-2 gap-2">
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
              </div>
            )}

            {activeStep === "register" && (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full / Organization Name *
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="e.g. Amina Kimani"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-700 focus:outline-hidden"
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
                  className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-700 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
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

            {activeStep === "register" && (
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
                    onChange={(e) =>
                      setFormData({ ...formData, confirmPassword: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-700 focus:outline-hidden"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-purple-900 hover:bg-purple-950 text-white font-bold rounded-full shadow-md transition-all text-sm mt-3 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>{activeStep === "register" ? "Create Account" : "Sign In"}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export { RoleSelectModal };
