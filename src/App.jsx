import { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { Heart, Mail, Phone, MapPin } from "lucide-react";
import { useAppDispatch } from "./store";
import { Navbar } from "./components/Navbar";
import { HeroSection } from "./components/HeroSection";
import { AboutUsSection } from "./components/AboutUsSection";
import { CharitiesSection } from "./components/CharitiesSection";
import { NotificationsPage } from "./components/NotificationsPage";
import { CharityDashboard } from "./components/CharityDashboard";
import { AdminPanel } from "./components/AdminPanel";
import { DonationModal } from "./components/DonationModal";
import { PartnerWithUsWizard } from "./components/PartnerWithUsWizard";
import { RoleSelectModal } from "./components/RoleSelectModal";
import { AuthModal } from "./components/AuthModal";
import { DonorProfile } from "./components/DonorProfile";
import { ReceiptModal } from "./components/ReceiptModal";
import { LoginPage } from "./components/LoginPage";
import { openPartnerWizard } from "./store/slices/charitySlice";
import { openDonationModal } from "./store/slices/donationSlice";
function HomePage() {
  return <div>
      <HeroSection />
      <AboutUsSection />
      <CharitiesSection />
    </div>;
}
function AboutPage() {
  const dispatch = useAppDispatch();
  return <div>
      <AboutUsSection />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-purple-950 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          <div className="max-w-2xl relative z-10 space-y-4">
            <h3 className="text-3xl font-bold font-serif">
              Why Menstrual Dignity Matters
            </h3>
            <p className="text-purple-200 text-sm leading-relaxed">
              Over 65% of women and girls in rural communities cannot
              consistently afford sanitary pads. By providing dignified,
              reusable menstrual care solutions alongside health literacy
              workshops, we keep girls in class, reduce dropouts, and
              nurture future female leadership across Kenya and East
              Africa.
            </p>
            <div className="pt-2 flex gap-3">
              <button
    onClick={() => dispatch(openDonationModal({}))}
    className="px-6 py-2.5 bg-white text-purple-950 font-bold rounded-full text-sm hover:bg-purple-100 transition-colors"
  >
                Make a Contribution
              </button>
              <button
    onClick={() => dispatch(openPartnerWizard())}
    className="px-6 py-2.5 bg-purple-900 text-white font-semibold rounded-full text-sm hover:bg-purple-800 transition-colors border border-purple-800"
  >
                Partner Your School
              </button>
            </div>
          </div>
        </div>
      </div>
      <CharitiesSection />
    </div>;
}
function CharitiesPage() {
  return <div className="pt-4">
      <CharitiesSection />
    </div>;
}
function App() {
  const dispatch = useAppDispatch();
  return <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-purple-200 selection:text-purple-900">
      {
    /* Top Navbar */
  }
      <Navbar />

      {
    /* Main Route Views */
  }
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/charities" element={<CharitiesPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/charity-dashboard" element={<CharityDashboard />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/donor-profile" element={<DonorProfile />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>

      {
    /* Footer matching Tuinue Wasichana Brand */
  }
      <footer className="bg-purple-950 text-white border-t border-purple-900/60 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-purple-900/60">
            {
    /* Column 1: Brand */
  }
            <div className="space-y-4 md:col-span-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-800 flex items-center justify-center">
                  <Heart className="w-4 h-4 text-purple-200 fill-purple-400" />
                </div>
                <span className="text-xl font-bold font-serif">
                  Tuinue Wasichana
                </span>
              </div>
              <p className="text-xs text-purple-200 leading-relaxed">
                Dedicated to ending period poverty and empowering adolescent girls
                with access to menstrual hygiene products, education, and safe
                sanitation.
              </p>
            </div>

            {
    /* Column 2: Quick Links */
  }
            <div className="space-y-3 text-xs">
              <h4 className="font-bold text-sm text-purple-100 uppercase tracking-wider">
                Quick Links
              </h4>
              <ul className="space-y-2 text-purple-200">
                <li>
                  <Link to="/" className="hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-white transition-colors">
                    About Us & Partners
                  </Link>
                </li>
                <li>
                  <Link to="/charities" className="hover:text-white transition-colors">
                    Active Charity Campaigns
                  </Link>
                </li>
                <li>
                  <button
    onClick={() => dispatch(openPartnerWizard())}
    className="hover:text-white transition-colors"
  >
                    Charity Accreditation Wizard
                  </button>
                </li>
              </ul>
            </div>

            {
    /* Column 3: Platform Gateways & Security */
  }
            <div className="space-y-3 text-xs">
              <h4 className="font-bold text-sm text-purple-100 uppercase tracking-wider">
                Integrations
              </h4>
              <ul className="space-y-2 text-purple-200">
                <li>● Safaricom M-Pesa (Daraja API)</li>
                <li>● Stripe Payment Intents & Recurring Subscriptions</li>
                <li>● PostgreSQL Relational Schema</li>
              </ul>
            </div>

            {
    /* Column 4: Contact & Operating Base */
  }
            <div className="space-y-3 text-xs text-purple-200">
              <h4 className="font-bold text-sm text-purple-100 uppercase tracking-wider">
                Contact & Support
              </h4>
              <div className="space-y-2">
                <p className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-purple-400" />
                  <span>Nairobi & Kilifi County, Kenya</span>
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-purple-400" />
                  <span>contact@tuinuewasichana.org</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-purple-400" />
                  <span>+254 700 892 011</span>
                </p>
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-purple-300 gap-4">
            <p>© 2026 Tuinue Wasichana Foundation. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <span className="hover:text-white cursor-pointer">Privacy Policy</span>
              <span>•</span>
              <span className="hover:text-white cursor-pointer">Terms of Service</span>
              <span>•</span>
              <span className="hover:text-white cursor-pointer">Beneficiary Safeguarding</span>
            </div>
          </div>
        </div>
      </footer>

      {
    /* Global Modals */
  }
      <DonationModal />
      <ReceiptModal />
      <PartnerWithUsWizard />
      <RoleSelectModal />
      <AuthModal />
    </div>;
}
export {
  App as default
};