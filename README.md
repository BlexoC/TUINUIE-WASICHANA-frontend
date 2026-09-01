# Tuinue Wasichana — Frontend

**Tuinue Wasichana** ("Let's Uplift Girls" in Swahili) is a recurring-donation and charity-coordination platform built to fight period poverty among school-going girls in sub-Saharan Africa. It connects donors with vetted charities that supply sanitary towels, clean water, and sanitation facilities, so girls no longer miss school during their periods.

This repository contains the **React frontend** for the platform.

## Problem Statement

Studies from Kenya's Ministry of Education (2016) found that girls from low-income families miss around 20% of school days each year due to lack of access to sanitary towels — a primary-school girl (classes 6–8) can lose up to 18 of 108 learning weeks, and a high-school girl up to 24 of 144 weeks. Charities addressing this need reliable, recurring funding to consistently provide sanitary supplies and WASH (water, sanitation, and hygiene) facilities that meet UNICEF's menstrual hygiene guidelines.

## Solution

Tuinue Wasichana helps charities raise sustainable funding by making it easy for donors to give repeatedly — not just once. Donors can set up automated monthly (or other recurring) donations to a charity of their choice, in addition to one-time gifts, reducing the fundraising burden on charities and creating predictable income to plan around.

## User Roles & Stories

The platform serves three types of users:

**Donor**
- Browse a variety of charities to donate to
- Create an account on the platform
- Choose a charity and make a donation
- Set up an automated recurring donation, or give a one-time donation
- Choose to donate anonymously or publicly
- Receive monthly reminders to donate
- Read stories about the beneficiaries their donations support
- Donate via a third-party payment processor (e.g. PayPal/Stripe)

**Charity**
- Apply to join the platform
- Once approved by an administrator, set up charity profile details
- View non-anonymous donors and their donation amounts
- View aggregate totals given by anonymous donors
- View the total amount donated to the charity
- Create and publish beneficiary stories
- Maintain a list of beneficiaries and the inventory sent to them

**Administrator**
- Receive and review charity applications
- Approve or reject applications
- Remove charities from the platform

## Features Implemented in This Frontend

- **Public site** — Home, About, and Active Charities pages with hero, impact stats, and charity listings
- **Donations** — Donation modal supporting the contribution flow, with generated receipts
- **Authentication & roles** — Sign in / sign up with role-based access for **Donor**, **Charity**, and **Admin** users
- **Donor Hub** — Donor profile, giving history, and notifications
- **Charity Coordinator dashboard** — Tools for charities to manage campaigns and communicate with donors
- **Admin Suite** — Administrative panel for reviewing/approving charity applications
- **Partner With Us wizard** — Multi-step flow for schools/organizations to become partner charities
- **Impact tools** — AI impact predictor and an interactive impact calculator
- **Transparency ledger** — Blockchain-style ledger modal for donation transparency
- **Corporate giving portal** — Dedicated flow for corporate donors
- **Crisis relief** — Crisis banner and modal for emergency/disaster relief campaigns
- **Sharing** — Social share modal for spreading campaigns
- **Internationalization (i18n)** — Multi-language support
- **Toast notifications & error boundary** — App-wide UX feedback and graceful error handling

> **Note:** Some user stories from the project brief — such as third-party payment processing (PayPal/Stripe) and fully automated recurring billing — depend on backend/payment-gateway integration. Check `src/store/slices/donationSlice.js` to see what is currently wired to live services versus demo data.

## Tech Stack

**Frontend (this repo)**
- **[React 19](https://react.dev/)** — UI library
- **[Vite](https://vitejs.dev/)** — Build tool and dev server
- **[React Router v7](https://reactrouter.com/)** — Client-side routing
- **[Redux Toolkit](https://redux-toolkit.js.org/)** + **React Redux** — Global state management, per the project's technical requirements
- **[Tailwind CSS v4](https://tailwindcss.com/)** — Utility-first styling
- **[Recharts](https://recharts.org/)** — Charts and data visualization
- **[Motion](https://motion.dev/)** — Animations
- **[Lucide React](https://lucide.dev/)** — Icon set
- **[canvas-confetti](https://www.npmjs.com/package/canvas-confetti)** — Celebration effects
- **ESLint** — Linting
- **Jest** — Frontend testing framework (see `src/__tests__/`)

**Project-wide stack (per specification)**
- **Backend:** Python Flask
- **Database:** PostgreSQL
- **Backend testing:** Minitest
- **Wireframes:** Figma (mobile-friendly)

> The project brief specifies that frontend and backend should live in the same repository. This repo currently contains the frontend only — confirm with your team whether it should be merged into a monorepo with the Flask backend, or kept as a separate repo linked from a parent project.

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
│   ├── __tests__/             # Jest test files
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
| `adminSlice` | Admin panel state (charity application review) |
| `notificationSlice` | In-app notifications |
| `languageSlice` | Active language / locale |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- npm (bundled with Node.js)
- A running instance of the [Flask backend](#tech-stack) if you need live data rather than demo/mock data

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd TUINUIE-WASICHANA-frontend

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

### Testing

```bash
# Run the Jest test suite
npm test
```

> If a `test` script is not yet defined in `package.json`, add one (e.g. `"test": "jest"`) once Jest is configured, per the project's testing requirements.

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

## Team Workflow (per project expectations)

- **Branching:** Follow the [Gitflow workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow) for managing features, branches, and pull requests.
- **Commits & PRs:** Keep commit messages and PR descriptions consistent and descriptive.
- **CI/CD:** Use GitHub Actions for automated testing and deployment (see `.github/`).
- **Reviews:** All PRs are reviewed by the Team Mentor and Scrum Master before merging.
- **Backend pagination:** Any backend API listing endpoint should paginate results to simulate handling large record sets.

## Notes

- This project was bootstrapped from the standard Vite + React template and extended with Tailwind CSS, Redux Toolkit, and routing.
- Some data in the app currently ships with demo/mock values for local development — check individual slices under `src/store/slices/` before connecting to a live backend.

## License

No license file is currently included in this repository. Add one if you intend to distribute this project publicly.
