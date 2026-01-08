# Copilot / Agent instructions for nekretnineNs

Short, actionable notes for an AI coding agent working in this repo.

## Big picture 🧭
- This repo is a small two-part app:
  - `backend/` — minimal Express API that reads `oglasi.json` and exposes endpoints used by the frontend. Run on `http://localhost:3001`.
  - `fronted/` — a React + Vite single-page app (note folder name is `fronted` not `frontend`) that fetches the backend and renders pages.
- Data is authored as XML in `backend/oglasi.xml`; conversion script `backend/convertXmlToJson.cjs` writes `oglasi.json`.

## How to run locally ▶️
- Backend:
  - Install and run from `backend/` (if not installed):
    - `npm install`
    - Dev: `npm run dev` (uses `nodemon server.cjs`)
    - Start: `npm start` (runs `node server.cjs`).
  - The server listens on port `3001` and exposes endpoints documented below.
  - Regenerate JSON from XML: `node convertXmlToJson.cjs` (reads `oglasi.xml` -> writes `oglasi.json`).

- Frontend:
  - From `fronted/`:
    - `npm install`
    - Dev server: `npm run dev` (Vite) — typically on `http://localhost:5173`
    - Build: `npm run build`
    - Preview static build: `npm run preview`
    - Lint: `npm run lint` (ESLint configured)

- Typical developer flow: run frontend dev server + backend dev server in two terminals.

## Important backend endpoints (examples) 🔌
- GET `/oglasi/prodaja` — all items with `vrstaponude === "prodaja"`
- GET `/oglasi/izdavanje` — all items with `vrstaponude === "izdavanje"`
- GET `/oglasi/topponude?count=N` — top N by parsed numeric price (defaults to 3)
- GET `/oglasi/:id` — get single listing by `id` or fallback `code`

Example frontend calls you can search for:
- `fetch('http://localhost:3001/oglasi/prodaja')` (see `fronted/src/pages/ProdajaPage.jsx`)
- `fetch('http://localhost:3001/oglasi/topponude?count=3')` (see `TopPonudePage.jsx`)

## Data shape & normalization notes 🧩
- Listings originate from XML and are somewhat inconsistent; code normalizes various field names:
  - `naslov` / `title`, `cena` / `price`, `slike.slika[].url` or `image` / `images`
  - Location pieces: `mesto`, `naselje`, `grad` are concatenated into a location string
  - `SinglePege.jsx` contains a robust `normalize` helper — follow that pattern when reading items
- Price handling: backend/topponude parses price strings to numbers by stripping non-digits; frontend also has formatting helpers using `Intl.NumberFormat('de-DE')`.

## Conventions & patterns ✅
- Frontend uses React + Vite + Tailwind; all styles live in `fronted/src` and Tailwind is configured at `fronted/tailwind.config.js`.
- Translations: `fronted/src/i1n8.js` exports translation objects and the code uses `t(key, fallback)` to read strings — add new keys here when adding UI text.
- Routing: `react-router-dom` pages are under `fronted/src/pages` (e.g., `ProdajaPage.jsx`, `IzdavanjePage.jsx`, `SinglePege.jsx`).
- Backend is CommonJS (`.cjs`) while frontend is ESM (`type: module`) — prefer keeping new backend files as `.cjs` unless you change package type.

## Files to inspect first (high ROI) 🔎
- `backend/server.cjs` — API logic and filtering
- `backend/convertXmlToJson.cjs` & `backend/readXml.cjs` — XML parsing and JSON generation
- `backend/oglasi.xml` / `backend/oglasi.json` — source data
- `fronted/src/pages/SinglePege.jsx` — data normalization and how the UI expects fields
- `fronted/src/pages/TopPonudePage.jsx` — top offers usage & UI patterns
- `fronted/src/i1n8.js` — localization source

## Developer gotchas & quick tips ⚠️
- There is **no** environment variable for the API base URL; the frontend uses `http://localhost:3001` directly. If you change backend port or run remotely, update calls or add a small `config` module / `.env` and replace hard-coded strings.
- Folder name `fronted/` is non-standard; CI scripts or external tooling may assume `frontend/` — be careful when adding scripts that assume the conventional path.
- There are no tests or CI files in the repo — new features should include basic linting and (preferably) a small test or manual verification instructions in PRs.

## If modifying data or API
- If you change XML structure, update `backend/convertXmlToJson.cjs` and verify `fronted` normalization (look at `SinglePege.jsx` normalization logic).
- When changing backend response shapes, update frontend normalization helpers to maintain backward compatibility.

---
If any section is unclear or you'd like additional examples (e.g., a recommended env-based API config, or a sample fetch wrapper), say which area and I'll iterate on the file. ✅
