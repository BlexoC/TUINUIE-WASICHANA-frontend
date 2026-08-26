const theme = {
  // Brand Color Palette
  colors: {
    primary: {
      50: "#faf5ff",
      100: "#f3e8ff",
      200: "#e9d5ff",
      300: "#d8b4fe",
      400: "#c084fc",
      500: "#a855f7",
      600: "#9333ea",
      700: "#7e22ce",
      800: "#6b21a8",
      900: "#581c87",
      // Brand Primary Deep Purple
      950: "#3b0764"
      // Brand Hero / Headline Deep Plum
    },
    emerald: {
      50: "#ecfdf5",
      100: "#d1fae5",
      200: "#a7f3d0",
      300: "#6ee7b7",
      400: "#34d399",
      500: "#10b981",
      600: "#059669",
      // Brand Impact / Success Green
      700: "#047857",
      800: "#065f46",
      900: "#064e3b"
    },
    amber: {
      50: "#fffbeb",
      100: "#fef3c7",
      200: "#fde68a",
      300: "#fcd34d",
      400: "#fbbf24",
      500: "#f59e0b",
      600: "#d97706",
      // Brand Warmth / Highlights
      700: "#b45309",
      800: "#92400e",
      900: "#78350f"
    },
    rose: {
      50: "#fff1f2",
      100: "#ffe4e6",
      200: "#fecdd3",
      300: "#fda4af",
      400: "#fb7185",
      500: "#f43f5e",
      600: "#e11d48",
      // Urgent / Critical Needs
      700: "#be123c",
      800: "#9f1239",
      900: "#881337"
    },
    slate: {
      50: "#f8fafc",
      100: "#f1f5f9",
      200: "#e2e8f0",
      300: "#cbd5e1",
      400: "#94a3b8",
      500: "#64748b",
      600: "#475569",
      700: "#334155",
      800: "#1e293b",
      900: "#0f172a",
      950: "#020617"
    },
    // Semantic Shortcuts
    brand: {
      main: "#581c87",
      dark: "#3b0764",
      light: "#f3e8ff",
      border: "#e9d5ff",
      text: "#3b0764"
    }
  },
  // Typography Scales
  typography: {
    fonts: {
      sans: "'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      serif: "'Playfair Display', Georgia, Cambria, 'Times New Roman', Times, serif",
      mono: "'JetBrains Mono', 'Fira Code', monospace"
    },
    scales: {
      xs: "0.75rem",
      // 12px
      sm: "0.875rem",
      // 14px
      base: "1rem",
      // 16px
      lg: "1.125rem",
      // 18px
      xl: "1.25rem",
      // 20px
      "2xl": "1.5rem",
      // 24px
      "3xl": "1.875rem",
      // 30px
      "4xl": "2.25rem",
      // 36px
      "5xl": "3rem",
      // 48px
      "6xl": "3.75rem"
      // 60px
    }
  },
  // Spacing Scales
  spacing: {
    xs: "0.25rem",
    // 4px
    sm: "0.5rem",
    // 8px
    md: "1rem",
    // 16px
    lg: "1.5rem",
    // 24px
    xl: "2rem",
    // 32px
    "2xl": "3rem",
    // 48px
    "3xl": "4rem",
    // 64px
    "4xl": "5rem"
    // 80px
  },
  // Border Radii
  radii: {
    sm: "0.375rem",
    // 6px
    md: "0.5rem",
    // 8px
    lg: "0.75rem",
    // 12px
    xl: "1rem",
    // 16px
    "2xl": "1.5rem",
    // 24px
    "3xl": "2rem",
    // 32px
    full: "9999px"
  },
  // Shadows
  shadows: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    glow: "0 0 20px -5px rgba(88, 28, 135, 0.3)"
  },
  // Pre-composed Tailwind class utility strings for design consistency across all components
  classes: {
    // Buttons
    button: {
      primary: "px-6 py-2.5 bg-purple-900 hover:bg-purple-950 text-white font-semibold rounded-full shadow-sm hover:shadow-md transition-all duration-200 active:scale-95 cursor-pointer inline-flex items-center justify-center gap-2 text-sm",
      primaryLg: "px-8 py-3.5 bg-purple-900 hover:bg-purple-950 text-white font-bold rounded-full shadow-md hover:shadow-xl transition-all duration-200 active:scale-95 cursor-pointer inline-flex items-center justify-center gap-2.5 text-base",
      secondary: "px-6 py-2.5 bg-purple-100 hover:bg-purple-200 text-purple-950 font-semibold rounded-full transition-all duration-200 active:scale-95 cursor-pointer inline-flex items-center justify-center gap-2 text-sm",
      outline: "px-6 py-2.5 bg-white hover:bg-slate-50 text-slate-700 hover:text-purple-950 font-semibold border border-slate-200 hover:border-purple-300 rounded-full transition-all duration-200 active:scale-95 cursor-pointer inline-flex items-center justify-center gap-2 text-sm",
      danger: "px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-full shadow-sm transition-all duration-200 active:scale-95 cursor-pointer inline-flex items-center justify-center gap-2 text-sm"
    },
    // Badges / Pill Tags
    badge: {
      purple: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100/90 text-purple-900 text-xs font-bold border border-purple-200/80 shadow-2xs",
      emerald: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-200/80 shadow-2xs",
      amber: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-200/80 shadow-2xs",
      rose: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-900 text-xs font-bold border border-rose-200/80 shadow-2xs",
      slate: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200 shadow-2xs"
    },
    // Containers & Cards
    card: {
      base: "bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 transition-all",
      elevated: "bg-white rounded-3xl border border-slate-200/80 shadow-xl p-6 sm:p-10 transition-all",
      interactive: "bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-purple-200 p-6 sm:p-8 transition-all duration-200",
      highlighted: "bg-gradient-to-br from-purple-50/90 to-purple-100/40 rounded-3xl border border-purple-200/80 shadow-sm p-6 sm:p-8"
    },
    // Form Inputs
    input: {
      base: "w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white text-slate-900 text-sm placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-purple-700/20 focus:border-purple-800 transition-all",
      select: "w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-purple-700/20 focus:border-purple-800 transition-all cursor-pointer"
    },
    // Headings & Text
    heading: {
      h1: "text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.12] font-sans",
      h2: "text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-950 font-serif tracking-tight leading-tight",
      h3: "text-2xl sm:text-3xl font-bold text-purple-950 font-serif",
      subtitle: "text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl"
    }
  }
};
var stdin_default = theme;
export {
  stdin_default as default,
  theme
};
