# 🗳️ Votify — Smart Online Voting System (React Frontend)

> **Core Stack:** React.js (Vite), React Router DOM, Pure Plain CSS embedded directly in `.jsx` files, JavaScript (Zero External UI Frameworks, zero Tailwind/PostCSS build step).

The app ships with **no seeded data and no demo accounts** - an admin registers, creates the election categories, approves candidate nominations, and voters sign up and cast ballots from there. `src/data/mockData.js` holds the (currently empty) seed arrays if you want to preload a sample data set.

This build merges two prototypes into one app: all of the inner dashboard/admin/candidate/voter pages come from the original SmartVote/Votify build, and the auth screen has been redesigned after a second Votify prototype's "civic ledger" (dark ink + gold + paper) login page. A public marketing landing page (`/`) was added on top. The platform is organisation-agnostic: leadership, committee, union, club, and community elections all run through the same flow.

---

## 🧩 React Patterns Used

Where each core React concept shows up in this codebase:

* **HTML5 / CSS3 / responsive design** — `Home.jsx` uses semantic `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>` tags, with a mobile-first responsive layout and media queries (see its embedded `<style>` block).
* **React fundamentals** — JSX, props, conditional rendering, and list rendering (`.map()`) throughout every page and card component.
* **Hooks** — `useState`, `useEffect`, `useRef`, `useMemo`, and `useCallback` are all used deliberately in `src/pages/Home.jsx` (scroll listener, rotating fact strip, derived stats, scroll-to-section handlers) and `src/pages/CandidatePublic.jsx` (`useMemo` to look up a candidate by route param).
* **Custom hooks** — `src/hooks/useCountdown.js` (countdown timer logic, reused by `CountdownTimer.jsx`) and `src/hooks/useScrollReveal.js` (IntersectionObserver-based scroll-reveal animation, wrapped by `src/components/common/Reveal.jsx`).
* **Lifting state up / Context API** — `AuthContext`, `ThemeContext`, and `VotingContext` share state across the whole app instead of prop-drilling.
* **React Router** — nested routes (`/admin/*`, `/candidate/*`, `/voter/*`), a **dynamic route with route params** (`/candidates/:candidateId` in `CandidatePublic.jsx`, read via `useParams()`), protected/role-based routes (`ProtectedRoute.jsx`, `RoleRoute.jsx`), and a 404 fallback (`NotFound.jsx`).

---

## 🌟 Highlights & Key Features

* 🔐 **"Civic Ledger" Auth Hub (`/`, `/login`, `/signup`)**:
  * Split-screen dark ink/gold/paper login screen, brand + election copy on the left, floating auth card on the right.
  * Role Tabs for **Voter**, **Candidate**, and **Admin**.
  * Dynamic form switching between **Login** and **Signup** with custom input validation.
  * Candidate notice banner: *"Application will be reviewed by Admin"*.
  * Admin security token verification field (`AD-SECURE-909`).

* 🛠️ **Admin Portal (`/admin/*`) — 9 Pages**:
  * `/admin/dashboard`: Live stats, turnout charts, recent audit logs.
  * `/admin/categories`: Category management with Add/Edit modals, start/end dates, and delete actions.
  * `/admin/candidates`: Applications table/cards with instant Approve and Reject (with grounds) modal.
  * `/admin/voters`: Comprehensive voter directory with KYC status badges, voting status, search/filter, and block toggles.
  * `/admin/results`: Live vote tabulation, candidate ranking cards, category breakdowns, and 🏆 Winner badges.
  * `/admin/announcements`: Post broadcast alerts with priority tags (High / Medium / Low).
  * `/admin/activity-logs`: System audit trail with client IP logs, timestamps, and CSV export simulation.
  * `/admin/profile`: Chief Administrator profile details.
  * `/admin/settings`: System governance configuration and a reset-data button.

* 📢 **Candidate Portal (`/candidate/*`) — 6 Pages**:
  * `/candidate/dashboard`: Nomination status banner (`Pending` / `Approved` / `Rejected`), profile completion meter, and milestone timeline.
  * `/candidate/apply`: Open post directory with application deadline countdowns and candidacy nomination modal.
  * `/candidate/campaign`: Campaign editor with symbol selector, manifesto writer, and live voter ballot preview.
  * `/candidate/votes`: Live vote count, position ranking, vote share %, and category statistics.
  * `/candidate/results`: Results race standings.
  * `/candidate/profile`: Official candidate credentials and documentation.

* 🗳️ **Voter Portal (`/voter/*`) — 5 Pages & Interactive Voting Flow**:
  * `/voter/dashboard`: Personalized welcome banner, active elections list, upcoming elections, and notices.
  * `/voter/categories`: Real-time contested posts with live countdown timers and "Vote Now" action.
  * **3-Step Voting Experience**:
    1. `VotingModal`: View candidate photos, election symbols, and manifestos.
    2. `ConfirmVoteModal`: Irreversible warning dialog (*"You are voting for [Candidate Name]. This action cannot be undone."*).
    3. `VoteSuccessModal`: Official receipt generation with **Receipt ID (e.g. `DEMO-VOTE-8F42K9`)**, cryptographic SHA-256 hash, and print receipt action.
  * `/voter/history`: Complete voting history table with verified status and receipt inspection.
  * `/voter/results`: Real-time public election results with winner badges.
  * `/voter/profile`: Voter identity card, KYC clearance badge, and password updater.

* 🎨 **Rich Aesthetics & Plain CSS Design System**:
  * Custom dark and light theme engine persisted in `localStorage`.
  * Mobile-responsive bottom navigation bar and collapsible desktop sidebar.

---

## 🚀 How to Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Start the Vite development server
npm run dev

# 3. Build production bundle (optional validation)
npm run build
```

---

## 🗂️ Project Directory Structure

```text
smart-voting-system/
├── public/
│   └── favicon.svg
├── src/
│   ├── assets/
│   │   ├── icons/
│   │   │   └── index.jsx (Custom SVG Icon Library)
│   │   └── images/
│   ├── components/
│   │   ├── common/
│   │   │   ├── StatCard.jsx
│   │   │   ├── CategoryCard.jsx
│   │   │   ├── CandidateCard.jsx
│   │   │   ├── StatusBadge.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── ConfirmModal.jsx
│   │   │   ├── Toast.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── NotificationDropdown.jsx
│   │   │   ├── ProfileDropdown.jsx
│   │   │   ├── CountdownTimer.jsx
│   │   │   ├── ChartCard.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   ├── Loader.jsx
│   │   │   ├── InputField.jsx
│   │   │   ├── PasswordField.jsx
│   │   │   └── ProfileView.jsx
│   │   ├── layout/
│   │   │   ├── AdminLayout.jsx
│   │   │   ├── CandidateLayout.jsx
│   │   │   ├── VoterLayout.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Topbar.jsx
│   │   │   └── BottomNav.jsx
│   │   ├── auth/
│   │   │   ├── AuthCard.jsx
│   │   │   ├── RoleTabs.jsx
│   │   │   ├── LoginForm.jsx
│   │   │   └── SignupForm.jsx
│   │   ├── admin/
│   │   │   ├── AddCategoryModal.jsx
│   │   │   ├── RejectionModal.jsx
│   │   │   └── CandidateDetailModal.jsx
│   │   ├── candidate/
│   │   │   └── ApplyModal.jsx
│   │   └── voter/
│   │       ├── VotingModal.jsx
│   │       ├── ConfirmVoteModal.jsx
│   │       └── VoteSuccessModal.jsx
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   ├── ThemeContext.jsx
│   │   └── VotingContext.jsx
│   ├── data/
│   │   ├── mockData.js
│   │   └── seedVersion.js
│   ├── pages/
│   │   ├── auth/
│   │   │   └── AuthPage.jsx
│   │   ├── admin/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AdminCategories.jsx
│   │   │   ├── AdminCandidates.jsx
│   │   │   ├── AdminVoters.jsx
│   │   │   ├── AdminResults.jsx
│   │   │   ├── AdminAnnouncements.jsx
│   │   │   ├── AdminActivityLogs.jsx
│   │   │   ├── AdminProfile.jsx
│   │   │   └── AdminSettings.jsx
│   │   ├── candidate/
│   │   │   ├── CandidateDashboard.jsx
│   │   │   ├── CandidateApply.jsx
│   │   │   ├── CandidateCampaign.jsx
│   │   │   ├── CandidateVotes.jsx
│   │   │   ├── CandidateResults.jsx
│   │   │   └── CandidateProfile.jsx
│   │   ├── voter/
│   │   │   ├── VoterDashboard.jsx
│   │   │   ├── VoterCategories.jsx
│   │   │   ├── VoterHistory.jsx
│   │   │   ├── VoterResults.jsx
│   │   │   └── VoterProfile.jsx
│   │   └── NotFound.jsx
│   ├── routes/
│   │   ├── AppRoutes.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── RoleRoute.jsx
│   ├── styles/
│   │   └── GlobalStyles.jsx  (entire design system, embedded as a <style> tag — no external .css files)
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

---

## 🔮 Next Phase Architecture Blueprint (Full Stack)

In subsequent phases, the frontend is structured to easily integrate:
```text
React Frontend (Vite)
       ↓
REST API / Axios Service Layer
       ↓
Node.js + Express Server (Controllers, Middleware)
       ↓
MongoDB + Mongoose Models (Users, Categories, Candidates, Ballots, Receipts, Logs)
       ↓
JWT Authentication & Password Hashing (bcrypt)
       ↓
Immutable Ledger & Zero-Knowledge Verification
```

---

## State management (Component 2 rubric map)

| Rubric item | Where |
|---|---|
| React-Navigation layout & page structure | `src/routes/AppRoutes.jsx` (nested routes, `RoleRoute`, `AppLayout` + `Outlet`, `/candidates/:candidateId`) |
| Context API & state architecture | `src/context/AppContext.jsx` (`AuthContext`, `ThemeContext`) |
| Redux Toolkit | `src/store/` (`configureStore`, `votingSlice` with `createSlice`), `<Provider>` in `src/App.jsx` |
| Form handling | `src/components/auth/AuthComponents.jsx`, `src/components/common/FormFields.jsx`, apply/campaign/category forms |

`useVoting()` still exposes the same API as before, but now reads from the Redux store (`useSelector`) and writes with `dispatch`. Data is persisted to `localStorage` by a store subscriber.

After unzipping run `npm install` (adds `@reduxjs/toolkit` and `react-redux`) and then `npm run dev`.
