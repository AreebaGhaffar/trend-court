# QA — Sunday checklist and overnight verification record

Project: Trend Court — Faisalabad on Trial · Team Mind Flayer
Branch: **member2/frontend-story only** (no merge, no push, no submission —
per the user's overnight authorisation)

## What was actually checked overnight, and the results

### Build

- [x] `npm run build` — **PASS** (Vite 8.3.8, Node v24.22.1). One non-blocking
      warning: the JS bundle is larger than 500 kB because of Recharts.
      Cosmetic for the hackathon; code-splitting is a post-submission tidy-up.
- [x] Production preview served locally and every route requested directly
      (deep link, as a judge opening a shared link would).

### Routes tested in preview — all returned 200

| Route | Result |
| --- | --- |
| `/` (Home / Case Board) | 200 |
| `/home` (alias) | 200 |
| `/trial` | 200 |
| `/trial?defendant=rainfall` (demo path) | 200 |
| `/trial?defendant=temperature` | 200 |
| `/evidence` | 200 |
| `/verdict` | 200 |
| `/verdict?defendant=temperature` | 200 |
| `/lab` | 200 |
| `/about` | 200 |
| `/trends.json` | 200 |

Note: this was a local preview on this machine, not a deployed site and not a
logged-out test on a phone. That test still belongs to Sunday (below).

### Numbers cross-checked against trends.json / the locked plan — 21 of 21 PASS

An automated check compared `public/trends.json` field by field with the
locked plan's evidence table:

- Temperature: trend −0.054 °C/yr; confidence 99.4%; Hamed-Rao p 0.0057;
  Yue-Pilon p 0.018; 2000–2019 Hamed-Rao p 0.056; drop-2020 trend −0.047 °C/yr;
  means 27.09 °C (2000–2004) and 25.78 °C (2021–2025) — **all PASS**
- Rainfall: trend +13.5 mm/yr; confidence 99.95%; Hamed-Rao p 0.0005;
  Yue-Pilon p 0.0047; 2000–2019 Hamed-Rao p 0.30; drop-2020 trend +13.3 mm/yr;
  means 279 mm (2000–2004) and 636 mm (2021–2025); wet year 2020 = 1,075.2 mm
  — **all PASS**
- Both verdicts = “Not Proven — Don't trust it yet” — **PASS**
- Location 31.42° N, 73.08° E — **PASS**
- `annual_series` is empty for both defendants (no annual values fabricated;
  the plan does not contain the full series) — **PASS**
- Grep of `src/`: **no evidence numbers are hard-coded** in components — every
  result number renders from trends.json at runtime — **PASS**
- Slides: deck text extracted from `slides/trend-court-slides.pptx` and the
  numbers above were confirmed present with the same values; all 7 slides
  were rendered (LibreOffice → PDF → images) and visually checked for
  overflow — **PASS**
- Demo script: `demo/demo-script.md` is the plan's script verbatim; its three
  spoken numbers (99.95 percent, 13.5 millimetres a year, “Not Proven”) match
  trends.json — **PASS**

### Overnight polish applied to the app

Chart figures gained descriptive aria-labels; table headers gained
`scope="col"`; nav/buttons gained visible keyboard focus outlines; Evidence
tables scroll within their cards on narrow screens; the defendant picker
wraps on mobile; the Verdict page now says “wet 2020s” for Rainfall and
“changed 2020s” for Temperature (it previously said “wet / changed” for
both); a missing full stop was fixed on the About page. Quoted verdict
wording from the plan was not changed.

## Known blockers — read these first on Sunday

1. **GitHub repo not selected / branch not pushed.** GitHub is connected, but
   no Trend Court repository has been selected for Muse's access, so
   `member2/frontend-story` exists **locally only** (also in the zip the team
   was given). Next step: select/create the repo, push this branch, open a
   draft PR. **The team merges — Muse does not.**
2. **Member 1's frozen trends.json is still pending.** The app runs on the
   starter file built from plan numbers, clearly marked in its meta. Member 1
   must supply the frozen file with the full 26-value annual series and the
   change-point test output. Swapping it in is a file replacement — the
   annual line chart then renders automatically — but every page, the slides
   and the demo script must be re-checked against the new file afterwards.
   If the frozen file changes any number, the slides and spoken script must
   change too.
3. **Deployment not yet done.** No Vercel/Netlify (or other) deployment
   exists. `vercel.json` and `public/_redirects` are in the repo so the six
   routes work as deep links once deployed.
4. **Demo video not yet recorded.** Script, checklist and timings are ready
   in `demo/`. Nothing has been recorded or uploaded.
5. **Nothing has been submitted.** `submission/submission-draft.md` is a
   local draft with the link placeholders left blank.

## Sunday sequence (from the locked plan, adapted)

- [ ] Midday: freeze features and pages. No new pages, cities, variables or
      datasets.
- [ ] Receive Member 1's frozen trends.json; replace `public/trends.json`;
      re-run the number cross-check on app + slides + demo script.
- [ ] Confirm the change-point result is recorded in trends.json; if no
      single year is confirmed, the app keeps saying “candidate shift around
      2020 — not confirmed to a single year”.
- [ ] Push `member2/frontend-story`, open a draft PR, team reviews and merges.
- [ ] Deploy the merged build; record the demo on the Home → Trial → Verdict
      click-path only (`demo/` folder).
- [ ] Multi-page logged-out test on phone **and** laptop: Home, Trial,
      Evidence, Verdict, Method Lab, About — follow every navigation link,
      confirm trends.json numbers are identical on every page. Test the demo
      link logged out too.
- [ ] Paste the public demo and live-project links into the submission draft,
      then paste the copy into the project page (Lock toggle while editing,
      save often, publish).
- [ ] Confirm both registered members are listed on the Project Page for the
      same Local Event.
- [ ] Submit by **8:00 pm PKT** (hard close 11:59 pm PKT) and confirm the
      submission banner.

## Standing rules (do not break these in the Sunday rush)

- Do not quote a Bayesian posterior, a MODIS result or a GRACE result that was
  not computed and recorded in trends.json.
- Do not present rainfall as rain-gauge data.
- Do not present the temperature fall as a reason to relax heat planning.
- If a page cannot be fed from trends.json, leave its slot as “not tested”.
