import { Heart, ArrowRight } from "lucide-react";
import { useAppDispatch } from "../store";
import { openDonationModal } from "../store/slices/donationSlice";
import { theme } from "../theme";
const HeroSection = () => {
  const dispatch = useAppDispatch();
  return <section id="hero-section" className="relative w-full bg-white">
      {
    /* Full-width Hero Banner with Schoolgirls Background Image matching Figma */
  }
      <div className="relative w-full min-h-145 lg:min-h-160 flex items-center overflow-hidden bg-slate-900">
        {
    /* Background Schoolgirls Photo */
  }
        <img
    src="/images/hero_schoolgirls_1787607019295.jpg"
    alt="Tuinue Wasichana - Empowering Kenyan schoolgirls"
    referrerPolicy="no-referrer"
    className="absolute inset-0 w-full h-full object-cover object-[center_35%] opacity-90"
  />

        {
    /* Soft atmospheric white-to-transparent gradient on the left for maximum text contrast */
  }
        <div className="absolute inset-0 bg-linear-to-r from-white/95 via-white/85 to-transparent sm:w-4/5 lg:w-3/5" />
        <div className="absolute inset-0 bg-linear-to-t from-white/30 via-transparent to-transparent" />

        {
    /* Hero Content Container */
  }
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-16 lg:py-24">
          <div className="max-w-2xl">
            {
    /* Pill Badge: Empowering Girls and Ladies */
  }
            <div className={theme.classes.badge.purple + " mb-6 backdrop-blur-xs"}>
              <Heart className="w-4 h-4 fill-purple-600 text-purple-700" />
              <span className="text-xs sm:text-sm font-semibold tracking-wide">
                Empowering Girls and Ladies
              </span>
            </div>

            {
    /* Main Headline */
  }
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.12] mb-6 font-sans">
              End Period Poverty,{" "}
              <span className="text-purple-800 block mt-1">
                Keep Girls in School
              </span>
            </h1>

            {
    /* Supporting Description */
  }
            <p className={theme.classes.heading.subtitle + " mb-8"}>
              Lack of sanitary supplies causes girls to miss up to 20% of their
              school year. Join us in providing pads, clean water, and sanitation
              facilities to empower the next generation.
            </p>

            {
    /* CTA Button */
  }
            <div>
              <button
    id="hero-donate-btn"
    onClick={() => dispatch(openDonationModal({}))}
    className={theme.classes.button.primaryLg + " group"}
  >
                <span>Donate Now</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {
    /* Horizontal Statistics Row Matching Figma Specs (150+ ACTIVE CHARITIES, 12k+ DONORS JOINED, $2.5M SCHOOL DAYS SAVED) */
  }
      <div className="w-full bg-white border-b border-slate-100 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 text-center">
            {
    /* Stat 1: 150+ Active Charities */
  }
            <div id="stat-active-charities" className="flex flex-col items-center justify-center px-4">
              <span className="text-5xl sm:text-6xl font-extrabold text-purple-950 tracking-tight font-sans">
                150+
              </span>
              <span className="mt-2 text-xs sm:text-sm font-bold tracking-widest text-slate-500 uppercase">
                Active Charities
              </span>
            </div>

            {
    /* Stat 2: 12k+ Donors Joined */
  }
            <div id="stat-donors-joined" className="flex flex-col items-center justify-center px-4 md:border-x md:border-slate-200">
              <span className="text-5xl sm:text-6xl font-extrabold text-emerald-600 tracking-tight font-sans">
                12k+
              </span>
              <span className="mt-2 text-xs sm:text-sm font-bold tracking-widest text-slate-500 uppercase">
                Donors Joined
              </span>
            </div>

            {
    /* Stat 3: $2.5M School Days Saved */
  }
            <div id="stat-days-saved" className="flex flex-col items-center justify-center px-4">
              <span className="text-5xl sm:text-6xl font-extrabold text-purple-800 tracking-tight font-sans">
                $2.5M
              </span>
              <span className="mt-2 text-xs sm:text-sm font-bold tracking-widest text-slate-500 uppercase">
                School Days Saved
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export {
  HeroSection
};