# Demo recording checklist — click by click

Status: **NOT YET RECORDED.** No video exists yet. This checklist is for the
person recording on Sunday. Timings are in `timings.md`; the words are in
`demo-script.md` and must not be changed.

## Before recording

- [ ] Use the deployed live app if available, otherwise the local production
      preview (`npm run build` then `npm run preview`). The app must be the
      version whose numbers match `public/trends.json`.
- [ ] Open the app **logged out**, as judges will. Close other tabs, mute
      notifications, set the browser window to a clean size.
- [ ] Check the three numbers you will say out loud against trends.json:
      Rainfall +13.5 mm per year, confidence 99.95%, verdict
      “Not Proven — Don't trust it yet”.
- [ ] Rehearse the click-path once without recording. One path only:
      Home → Rainfall Trial → Verdict.
- [ ] Say on camera that this is one click-path (per the plan).

## Click by click

1. [ ] Start recording on **Home / Case Board** (`/`). Let the defendant
       cards be visible for a beat before speaking.
2. [ ] Say the opening lines (0:00–0:05, see `timings.md`).
3. [ ] Click **“Put on trial”** on the **Rainfall** card (goes to
       `/trial?defendant=rainfall`).
4. [ ] On **The Trial**, let the Charge, the evidence chart and the
       confidence label (99.95%) be seen while you say the Trial lines.
5. [ ] Scroll to **Cross-examination** for the “2000 to 2019 alone” line.
       Do not click Evidence, Method Lab or About.
6. [ ] Click **“See the verdict”** (goes to `/verdict?defendant=rainfall`).
7. [ ] End on the **Verdict & Planner Action** page with the
       “Not Proven — Don't trust it yet” badge visible. Stop recording at
       ~0:30.

## After recording

- [ ] Watch the take back: every word matches the script, total length is
      about 30 seconds, no other pages were toured.
- [ ] Upload the video where judges can open it **logged out**, and test
      that link logged out before pasting it anywhere.
- [ ] Paste the public link into the Project Demo slot in
      `submission/submission-draft.md` (replacing the placeholder) — the
      team submits it themselves; nothing is submitted automatically.
- [ ] If a take shows a number that differs from trends.json, re-record —
      do not edit the number in post.
