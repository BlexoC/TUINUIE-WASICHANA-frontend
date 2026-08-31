import { Heart, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, BookOpen, Users, Award } from "lucide-react";
import { useAppDispatch } from "../store";
import { openDonationModal } from "../store/slices/donationSlice";
const AboutUsSection = () => {
  const dispatch = useAppDispatch();
  return <section id="about-us-section" className="bg-slate-50/80 py-20 relative overflow-hidden">
      {
    /* Background Decorative Ambient Blobs */
  }
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl z-0 pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-amber-100/40 rounded-full blur-3xl z-0 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {
    /* Section Header */
  }
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100/90 text-purple-900 text-xs font-bold uppercase tracking-wider border border-purple-200/60 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-purple-700" />
            <span>Community-Led Menstrual Equity</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-950 font-serif tracking-tight leading-tight">
            Our Partners in Change & Sustainable Impact
          </h2>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            We believe that every girl deserves the dignity, safety, and hygiene resources to
            pursue her education without interruption. Together with accredited community-based
            organizations, we are breaking stigmas, eradicating period poverty, and equipping the next generation
            of women leaders.
          </p>
        </div>

        {
    /* Featured Partner Card ("Heshima Project") */
  }
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden p-6 sm:p-10 lg:p-12 mb-16 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {
    /* Content Column */
  }
            <div className="lg:col-span-7 space-y-6">
              {
    /* Category Badge & Status */
  }
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-3 py-1 rounded-full bg-purple-900 text-white text-xs font-bold tracking-wide shadow-xs">
                  Sanitary Towel Distribution
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200/60 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Audited & Accredited Partner</span>
                </span>
              </div>

              {
    /* Title */
  }
              <div>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-purple-950 font-serif">
                  The Heshima Project Foundation
                </h3>
                <p className="text-xs text-slate-500 font-mono mt-1">
                  Kilifi & Coast Region Hub • NGO Reg #CBO/KFI/2021/0984
                </p>
              </div>

              {
    /* What They Do */
  }
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-purple-700" />
                  <span>What They Do</span>
                </h4>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  Distributing high-grade reusable hygiene kits, safe sanitary towels, and puberty education booklets
                  to primary and secondary schools in rural coastal Kenya, ensuring no girl misses class during her menstrual cycle.
                </p>
              </div>

              {
    /* How It Started */
  }
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-purple-700" />
                  <span>How It Started</span>
                </h4>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  Founded by Mary Wanjiku, a local headteacher who recorded a 20% attendance drop among adolescent girls
                  every month. She began personally providing supplies with her salary before partnering with Tuinue Wasichana
                  to scale support to over 1,400 students across 14 partner schools.
                </p>
              </div>

              {
    /* How You Help Box */
  }
              <div className="bg-linear-to-br from-purple-50/80 to-purple-100/30 rounded-2xl p-5 sm:p-6 border border-purple-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-purple-950 font-bold text-xs sm:text-sm">
                    <Heart className="w-4 h-4 fill-purple-700 text-purple-700" />
                    <span>How Your Donation Translates to Direct Impact</span>
                  </div>
                  <span className="text-[11px] font-extrabold text-purple-900 bg-purple-200/70 px-2 py-0.5 rounded-md">
                    100% Transparent
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-white p-3.5 rounded-xl border border-purple-100 shadow-xs">
                    <span className="font-extrabold text-purple-950 block text-sm font-serif mb-0.5">
                      Ksh 2,500 ($20)
                    </span>
                    <span className="text-slate-600 leading-snug block">
                      Provides 1 girl with a full year of washable sanitary supplies and soap.
                    </span>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-purple-100 shadow-xs">
                    <span className="font-extrabold text-purple-950 block text-sm font-serif mb-0.5">
                      Ksh 5,000 ($40)
                    </span>
                    <span className="text-slate-600 leading-snug block">
                      Supplies 2 girls + emergency sanitation packs for school washrooms.
                    </span>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-purple-100 shadow-xs">
                    <span className="font-extrabold text-purple-950 block text-sm font-serif mb-0.5">
                      Ksh 15,000 ($120)
                    </span>
                    <span className="text-slate-600 leading-snug block">
                      Sponsors a peer-led menstrual health workshop for 60 adolescent girls.
                    </span>
                  </div>
                </div>
              </div>

              {
    /* Action CTA Button */
  }
              <div className="pt-2">
                <button
    id="btn-donate-heshima"
    onClick={() => dispatch(openDonationModal({}))}
    className="px-8 py-3.5 bg-purple-900 hover:bg-purple-800 text-white font-bold rounded-2xl transition-all flex items-center gap-2 text-xs sm:text-sm shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
  >
                  <Heart className="w-4 h-4 fill-purple-300 text-purple-300" />
                  <span>Support Heshima Project</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {
    /* Photo & Impact Metrics Column */
  }
            <div className="lg:col-span-5 relative">
              <div className="rounded-3xl overflow-hidden shadow-xl aspect-4/3 sm:aspect-square lg:aspect-4/3 relative border-4 border-white">
                <img
    src="/images/hero_schoolgirls_1787607019295.jpg"
    alt="Heshima project schoolgirls thriving in education"
    referrerPolicy="no-referrer"
    className="w-full h-full object-cover"
  />

                {
    /* Floating Bottom Card */
  }
                <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl text-white border border-white/20 shadow-lg">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-white font-serif text-sm">
                      1,420 Girls Supported
                    </span>
                    <span className="text-emerald-400 font-extrabold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> 98.2% Attendance
                    </span>
                  </div>
                  <p className="text-[11px] text-purple-200">
                    Zero school dropouts recorded across 14 sponsored coastal primary schools in 2026.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {
    /* 3 Core Pillars Grid */
  }
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-900 flex items-center justify-center font-bold">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-serif">
              Grassroots Verification
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Every charity undergoes strict KYC compliance, annual financial auditing, and verification of direct school partnership agreements before approval.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-serif">
              Real-Time Tracking & Proof
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Charity coordinators log each kit delivery, student attendance milestone, and distribution receipt in our open ledger for complete donor peace of mind.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-serif">
              Holistic Education & Dignity
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Beyond pads, partner programs construct private washrooms, deliver reproductive health counseling, and train teachers to foster supportive learning spaces.
            </p>
          </div>
        </div>
      </div>
    </section>;
};
export {
  AboutUsSection
};