import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Bell,
  LogOut,
  LogIn,
  Menu,
  X,
  Heart,
  ChevronDown,
  Building2,
  Shield,
  Award
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store";
<<<<<<< HEAD
import { logoutUser } from "../store/slices/authSlice";
=======
import { logout } from "../store/slices/authSlice";
>>>>>>> a05ea03eacad7504cf83e5bd46e441dc47b10aef
import { openDonationModal } from "../store/slices/donationSlice";
import { useToast } from "./ToastContext";
const pathToTab = (pathname) => {
  const tab = pathname.replace(/^\//, "");
  return tab === "" ? "home" : tab;
};
const Navbar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const currentTab = pathToTab(location.pathname);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { unreadCount } = useAppSelector((state) => state.notification);
  const { showToast } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const handleLogout = () => {
    dispatch(logoutUser());
    showToast("You have been logged out successfully.", "info");
    setIsUserDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };
  const handleNavClick = (tab) => {
    navigate(tab === "home" ? "/" : `/${tab}`);
    setIsMobileMenuOpen(false);
    setIsUserDropdownOpen(false);
  };
  return <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {
    /* Left Section: Brand Logo matching Figma */
  }
          <div
    id="brand-logo"
    onClick={() => handleNavClick("home")}
    className="flex items-center cursor-pointer select-none"
  >
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-purple-950 font-sans">
              Tuinue Wasichana
            </span>
          </div>

          {
    /* Center Section: Navigation Links matching Figma (Home, About Us, Charities, Notification) */
  }
          <nav className="hidden md:flex items-center space-x-8">
            <button
    id="nav-home"
    onClick={() => handleNavClick("home")}
    className={`text-sm font-medium transition-all py-1 cursor-pointer ${currentTab === "home" ? "text-purple-950 border-b-2 border-purple-800 font-bold" : "text-slate-600 hover:text-purple-950"}`}
  >
              Home
            </button>

            <button
    id="nav-about"
    onClick={() => handleNavClick("about")}
    className={`text-sm font-medium transition-all py-1 cursor-pointer ${currentTab === "about" ? "text-purple-950 border-b-2 border-purple-800 font-bold" : "text-slate-600 hover:text-purple-950"}`}
  >
              About Us
            </button>

            <button
    id="nav-charities"
    onClick={() => handleNavClick("charities")}
    className={`text-sm font-medium transition-all py-1 cursor-pointer ${currentTab === "charities" ? "text-purple-950 border-b-2 border-purple-800 font-bold" : "text-slate-600 hover:text-purple-950"}`}
  >
              Charities
            </button>

            <button
    id="nav-notifications"
    onClick={() => handleNavClick("notifications")}
    className={`relative text-sm font-medium transition-all py-1 flex items-center gap-1.5 cursor-pointer ${currentTab === "notifications" ? "text-purple-950 border-b-2 border-purple-800 font-bold" : "text-slate-600 hover:text-purple-950"}`}
  >
              <span>Notification</span>
              {unreadCount > 0 && <span className="w-5 h-5 rounded-full bg-purple-700 text-white text-[11px] flex items-center justify-center font-bold shadow-xs">
                  {unreadCount}
                </span>}
            </button>

            {
    /* If Charity or Admin role, show contextual shortcut */
  }
            {(user?.role === "charity" || user?.role === "admin") && <button
    id="nav-charity-dashboard"
    onClick={() => handleNavClick("charity-dashboard")}
    className={`text-sm font-medium transition-all py-1 cursor-pointer ${currentTab === "charity-dashboard" ? "text-purple-950 border-b-2 border-purple-800 font-bold" : "text-purple-800 hover:text-purple-950 font-semibold"}`}
  >
                Charity Portal
              </button>}

            {user?.role === "admin" && <button
    id="nav-admin-panel"
    onClick={() => handleNavClick("admin")}
    className={`text-sm font-medium transition-all py-1 cursor-pointer ${currentTab === "admin" ? "text-purple-950 border-b-2 border-purple-800 font-bold" : "text-indigo-800 hover:text-purple-950 font-semibold"}`}
  >
                Admin Panel
              </button>}
          </nav>

          {
    /* Right Section: Actions matching Figma */
  }
          <div className="hidden md:flex items-center space-x-4">
            {
    /* Auth Buttons */
  }
            {isAuthenticated ? <div className="flex items-center gap-3">
                {
    /* User Dropdown / Profile */
  }
                <button
    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
    className="flex items-center gap-2 p-1.5 rounded-full hover:bg-purple-50 transition-colors"
    title="User Profile Menu"
  >
                  <div className="w-8 h-8 rounded-full bg-purple-900 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    {user?.username?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <span className="text-xs font-semibold text-slate-800 max-w-25 truncate hidden xl:inline">
                    {user?.username?.split(" ")[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {
    /* Prominent Figma Logout Button */
  }
                <button
    id="nav-logout-btn"
    onClick={handleLogout}
    className="px-6 py-2 bg-purple-900 hover:bg-purple-950 text-white font-medium text-sm rounded-full shadow-sm hover:shadow-md transition-all duration-150 cursor-pointer"
  >
                  Logout
                </button>

                {
    /* Dropdown Menu */
  }
                {isUserDropdownOpen && <div className="absolute right-6 top-18 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {user?.username}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {user?.email}
                      </p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-900">
                        {user?.role} account
                      </span>
                    </div>

                    <button
    onClick={() => handleNavClick("donor-profile")}
    className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-purple-50 flex items-center gap-2"
  >
                      <Award className="w-4 h-4 text-purple-700" />
                      <span>My Impact & Badges</span>
                    </button>

                    {user?.role === "charity" && <button
    onClick={() => handleNavClick("charity-dashboard")}
    className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-purple-50 flex items-center gap-2"
  >
                        <Building2 className="w-4 h-4 text-purple-700" />
                        <span>Charity Beneficiaries</span>
                      </button>}

                    {user?.role === "admin" && <button
    onClick={() => handleNavClick("admin")}
    className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-purple-50 flex items-center gap-2"
  >
                        <Shield className="w-4 h-4 text-purple-700" />
                        <span>Admin Governance</span>
                      </button>}

                    <div className="border-t border-slate-100 my-1" />

                    <button
    onClick={handleLogout}
    className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-semibold"
  >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>}
              </div> : <div className="flex items-center gap-3">
                <button
    id="nav-btn-login"
    onClick={() => handleNavClick("login")}
    className="text-sm font-semibold text-purple-950 hover:text-purple-800 px-4 py-2 transition-colors cursor-pointer"
  >
                  Login
                </button>
                <button
    id="nav-btn-donate"
    onClick={() => dispatch(openDonationModal({}))}
    className="px-6 py-2 bg-purple-900 hover:bg-purple-950 text-white font-medium text-sm rounded-full shadow-sm hover:shadow-md transition-all duration-150 cursor-pointer"
  >
                  Donate
                </button>
              </div>}
          </div>

          {
    /* Mobile Hamburger Menu Toggle */
  }
          <div className="flex md:hidden items-center gap-2">
            <button
    onClick={() => handleNavClick("notifications")}
    className="relative p-2 text-slate-600 hover:text-purple-900 rounded-xl hover:bg-slate-100"
  >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-purple-700 text-white text-[10px] flex items-center justify-center font-bold">
                  {unreadCount}
                </span>}
            </button>

            <button
    id="mobile-menu-btn"
    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
    className="p-2 text-slate-700 hover:text-purple-900 rounded-xl hover:bg-purple-50 transition-colors cursor-pointer"
    aria-label="Toggle navigation menu"
  >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {
    /* Mobile Drawer Menu */
  }
      {isMobileMenuOpen && <div
    id="mobile-drawer"
    className="md:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg animate-in slide-in-from-top-2 duration-200"
  >
          {
    /* User profile card in mobile if logged in */
  }
          {isAuthenticated && user && <div className="p-3 bg-purple-50 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-purple-900 text-white flex items-center justify-center font-bold text-sm">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 leading-tight">
                    {user.username}
                  </p>
                  <p className="text-xs text-purple-700 font-medium capitalize">
                    {user.role} role
                  </p>
                </div>
              </div>
              <button
    onClick={handleLogout}
    className="p-2 text-rose-600 hover:bg-rose-100 rounded-xl transition-colors"
    title="Logout"
  >
                <LogOut className="w-4 h-4" />
              </button>
            </div>}

          {
    /* Navigation Links */
  }
          <div className="grid grid-cols-1 gap-1">
            <button
    onClick={() => handleNavClick("home")}
    className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${currentTab === "home" ? "bg-purple-900 text-white font-bold" : "text-slate-700 hover:bg-slate-50"}`}
  >
              Home
            </button>
            <button
    onClick={() => handleNavClick("about")}
    className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${currentTab === "about" ? "bg-purple-900 text-white font-bold" : "text-slate-700 hover:bg-slate-50"}`}
  >
              About Us
            </button>
            <button
    onClick={() => handleNavClick("charities")}
    className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${currentTab === "charities" ? "bg-purple-900 text-white font-bold" : "text-slate-700 hover:bg-slate-50"}`}
  >
              Charities
            </button>
            <button
    onClick={() => handleNavClick("notifications")}
    className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-between ${currentTab === "notifications" ? "bg-purple-900 text-white font-bold" : "text-slate-700 hover:bg-slate-50"}`}
  >
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                <span>Notification</span>
              </div>
              {unreadCount > 0 && <span className="px-2 py-0.5 rounded-full bg-purple-700 text-white text-xs font-bold">
                  {unreadCount}
                </span>}
            </button>

            {isAuthenticated && <button
    onClick={() => handleNavClick("donor-profile")}
    className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${currentTab === "donor-profile" ? "bg-purple-900 text-white font-bold" : "text-slate-700 hover:bg-slate-50"}`}
  >
                <Award className="w-4 h-4 text-purple-700" />
                <span>My Impact & Badges</span>
              </button>}

            {(user?.role === "charity" || user?.role === "admin") && <button
    onClick={() => handleNavClick("charity-dashboard")}
    className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${currentTab === "charity-dashboard" ? "bg-purple-900 text-white font-bold" : "text-purple-700 hover:bg-purple-50"}`}
  >
                <Building2 className="w-4 h-4" />
                <span>Charity Portal</span>
              </button>}

            {user?.role === "admin" && <button
    onClick={() => handleNavClick("admin")}
    className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${currentTab === "admin" ? "bg-purple-900 text-white font-bold" : "text-indigo-700 hover:bg-indigo-50"}`}
  >
                <Shield className="w-4 h-4" />
                <span>Admin Panel</span>
              </button>}
          </div>

          {
    /* Auth Actions in Mobile */
  }
          <div className="pt-2 flex flex-col gap-2">
            {!isAuthenticated ? <div className="flex gap-2">
                <button
    onClick={() => handleNavClick("login")}
    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-purple-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2"
  >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </button>
                <button
    onClick={() => {
      dispatch(openDonationModal({}));
      setIsMobileMenuOpen(false);
    }}
    className="flex-1 py-2.5 bg-purple-900 hover:bg-purple-950 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2"
  >
                  <Heart className="w-4 h-4" />
                  <span>Donate</span>
                </button>
              </div> : <button
    onClick={handleLogout}
    className="w-full py-2.5 bg-purple-900 hover:bg-purple-950 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2"
  >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>}
          </div>
        </div>}
    </header>;
};
export {
  Navbar
};