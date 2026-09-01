# Tuinue Wasichana — Frontend

**Tuinue Wasichana** ("Let's Uplift Girls" in Swahili) is a donation and charity-coordination platform focused on ending period poverty in Sub-Saharan Africa. It connects donors directly with verified grassroots charities to fund reusable sanitary kits, WASH (water, sanitation, and hygiene) facilities, and stigma-free health education, with the goal of keeping girls in school.

This repository contains the **React frontend** for the platform.

## Features

- **Public site** — Home, About, and Active Charities pages with hero, impact stats, and charity listings
- **Donations** — Donation modal with contribution flows and generated receipts
- **Authentication & roles** — Sign in / sign up with role-based access for **Donor**, **Charity**, and **Admin** users
- **Donor Hub** — Donor profile, giving history, and notifications
- **Charity Coordinator dashboard** — Tools for charities to manage campaigns and communicate with donors
- **Admin Suite** — Administrative panel for platform oversight
- **Partner With Us wizard** — Multi-step flow for schools/organizations to become partners
- **Impact tools** — AI impact predictor and an interactive impact calculator
- **Transparency ledger** — Blockchain-style ledger modal for donation transparency
- **Corporate giving portal** — Dedicated flow for corporate donors
- **Crisis relief** — Crisis banner and modal for emergency/disaster relief campaigns
- **Sharing** — Social share modal for spreading campaigns
- **Internationalization (i18n)** — Multi-language support
- **Toast notifications & error boundary** — App-wide UX feedback and graceful error handling

## Tech Stack

- **[React 19](https://react.dev/)** — UI library
- **[Vite](https://vitejs.dev/)** — Build tool and dev server
- **[React Router v7](https://reactrouter.com/)** — Client-side routing
- **[Redux Toolkit](https://redux-toolkit.js.org/)** + **React Redux** — Global state management
- **[Tailwind CSS v4](https://tailwindcss.com/)** — Utility-first styling
- **[Recharts](https://recharts.org/)** — Charts and data visualization
- **[Motion](https://motion.dev/)** — Animations
- **[Lucide React](https://lucide.dev/)** — Icon set
- **[canvas-confetti](https://www.npmjs.com/package/canvas-confetti)** — Celebration effects
- **ESLint** — Linting

## Project Structure

```
TUINUIE-WASICHANA-frontend/
├── public/
│   └── images/              # Static image assets
├── src/
│   ├── assets/               # Bundled assets
│   ├── components/           # React components (pages, modals, sections)
│   ├── lib/
│   │   └── i18n.js           # Translation strings
│   ├── store/
│   │   ├── index.js          # Redux store configuration
│   │   └── slices/           # Redux Toolkit slices (auth, donations, charities, etc.)
│   ├── __tests__/             # Test files
│   ├── App.jsx                # Root component & route definitions
│   ├── main.jsx                # App entry point
│   ├── theme.js                # Theme configuration
│   └── index.css               # Global styles / Tailwind entry
├── index.html
├── vite.config.js
├── eslint.config.js
└── package.json
```

### Key Redux slices

| Slice | Purpose |
|---|---|
| `authSlice` | User authentication, session, and role selection |
| `donationSlice` | Donation modal state and contribution flow |
| `charitySlice` | Charity listings and Partner-With-Us wizard |
| `beneficiarySlice` | Beneficiary data |
| `adminSlice` | Admin panel state |
| `notificationSlice` | In-app notifications |
| `languageSlice` | Active language / locale |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- npm (bundled with Node.js)

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start the dev server with hot module reloading
npm run dev
```

The app will be available at the URL printed in your terminal (typically `http://localhost:5173`).

### Linting

```bash
npm run lint
```

### Production Build

```bash
# Build for production
npm run build

# Preview the production build locally
npm run preview
```

## Available Routes

| Path | Description | Access |
|---|---|---|
| `/` | Home page | Public |
| `/about` | About Us | Public |
| `/charities` | Active charities listing | Public |
| `/notifications` | Notifications | Public |
| `/donor-profile` | Donor profile & history | Public |
| `/login` | Sign in | Public |
| `/charity-dashboard` | Charity coordinator dashboard | Charity, Admin |
| `/admin` | Admin suite | Admin |

## Notes

- This project was bootstrapped from the standard Vite + React template and extended with Tailwind CSS, Redux Toolkit, and routing.
- Some data in the app currently ships with demo/mock values for local development — check individual slices under `src/store/slices/` before connecting to a live backend.

## License

No license file is currently included in this repository. Add one if you intend to distribute this project publicly.
