# Trend Court — Faisalabad on Trial

Team Mind Flayer · NASA Space Apps Challenge 2026 · Challenge: "Be An Earth System Trend Detective!"

A multi-page courtroom app that puts Faisalabad's climate trends (NASA POWER, 2000–2025) on
trial and returns a plain verdict — Proven, Not Proven, or Too Weak to Trust — so a city water
and drainage planner knows whether a trend is strong enough to act on.

## Branches — read this first

- `main` — scaffold base only. **Do not build Member 2's work here.**
- `member2/frontend-story` — **Member 2 (Frontend and story): all UI work lives here.**
  The team merges this branch later, in person. Muse will not merge it.
- Member 1's data/backend work should go on its own branch. The only shared contract
  between the branches is `public/trends.json`.

## Run it (VS Code or any terminal)

Requirements: **Node.js 24.22.x** and Git 2.43+. Open this folder in VS Code, then:

```bash
npm install
npm run dev        # local dev server
npm run build      # production build (verified working)
npm run preview    # serve the production build
```

Pinned versions (do not upgrade during the hackathon): React 19.3.1, Vite 8.3.8,
@vitejs/plugin-react 6.3.0, react-router 8.5.1, Recharts 3.10.1.

## The one rule: trends.json is the only source of numbers

Every number on every page is fetched at runtime from `public/trends.json`.
No number is hard-coded in a component.

- The file currently in the repo is a **starter file using only the numbers in the
  locked plan**, marked `"status": "STARTER FILE …"` in its meta.
- The locked plan does **not** contain the full 26-value annual series, so the chart
  component plots only the tested period means (2000–2004 vs 2021–2025) for now.
  It **never invents annual values**.
- When Member 1 freezes the real file, replace `public/trends.json` with it,
  including `annual_series` (26 values per defendant) and the change-point test
  output. The annual line chart with the 2020s shaded then renders automatically —
  no page code changes.

## Routes

| Route | Page |
| --- | --- |
| `/` (and `/home`) | Home / Case Board |
| `/trial?defendant=rainfall` | The Trial (default defendant: Rainfall — the demo path) |
| `/evidence` | Evidence Vault |
| `/verdict?defendant=rainfall` | Verdict & Planner Action |
| `/lab` | Method / Change-Point Lab |
| `/about` | About / Data & Caveats |

Demo click-path (30 seconds, one path only): Home → Put on Trial for Rainfall →
Trial → See the verdict → Verdict. Script is in the locked plan document.

## Deploying

Static build (`dist/`). `vercel.json` and `public/_redirects` are included so deep
links to the six routes work on Vercel or Netlify. The live app must work logged
out — test every route on phone and laptop before submitting.

## Merging Member 2's branch later

1. Member 1 replaces `public/trends.json` with the frozen file on their branch / in the merge.
2. Open a pull request from `member2/frontend-story` into `main`.
3. Check every page shows identical numbers from the merged `trends.json`.
4. Run `npm run build`, test all six routes logged out, then merge.
