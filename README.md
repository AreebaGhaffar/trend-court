# Trend Court — Faisalabad on Trial

**NASA International Space Apps Challenge 2026 · Team Mind Flayer**
Challenge: **“Be An Earth System Trend Detective!”**

Every climate trend for Faisalabad, 2000–2025, is put on trial. The data is
the evidence. The tool shows the probability the trend is real, when it may
have started, and a plain verdict — Proven, Not Proven, or Too Weak to Trust —
so a planner knows whether it is strong enough to act on.

## The verdicts (the only numbers the app may use)

All numbers come from `src/data/trends.json` (NASA POWER, Faisalabad
31.42°N, 73.08°E, 2000–2025). Nothing in the app quotes a number that is not
in that file.

| Defendant | Trend, 2000–2025 | Hamed-Rao p | Verdict |
| --- | --- | --- | --- |
| Temperature (T2M) | −0.054 °C/yr | ≈ 0.0057 | Not Proven — Don’t trust it yet |
| Rainfall (PRECTOTCORR) | +13.5 mm/yr | ≈ 0.0005 | Not Proven — Don’t trust it yet |

Both are significant on the full period after autocorrelation correction, but
neither is significant on 2000–2019 alone — the change is driven by the
2020s. Displayed confidence = (1 − p) × 100 (99.4% / 99.95%): a frequentist
confidence approximation, **not** a Bayesian posterior. Change-point around
2020 is a candidate, not proven. POWER rainfall is model/reanalysis, not
rain-gauge data. The cooling needs a MODIS cross-check — do not relax heat
planning.

## Setup — install exactly these versions

This repo was built by Muse (paired with Member 1). **Do not set up versions
yourself — install exactly the versions in this repo**, so nothing conflicts.

Pinned in `package.json` (exact versions, no `^` ranges):

| Package | Version |
| --- | --- |
| react / react-dom | 18.3.1 |
| react-router-dom | 6.28.0 |
| framer-motion | 11.11.17 |
| recharts | 2.13.3 |
| vite | 5.4.11 |
| @vitejs/plugin-react | 4.3.3 |
| typescript | 5.6.3 |
| @types/react | 18.3.12 |
| @types/react-dom | 18.3.1 |

`.nvmrc` pins **Node 24.19.0**.

### Commands (run in this folder)

```bash
node --version   # expect v24.19.0 (24.19.0 in .nvmrc)
npm --version
npm ci           # installs exactly what package-lock.json pins — use this, not npm install
npm run dev      # local dev server, open the http://localhost:5173 link it prints
npm run build    # production build into dist/
npm run preview  # serve the production build locally to check it
```

> Build verified by Muse on **Node v24.22.1 / npm 10.9.4** (the machine that
> generated `package-lock.json`). The pinned dependencies are the same on
> Node 24.19.0 — if `npm ci` works, `npm run build` works. If you use nvm:
> `nvm install && nvm use` reads `.nvmrc` and gives you Node 24.19.0.

## Pages (6 routes, shared top nav)

| Route | Page |
| --- | --- |
| `/` | Home / Case Board — the court, the defendants |
| `/trial` | The Trial — pick a defendant, see the evidence + verdict stamp |
| `/evidence` | Evidence Vault — both charts, full / sub-period / drop-2020 checks |
| `/verdict` | Verdict & Planner Action — what to do / not do |
| `/lab` | Method / Change-Point Lab — the test, the confidence label, the candidate change-point |
| `/about` | Data & Caveats — sources, caveats, not-tested list, AI-use declaration |

Design: dark navy `#0A1128`, gold `#C9A227`, paper `#F5F1E8`, Playfair
Display headings, Inter for data. Framer Motion: page transitions
(0.4s), `layoutId` shared-element defendant card Home → Trial, gavel
verdict stamp, Recharts line that draws in, staggered entrances.

## Deploy

`npm run build` produces `dist/`. Deploy that folder to Vercel (import the
repo, framework preset “Vite”, build command `npm run build`, output
directory `dist`). Test the live link logged out, on phone and laptop.

## Still to do (for Areeba)

- [ ] Record the 30-second demo video (script is in the Trend Court plan doc)
- [ ] Deploy and test the public link logged out
- [ ] Paste the submission copy from the plan doc into the NASA project page
- [ ] Submit by **Sunday 15 Nov, 8:00 pm PKT** (hard close 11:59 pm PKT)
- [ ] Optional: run a named change-point test (e.g. Pettitt’s) and record its
      output in `src/data/trends.json` before quoting a change-point year
