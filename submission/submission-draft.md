# DRAFT — NOT SUBMITTED

> This is a local draft prepared overnight for Team Mind Flayer to review and
> paste into the NASA Space Apps project page themselves on Sunday.
> **Nothing has been submitted.** The bracketed Project Demo and Final Project
> links are intentionally left blank until the team has public links that have
> been tested logged out.
>
> Source: "Submission copy — ready to paste" in the locked plan
> (trend-court-winning-plan). The project page must be in written English.
> All fields are required: High-Level Summary, Project Demo, Final Project,
> Project Details, Use of SI (International System of Units), and
> Space Agency Data References.
> Reminder from the plan: use the edit Lock toggle while one member edits the
> Project Page, save progress often, and publish — changes are not live until
> published. Team target: submit by 8:00 pm PKT, ahead of the 11:59 pm close.

---

## High-Level Summary

Trend Court is a multi-page web app that puts Faisalabad’s climate trends on trial. Using 26 years of NASA POWER data (2000–2025), it tests whether temperature and rainfall trends are real or misleading. Both trends are statistically significant over the full period after autocorrelation correction, but neither is significant on 2000–2019 alone — the change is driven by the 2020s. Across its pages — Home / Case Board, The Trial, Evidence Vault, Verdict & Planner Action, Method / Change-Point Lab, and About / Data & Caveats — the app shows the evidence chart, a confidence label, a candidate change-point around 2020, and a plain verdict — Proven, Not Proven, or Too Weak to Trust — so a city water and drainage planner knows whether a trend is strong enough to act on.

## Project Details

Trend Court is a multi-page web app with six routes: Home / Case Board, The Trial, Evidence Vault, Verdict & Planner Action, Method / Change-Point Lab, and About / Data & Caveats, all reading a single data file so every page quotes the same numbers. Region: Faisalabad, Punjab, Pakistan (31.42° N, 73.08° E). Variables: annual mean 2-metre air temperature (T2M, °C) and annual total corrected precipitation (PRECTOTCORR, mm). Method: Mann-Kendall trend test with Sen’s slope, Hamed-Rao and Yue-Pilon autocorrelation corrections, a 2000–2019 sub-period check, and a drop-2020 sensitivity check, plus a change-point test recorded in the project data file; the change-point around 2020 is a candidate to be confirmed by that named test during the build, not a proven year. Results: temperature −0.054 °C per year (Hamed-Rao p ≈ 0.0057) and rainfall +13.5 mm per year (Hamed-Rao p ≈ 0.0005) over 2000–2025; neither trend is significant on 2000–2019 alone after correction, so both receive the verdict “Not Proven — don’t trust it yet” as a steady long-term trend. Caveats: POWER precipitation is a model and reanalysis product, not rain-gauge data; the temperature result needs a MODIS land-surface-temperature cross-check and must not be used to relax heat planning.

## Space Agency Data, Use of SI, Demo and Final Project, and AI declaration

- Space Agency Data References: NASA POWER (Prediction of Worldwide Energy Resources), variables T2M and PRECTOTCORR, Faisalabad point (31.42° N, 73.08° E), 2000–2025.
- Use of SI: temperature in degrees Celsius (°C), precipitation in millimetres (mm), trend rates in °C per year and mm per year, coordinates in decimal degrees.
- Project Demo: [ ]
- Final Project: [ ]
- AI-use declaration: Team Mind Flayer used Muse AI as a building helper for code, debugging, checking numbers against the project data file, and drafting submission text. All data, statistical tests, and results are from the NASA dataset and methods stated above, and the team reviewed and verified the final project. Muse AI is not a registered team member.
