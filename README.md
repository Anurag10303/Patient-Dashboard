# 🏥 Patient Dashboard

A modern, performant patient records management system built with **Next.js 16**, **TypeScript**, and **TailwindCSS**. Features real-time search, multi-field filtering, CSV export, and a polished pastel UI with smooth animations.

**Live Demo:** [Patient Dashboard](https://patient-dashboard-beta-self.vercel.app/)
**Repository:** [github.com/Anurag10303/patient-dashboard](https://github.com/Anurag10303/patient-dashboard)

---

## ✨ Features

- **Dual View Modes** — Toggle between card grid and table list layout
- **Debounced Search** — Search by patient name or email with 300ms debounce (no external library)
- **Multi-field Filtering** — Filter by medical condition and age range simultaneously
- **Multi-field Sorting** — Sort by name or age in ascending/descending order
- **Pagination** — Server-side pagination with ellipsis navigation (20 records/page)
- **Stats Dashboard** — At-a-glance metrics: total patients, average age, top condition, missing contacts
- **CSV Export** — Download current filtered results as a `.csv` file
- **Keyboard Shortcut** — `Ctrl+K` / `Cmd+K` to instantly focus the search bar
- **Smooth Transitions** — Fade animations on data updates, staggered card entrances
- **Loading Skeletons** — Shimmer placeholders during data fetch
- **Error Handling** — Graceful error states with retry capability
- **Empty States** — Contextual empty state with filter reset action
- **Fully Typed** — Strict TypeScript throughout with no `any` usage

---

## 🛠 Tech Stack

| Category | Technology |
| --------- | ----------------------------------------------------------- |
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| Language | [TypeScript](https://www.typescriptlang.org/) (strict mode) |
| Styling | [TailwindCSS v4](https://tailwindcss.com/) + inline styles |
| Fonts | Playfair Display + Nunito (Google Fonts) |
| API | Next.js Route Handlers |
| Deployment | [Vercel](https://vercel.com/) |

---

## 📁 Project Structure
```
patient-dashboard/
│
├── data/
│   └── MOCK_DATA.json          # Source dataset — 1,000 patient records
│
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── patients/
│   │   │       └── route.ts    # GET /api/patients — search, filter, sort, paginate
│   │   ├── globals.css         # Global styles, CSS variables, animations
│   │   ├── layout.tsx          # Root layout with font imports
│   │   └── page.tsx            # Main dashboard page (client component)
│   │
│   ├── components/
│   │   ├── Filters.tsx         # Condition dropdown + age range inputs + sort controls
│   │   ├── Pagination.tsx      # Page navigation with ellipsis logic
│   │   ├── PatientCard.tsx     # Card layout for individual patient
│   │   ├── PatientRow.tsx      # Table row layout for individual patient
│   │   ├── SearchBar.tsx       # Debounced search input
│   │   └── StatsBar.tsx        # Summary metrics (total, avg age, top condition, no contact)
│   │
│   ├── types/
│   │   └── patient.ts          # TypeScript interfaces for Patient, Contact, API response
│   │
│   └── utils/
│       └── exportCsv.ts        # Pure JS CSV export utility (no external library)
│
├── public/                     # Static assets
├── .gitignore
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── tsconfig.json               # Strict mode enabled
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) — v18.17 or higher
- [npm](https://www.npmjs.com/) — v9 or higher (comes with Node.js)

Verify your versions:
```bash
node --version   # should be >= 18.17.0
npm --version    # should be >= 9.0.0
```

---

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/Anurag10303/patient-dashboard.git
cd patient-dashboard
```

**2. Install dependencies**
```bash
npm install
```

**3. Verify the data file exists**

Ensure `MOCK_DATA.json` is present at the project root inside a `data/` folder:
```
patient-dashboard/
└── data/
    └── MOCK_DATA.json    ✅ required
```

**4. Start the development server**
```bash
npm run dev
```

**5. Open in browser**
```
http://localhost:3000
```

---

### Available Scripts

| Script | Description |
| --------------- | --------------------------------------- |
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Create optimised production build |
| `npm run start` | Start production server (after build) |
| `npm run lint` | Run ESLint across the codebase |

---

## 🔌 API Reference

### `GET /api/patients`

Returns a paginated, filtered, and sorted list of patients.

#### Query Parameters

| Parameter | Type | Default | Description |
| ----------- | ------------------------- | ---------------- | --------------------------------- |
| `page` | `number` | `1` | Page number (1-indexed) |
| `limit` | `number` | `20` | Records per page |
| `search` | `string` | `""` | Search by patient name or email |
| `issue` | `string` | `""` | Filter by exact medical condition |
| `minAge` | `number` | `""` | Filter patients aged ≥ minAge |
| `maxAge` | `number` | `""` | Filter patients aged ≤ maxAge |
| `sortBy` | `"patient_name" \| "age"` | `"patient_name"` | Field to sort by |
| `sortOrder` | `"asc" \| "desc"` | `"asc"` | Sort direction |

#### Example Requests
```bash
# Get page 1 with default settings
GET /api/patients

# Search for "John" with fever condition
GET /api/patients?search=john&issue=fever

# Patients aged 20–40, sorted by age descending
GET /api/patients?minAge=20&maxAge=40&sortBy=age&sortOrder=desc&page=1&limit=10
```

#### Response Schema
```json
{
  "data": [
    {
      "patient_id": 1,
      "patient_name": "Zoe Normanvill",
      "age": 77,
      "photo_url": "https://...",
      "contact": [
        {
          "address": "5 Moulton Hill",
          "number": "157-677-1133",
          "email": "example@email.com"
        }
      ],
      "medical_issue": "fever"
    }
  ],
  "total": 142,
  "page": 1,
  "totalPages": 8,
  "stats": {
    "totalAll": 1000,
    "avgAge": 52,
    "topCondition": "fever",
    "noContact": 87
  }
}
```

---

## 🏗 Architecture & Design Decisions

### 1. Server-side Filtering via Route Handler

All search, filter, sort, and pagination logic runs **inside the API route**, not the client. This means:

- The browser never receives all 1,000 records
- Network payload stays small (20 records per response)
- Logic is testable and reusable independently of the UI

### 2. Client-side State with `useState` + `useEffect`

Since filters change frequently through user interaction, **SSR offers no benefit** here. Instead, a single `filters` state object in `page.tsx` drives all fetches. When any filter changes, the page resets to 1 and re-fetches.

This avoids unnecessary complexity (no Redux, Zustand, or React Query) while keeping the data flow easy to follow.

### 3. Debounced Search Without External Libraries

The assignment explicitly requires custom implementation. `SearchBar.tsx` uses `useRef` to hold a `setTimeout` reference, clearing and resetting it on each keystroke. The fetch only fires **300ms after the user stops typing**.

### 4. Single Source of Truth for Filters

All filter state lives in one object:
```ts
const [filters, setFilters] = useState<FilterState>({
  search,
  issue,
  minAge,
  maxAge,
  sortBy,
  sortOrder,
  page,
  limit,
});
```

Every control calls `updateFilter(key, value)` which also resets `page` to `1`, preventing stale pagination.

### 5. Smooth Transitions on Refetch

Instead of re-showing full skeletons on every filter change, the UI fades out existing results (180ms), fetches new data, then fades back in. This creates a polished experience without third-party animation libraries.

### 6. Stats Computed from Full Dataset

The stats bar (total patients, average age, top condition) always reflects **all 1,000 records**, not the filtered subset. This is intentional — stats provide global context regardless of active filters.

### 7. CSV Export with Native Browser APIs

`exportCsv.ts` uses `Blob` and `URL.createObjectURL` — no libraries. It exports only the **current page** of filtered results, giving the user exactly what they see on screen.

---

## 🎨 Design System

### Color Palette

| Token | Value | Usage |
| ------------------ | --------- | ------------------------------ |
| `--bg` | `#f5f0ff` | Page background |
| `--surface` | `#ffffff` | Cards, panels |
| `--accent` | `#9b6dff` | Primary actions, active states |
| `--accent2` | `#ff7eb3` | Secondary highlights |
| `--text-primary` | `#2d2440` | Headings, body text |
| `--text-secondary` | `#7c6f99` | Labels, metadata |
| `--text-muted` | `#b3a8cc` | Placeholders, disabled |

### Typography

- **Display / Headings** — [Playfair Display](https://fonts.google.com/specimen/Playfair+Display) (Serif, 600–800)
- **Body / UI** — [Nunito](https://fonts.google.com/specimen/Nunito) (Sans-serif, 300–700)

### Animations

| Class | Effect | Duration |
| ----------------- | ------------------------ | ------------------ |
| `.card-enter` | Fade + slide up on mount | 450ms |
| `.header-enter` | Fade + slide down | 500ms |
| `.controls-enter` | Fade in with slight rise | 500ms, 150ms delay |
| `.skeleton` | Shimmer sweep | 1600ms loop |
| `.blob1/.blob2` | Floating background orbs | 8–10s loop |

---

## 🚢 Deployment

This project is deployed on **Vercel**.

### Deploy Your Own

**Option 1 — Vercel CLI**
```bash
npm i -g vercel
vercel
```

**Option 2 — Vercel Dashboard**

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import your repository
4. Vercel auto-detects Next.js — click **Deploy**

> ⚠️ **Important:** The `data/MOCK_DATA.json` file must be committed to your repository. Vercel reads it at runtime via `process.cwd()`.

---

## 📋 Assignment Checklist

| Requirement | Status |
| --------------------------------------- | ------------------------ |
| Next.js App Router | ✅ |
| TypeScript (strict) | ✅ |
| TailwindCSS | ✅ |
| Local API endpoint (Route Handler) | ✅ |
| Serve data from JSON file | ✅ |
| Pagination with limit/offset support | ✅ |
| Search functionality | ✅ |
| Filter by 2+ fields | ✅ condition + age range |
| Sort by 2+ fields | ✅ name + age |
| No external libraries for core features | ✅ |
| Loading states | ✅ shimmer skeletons |
| Error handling | ✅ |
| **Bonus:** Both card + row views | ✅ |
| **Bonus:** Debounced search | ✅ 300ms |
| **Bonus:** Responsive design | ✅ |
| **Bonus:** TypeScript strict typing | ✅ |
| **Bonus:** Performance (memoization) | ✅ `useCallback` |
| **Bonus:** Stats dashboard | ✅ |
| **Bonus:** CSV export | ✅ |
| **Bonus:** Keyboard shortcut | ✅ Ctrl+K |

---

## 👤 Author

**Anurag Singh**
📧 anuragsingh22230@gmail.com
🔗 [linkedin.com/in/anurag-singh-34526a248](https://www.linkedin.com/in/anurag-singh-34526a248/)
🐙 [github.com/Anurag10303](https://github.com/Anurag10303)

---
