# Deploy — Trend Court

Team Mind Flayer, NASA Space Apps Challenge 2026.
Repo: https://github.com/AreebaGhaffar/trend-court.git
Local repo: `trend-court-app/` on branch `main`.

## Versions (Areeba's — do not change without asking her first)

- Node v24.19.0 (`.nvmrc`), npm 11.17.0, Python 3.12.9, Git 2.55.0, VS Code 1.145.2
- React 18.3.1, react-router-dom 6.28.0, framer-motion 11.11.17,
  recharts 2.13.3, vite 5.4.11, typescript 5.6.3 (all pinned in `package.json`)

## Build locally first

```bash
node --version   # expect v24.19.0
npm ci           # exact versions from package-lock.json — never `npm install`
npm run build    # tsc + vite build → dist/
npm run preview  # smoke-test the production build locally
```

## Deploy to Vercel (exact settings)

1. Go to https://vercel.com/new and import the GitHub repo
   `AreebaGhaffar/trend-court` (public).
2. Framework Preset: **Vite**
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Install Command: `npm ci`
6. Deploy. No environment variables are needed — all data is in
   `src/data/trends.json`, no backend server, no API keys.

HashRouter note: the app uses `HashRouter`, so routing works on any static
host — no server rewrites / `vercel.json` needed. URLs look like
`https://<your-app>.vercel.app/#/trial`.

## Sunday checklist — submit by 20:00 PKT, hard close 23:59 PKT, Sun Nov 15

- [ ] Freeze features and pages at midday Sunday — bug fixes only after that.
- [ ] `npm run build` passes; `dist/` is the deployed build.
- [ ] Live Vercel link opens **logged out**, on a phone AND a laptop, no password.
- [ ] Open **every page logged out** and follow every nav link:
      Home, Trial, Evidence, Verdict, Method Lab, About.
- [ ] Every number is identical on every page and matches `trends.json`:
      temperature −0.054 °C/yr, 99.4%; rainfall +13.5 mm/yr, 99.95%;
      both verdicts "Not Proven — Don't trust it yet".
- [ ] Change-points quoted are the Pettitt-confirmed ones only:
      temperature new regime 2011 (K=111, p≈0.035),
      rainfall new regime 2019 (K=117, p≈0.022).
      Do NOT quote 2020 as the change-point year; do NOT claim a
      coincident shift — the two change-points are 8 years apart.
- [ ] Demo is a video of **30 seconds or less**, OR a deck of 7 slides or fewer.
      Record ONE click-path only: Home → Trial → Verdict. Do not tour the
      other pages in the video.
- [ ] Demo link opens logged out.
- [ ] Rainfall is described as POWER model/reanalysis (PRECTOTCORR), never as
      rain-gauge data. Temperature fall carries the MODIS cross-check caveat;
      do not use it to relax heat planning.
- [ ] No Bayesian posterior, MODIS result, or GRACE result is claimed unless
      actually computed and recorded in `trends.json` — none is, so do not claim any.
- [ ] NASA data use (NASA POWER, T2M + PRECTOTCORR, Faisalabad 31.42°N, 73.08°E,
      2000–2025) and the AI-use declaration are pasted into the submission.
- [ ] Public code repository link is included and opens logged out:
      https://github.com/AreebaGhaffar/trend-court.git
- [ ] Both registered members are listed on the Project Page for the same
      Local Event (Faisalabad). No new members can be added after submission closes.
- [ ] On the Project Page: use the edit Lock toggle while one member edits,
      Save Progress often, and Publish — changes are not live until published.
- [ ] Submit by **Sun Nov 15, 20:00 PKT** (hard close 23:59 PKT) and confirm
      the submission banner. Projects can be edited/resubmitted until the
      hackathon ends, but 20:00 is the target, not the deadline.

## Still left after this file (not done here)

- Record the 30-second demo video (script in the Trend Court plan doc).
- Deploy `dist/` to Vercel as above and test the live link logged out.
- Paste the submission copy from the Trend Court plan doc into the NASA
  Project Page and submit by 20:00 PKT Sunday.
